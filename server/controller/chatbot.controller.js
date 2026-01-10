const { generateChatbotResponse } = require('../services/ai.service');
const Lead = require('../model/Lead.model');
const Business = require('../model/Business.model');
const Service = require('../model/Service');
const { analyzeLead } = require('../services/ai.service');
const { sendUserConfirmationEmail, sendOwnerNotificationEmail } = require('../config/email');
// TWILIO INTEGRATION - COMMENTED OUT (Using notifyOwner with email fallback)
// const { sendEmergencyAlert, sendCustomerAutoReply } = require('../utils/twilio');
const { notifyOwner } = require('../utils/notifyOwner');

// Store conversation sessions (in production, use Redis or database)
const conversationSessions = new Map();

// HARDCODED SYSTEM PROMPT
const SYSTEM_PROMPT = `You are a professional emergency services intake assistant for a restoration company.
You ask short, direct questions.
You never give pricing.
You focus on urgency and location.`;

// Conversation steps
const STEPS = {
  issue: {
    question: "Can you tell me what problem you're facing?",
    field: 'issue',
    nextStep: 'location'
  },
  location: {
    question: "What city or ZIP code is the property located in?",
    field: 'location',
    nextStep: 'urgency'
  },
  urgency: {
    question: "Is this an emergency right now?",
    field: 'urgency',
    options: ['Emergency', 'Today', 'Flexible'],
    nextStep: 'name'
  },
  name: {
    question: "May I have your name?",
    field: 'name',
    nextStep: 'phone'
  },
  phone: {
    question: "What phone number can we call you on?",
    field: 'phone',
    nextStep: 'complete'
  }
};

// Emergency keywords
const EMERGENCY_KEYWORDS = ['flood', 'burst pipe', 'fire', 'sewage', 'sewer', 'water leak', 'emergency', 'urgent', 'asap'];

/**
 * Check if message contains emergency keywords
 */
const isEmergency = (message) => {
  const lower = message.toLowerCase();
  return EMERGENCY_KEYWORDS.some(keyword => lower.includes(keyword));
};

/**
 * Normalize urgency to only "emergency" or "normal"
 */
const normalizeUrgency = (urgency) => {
  if (!urgency) return 'normal';
  
  const lower = urgency.toLowerCase();
  if (lower === 'emergency' || lower === 'urgent' || lower === 'high' || lower === 'asap') {
    return 'emergency';
  }
  return 'normal';
};

/**
 * Check if current time is after-hours (6 PM - 8 AM local time)
 * @param {String} timezone - Optional timezone (e.g., 'America/New_York'), defaults to server timezone
 * @returns {Boolean}
 */
const isAfterHours = (timezone = null) => {
  try {
    let hour;
    
    if (timezone) {
      // Use specified timezone
      const date = new Date();
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: 'numeric',
        hour12: false
      });
      hour = parseInt(formatter.format(date));
    } else {
      // Use server local time
      const now = new Date();
      hour = now.getHours();
    }
    
    // After-hours: 6 PM (18:00) to 8 AM (08:00)
    return hour >= 18 || hour < 8;
  } catch (error) {
    console.error('Error checking after-hours:', error);
    // Default to false if timezone is invalid
    return false;
  }
};

/**
 * Extract structured data from conversation
 */
const extractStructuredData = (session) => {
  return {
    issue: session.leadData.issue || '',
    location: session.leadData.location || '',
    urgency: session.leadData.urgency || 'normal',
    name: session.leadData.name || '',
    phone: session.leadData.phone || ''
  };
};

/**
 * Get or create conversation session
 */
const getSession = (sessionId) => {
  if (!conversationSessions.has(sessionId)) {
    conversationSessions.set(sessionId, {
      messages: [],
      leadData: {},
      step: 'issue'
    });
  }
  return conversationSessions.get(sessionId);
};

/**
 * Create chatbot lead (simplified endpoint)
 * POST /api/chatbot/lead
 */
const createChatbotLead = async (req, res) => {
  try {
    const { issue, location, urgency, name, phone, timezone } = req.body;

    // Validation
    if (!issue || !location || !name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: issue, location, name, phone'
      });
    }

    // Normalize urgency
    const normalizedUrgency = normalizeUrgency(urgency);

    // Detect after-hours
    const afterHours = isAfterHours(timezone);

    // Get business (use first active business if not specified)
    const business = await Business.findOne({ isActive: true });
    
    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'No active business found. Please configure a business first.'
      });
    }

    // Try to match service from issue
    let service = null;
    const issueLower = issue.toLowerCase();
    if (issueLower.includes('water') || issueLower.includes('flood') || issueLower.includes('leak')) {
      service = await Service.findOne({ title: { $regex: /water/i } });
    } else if (issueLower.includes('fire') || issueLower.includes('smoke')) {
      service = await Service.findOne({ title: { $regex: /fire/i } });
    } else if (issueLower.includes('mold')) {
      service = await Service.findOne({ title: { $regex: /mold/i } });
    }

    // Create lead (save to MongoDB)
    const lead = await Lead.create({
      businessId: business._id,
      serviceId: service?._id || null,
      serviceName: service?.title || issue || 'General Service',
      name: name.trim(),
      phone: phone.trim(),
      email: `chatbot_${Date.now()}@temp.com`, // Temporary email
      pincode: location.trim(), // Use location as pincode
      description: issue.trim(),
      intent: normalizedUrgency === 'emergency' ? 'emergency' : 'inquiry',
      urgency: normalizedUrgency,
      status: 'new',
      source: 'chatbot',
      afterHours: afterHours
    });

    // Send owner notifications using central controller (respects preferences and toggles)
    const isEmergencyLead = normalizedUrgency === 'emergency';
    const isDemoMode = process.env.DEMO_MODE === 'true' || (!process.env.ENABLE_SMS && !process.env.ENABLE_WHATSAPP);

    // Use central notification controller (handles SMS/WhatsApp/Email with fallback)
    try {
      await notifyOwner({
        business,
        leadData: {
          issue,
          location,
          phone,
          createdAt: lead.createdAt,
          afterHours: afterHours
        },
        isEmergency: isEmergencyLead,
        isDemoMode: isDemoMode
      });
    } catch (err) {
      console.error('Owner notification error:', err);
      // Continue even if notifications fail - lead is already saved
    }

    // Send other notifications asynchronously (don't block response)
    Promise.all([
      // Auto-reply to customer for normal leads only
      !isEmergencyLead && phone
        ? sendCustomerAutoReply(phone, name).catch(err => console.error('Customer auto-reply error:', err))
        : Promise.resolve()
    ]);

    // Return response AFTER lead is saved and alerts are sent
    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: {
        _id: lead._id,
        issue,
        location,
        urgency: normalizedUrgency,
        name,
        phone,
        afterHours,
        createdAt: lead.createdAt
      }
    });
  } catch (error) {
    console.error('Create chatbot lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating lead',
      error: error.message
    });
  }
};

/**
 * Handle structured chatbot message (HARDCODED FLOW)
 * POST /api/chatbot/structured
 */
const handleStructuredMessage = async (req, res) => {
  try {
    const { sessionId, message, currentStep } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({
        success: false,
        message: 'Session ID and message are required'
      });
    }

    const session = getSession(sessionId);
    const userMessage = message.trim();

    // Determine current step
    let step = currentStep || session.step || 'issue';
    const stepConfig = STEPS[step];

    if (!stepConfig) {
      return res.status(400).json({
        success: false,
        message: 'Invalid step'
      });
    }

    // Store user response
    if (step === 'urgency') {
      // For urgency, accept the option clicked or text
      const urgencyMap = {
        'emergency': 'emergency',
        'today': 'high',
        'flexible': 'normal'
      };
      const lower = userMessage.toLowerCase();
      session.leadData.urgency = urgencyMap[lower] || 'normal';
    } else {
      session.leadData[stepConfig.field] = userMessage;
    }

    // Check for emergency keywords in issue
    if (step === 'issue' && isEmergency(userMessage)) {
      session.leadData.urgency = 'emergency';
    }

    // Add user message to history
    session.messages.push({ role: 'user', content: userMessage });

    // Move to next step
    const nextStep = stepConfig.nextStep;
    session.step = nextStep;

    // Check if complete
    const isComplete = nextStep === 'complete';
    
    let assistantMessage = '';
    if (isComplete) {
      assistantMessage = 'Thank you! I have all the information. Our team will contact you within 60 minutes.';
    } else {
      assistantMessage = STEPS[nextStep].question;
    }

    // Add assistant message to history
    session.messages.push({ role: 'assistant', content: assistantMessage });

    // Return structured data if complete
    const leadData = isComplete ? extractStructuredData(session) : null;

    res.status(200).json({
      success: true,
      message: assistantMessage,
      nextStep: nextStep,
      isComplete,
      leadData,
      options: STEPS[nextStep]?.options || null
    });
  } catch (error) {
    console.error('Structured chatbot error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing chatbot message',
      error: error.message
    });
  }
};

/**
 * Submit structured lead
 * POST /api/chatbot/structured/submit
 */
const submitStructuredLead = async (req, res) => {
  try {
    const { sessionId, businessId, serviceId, timezone } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required'
      });
    }

    const session = conversationSessions.get(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    const leadData = extractStructuredData(session);

    // Validate required fields
    if (!leadData.issue || !leadData.location || !leadData.name || !leadData.phone) {
      return res.status(400).json({
        success: false,
        message: 'Missing required information. Please complete the conversation.'
      });
    }

    // Normalize urgency
    const normalizedUrgency = normalizeUrgency(leadData.urgency);

    // Detect after-hours
    const afterHours = isAfterHours(timezone);

    // Get business
    let business;
    if (businessId) {
      business = await Business.findById(businessId);
    } else {
      business = await Business.findOne({ isActive: true });
    }

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found. Please configure a business first.'
      });
    }

    // Get service (try to match from issue)
    let service;
    if (serviceId) {
      service = await Service.findById(serviceId);
    } else {
      // Try to find service by keywords in issue
      const issueLower = leadData.issue.toLowerCase();
      if (issueLower.includes('water') || issueLower.includes('flood') || issueLower.includes('leak')) {
        service = await Service.findOne({ title: { $regex: /water/i } });
      } else if (issueLower.includes('fire') || issueLower.includes('smoke')) {
        service = await Service.findOne({ title: { $regex: /fire/i } });
      } else if (issueLower.includes('mold')) {
        service = await Service.findOne({ title: { $regex: /mold/i } });
      }
    }

    // AI Analysis
    const aiResult = await analyzeLead(
      service?.title || leadData.issue || 'General Service',
      leadData.issue
    );

    // Override urgency if emergency keywords detected
    if (isEmergency(leadData.issue) || leadData.urgency === 'emergency') {
      aiResult.urgency = 'emergency';
    } else {
      aiResult.urgency = normalizedUrgency;
    }

    // Prevent duplicate submissions - check if session is already submitted
    if (session.submitted) {
      return res.status(400).json({
        success: false,
        message: 'This lead has already been submitted'
      });
    }

    // Mark session as submitted BEFORE creating lead (prevents race conditions)
    session.submitted = true;
    const sessionData = extractStructuredData(session);

    // Create lead (save to MongoDB)
    const lead = await Lead.create({
      businessId: business._id,
      serviceId: service?._id || null, // Allow null for chatbot leads
      serviceName: service?.title || leadData.issue || 'General Service',
      name: leadData.name,
      phone: leadData.phone,
      email: `chatbot_${Date.now()}@temp.com`, // Temporary email for chatbot leads
      pincode: leadData.location,
      description: leadData.issue,
      intent: aiResult.intent,
      urgency: aiResult.urgency,
      aiAnalysis: aiResult.analysis,
      status: 'new',
      source: 'chatbot',
      afterHours: afterHours
    });

    // Send owner notifications using central controller (respects preferences and toggles)
    const isEmergencyLead = aiResult.urgency === 'emergency';
    const isDemoMode = process.env.DEMO_MODE === 'true' || (!process.env.ENABLE_SMS && !process.env.ENABLE_WHATSAPP);

    // Use central notification controller (handles SMS/WhatsApp/Email with fallback)
    try {
      await notifyOwner({
        business,
        leadData: {
          issue: leadData.issue,
          location: leadData.location,
          phone: leadData.phone,
          createdAt: lead.createdAt,
          afterHours: afterHours
        },
        isEmergency: isEmergencyLead,
        isDemoMode: isDemoMode
      });
    } catch (err) {
      console.error('Owner notification error:', err);
      // Continue even if notifications fail - lead is already saved
    }

    // Send other notifications asynchronously (don't block response)
    Promise.all([
      // Auto-reply to customer for normal leads only
      !isEmergencyLead && leadData.phone
        ? sendCustomerAutoReply(leadData.phone, leadData.name).catch(err => console.error('Customer auto-reply error:', err))
        : Promise.resolve()
    ]);

    // Clear session AFTER lead is saved and alerts are sent (prevents duplicate submissions)
    conversationSessions.delete(sessionId);

    // Return response AFTER everything is complete
    res.status(201).json({
      success: true,
      message: 'Lead submitted successfully. Our team will contact you within 60 minutes.',
      leadId: lead._id,
      leadData: {
        ...sessionData,
        afterHours,
        createdAt: lead.createdAt
      }
    });
  } catch (error) {
    console.error('Submit structured lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting lead',
      error: error.message
    });
  }
};

// Legacy functions (keep for backward compatibility)

const extractInfo = (message, leadData) => {
  const lower = message.toLowerCase();
  const updated = { ...leadData };

  // Extract email
  const emailMatch = message.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
  if (emailMatch) {
    updated.email = emailMatch[0];
  }

  // Extract phone
  const phoneMatch = message.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\d{10,}/);
  if (phoneMatch) {
    updated.phone = phoneMatch[0].replace(/\D/g, '');
  }

  // Extract pincode/zip
  const zipMatch = message.match(/\b\d{5,6}\b/);
  if (zipMatch) {
    updated.pincode = zipMatch[0];
  }

  return updated;
};

const getNextQuestion = (leadData) => {
  if (!leadData.name) return 'name';
  if (!leadData.phone) return 'phone';
  if (!leadData.email) return 'email';
  if (!leadData.serviceType) return 'serviceType';
  if (!leadData.pincode) return 'pincode';
  if (!leadData.description) return 'description';
  return 'complete';
};

const handleChatbotMessage = async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({
        success: false,
        message: 'Session ID and message are required'
      });
    }

    const session = getSession(sessionId);
    const userMessage = message.trim();

    session.leadData = extractInfo(userMessage, session.leadData);
    session.messages.push({ role: 'user', content: userMessage });

    const aiResponse = await generateChatbotResponse(
      session.messages.slice(0, -1),
      userMessage,
      session.leadData
    );

    session.messages.push({ role: 'assistant', content: aiResponse });

    const nextQuestion = getNextQuestion(session.leadData);
    session.step = nextQuestion;
    const isComplete = nextQuestion === 'complete';

    res.status(200).json({
      success: true,
      message: aiResponse,
      leadData: session.leadData,
      step: session.step,
      isComplete,
      sessionId
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing chatbot message',
      error: error.message
    });
  }
};

const submitChatbotLead = async (req, res) => {
  try {
    const { sessionId, businessId, serviceId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required'
      });
    }

    const session = conversationSessions.get(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    const { leadData } = session;

    if (!leadData.name || !leadData.email || !leadData.phone || !leadData.pincode) {
      return res.status(400).json({
        success: false,
        message: 'Missing required information. Please complete the conversation.'
      });
    }

    let business;
    if (businessId) {
      business = await Business.findById(businessId);
    } else {
      business = await Business.findOne({ isActive: true });
    }

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found. Please configure a business first.'
      });
    }

    let service;
    if (serviceId) {
      service = await Service.findById(serviceId);
    } else if (leadData.serviceType) {
      service = await Service.findOne({
        title: { $regex: leadData.serviceType, $options: 'i' }
      });
    }

    const aiResult = await analyzeLead(
      service?.title || leadData.serviceType || 'General Service',
      leadData.description || ''
    );

    const lead = await Lead.create({
      businessId: business._id,
      serviceId: service?._id || null, // Allow null for chatbot leads
      serviceName: service?.title || leadData.serviceType || 'General Service',
      name: leadData.name,
      phone: leadData.phone,
      email: leadData.email,
      pincode: leadData.pincode,
      description: leadData.description || '',
      intent: aiResult.intent,
      urgency: aiResult.urgency,
      aiAnalysis: aiResult.analysis,
      status: 'new',
      source: 'chatbot'
    });

    const ownerPhone = business.settings?.ownerPhone || business.phone;
    const isEmergency = aiResult.urgency === 'emergency';

    // Send owner alerts BEFORE API responds (only for emergencies)
    if (isEmergency && ownerPhone) {
      // Detect after-hours for this lead
      const afterHours = isAfterHours(); // Use default timezone
      
      // Send emergency alerts immediately (await to ensure they're sent before response)
      try {
        await sendEmergencyAlert(ownerPhone, {
          issue: lead.serviceName || leadData.serviceType || 'General Service',
          location: leadData.pincode || '',
          phone: leadData.phone,
          createdAt: lead.createdAt,
          afterHours: afterHours
        });
        console.log('Emergency alerts sent to owner');
      } catch (err) {
        console.error('Emergency alert error:', err);
        // Continue even if alerts fail
      }
    }

    // Send other notifications asynchronously (don't block response)
    Promise.all([
      sendUserConfirmationEmail(leadData.email, leadData.name, lead.serviceName).catch(err =>
        console.error('User email error:', err)
      ),
      sendOwnerNotificationEmail({
        ...lead.toObject(),
        businessName: business.name,
        ownerEmail: business.settings?.ownerEmail || business.email
      }).catch(err =>
        console.error('Owner email error:', err)
      ),
      
      // Auto-reply to customer for normal leads
      !isEmergency && leadData.phone
        ? sendCustomerAutoReply(leadData.phone, leadData.name).catch(err => console.error('Customer auto-reply error:', err))
        : Promise.resolve()
    ]);

    conversationSessions.delete(sessionId);

    res.status(201).json({
      success: true,
      message: 'Lead submitted successfully. Our team will contact you within 60 minutes.',
      leadId: lead._id
    });
  } catch (error) {
    console.error('Submit lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting lead',
      error: error.message
    });
  }
};

const getSessionData = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = conversationSessions.get(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.status(200).json({
      success: true,
      messages: session.messages,
      leadData: session.leadData,
      step: session.step
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching session',
      error: error.message
    });
  }
};

module.exports = {
  handleChatbotMessage,
  submitChatbotLead,
  getSessionData,
  handleStructuredMessage,
  submitStructuredLead,
  createChatbotLead
};
