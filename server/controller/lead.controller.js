const Lead = require('../model/Lead.model');
const DiscountLead = require('../models/Lead'); // Simple model for discount modal leads
const Business = require('../model/Business.model');
const Service = require('../model/Service');
const { sendUserConfirmationEmail, sendOwnerNotificationEmail } = require('../config/email');
const { analyzeLead } = require('../services/ai.service');
const { triggerWebhook } = require('../services/webhook.service');
// TWILIO INTEGRATION - COMMENTED OUT (Using notifyOwner with email fallback)
// const { sendEmergencyAlert, sendCustomerAutoReply } = require('../utils/twilio');
const { notifyOwner } = require('../utils/notifyOwner');

// @desc    Get all leads for a business
// @route   GET /api/leads?businessId=xxx
// @access  Public (for demo) or Private
const getLeads = async (req, res) => {
  try {
    // Debug: Log that this endpoint was called
    console.log('GET /api/leads called - Public endpoint');
    
    const { businessId, status, urgency, source } = req.query;
    
    // Build query
    const query = {};

    // If user is authenticated, filter by their businesses
    if (req.user && req.user.id) {
      const userId = req.user.id;

      if (businessId) {
        // Verify business belongs to user
        const business = await Business.findOne({
          _id: businessId,
          userId,
          isActive: true
        });

        if (!business) {
          return res.status(404).json({
            success: false,
            message: 'Business not found'
          });
        }

        query.businessId = businessId;
      } else {
        // Get all businesses for user
        const businesses = await Business.find({ userId, isActive: true });
        const businessIds = businesses.map(b => b._id);
        query.businessId = { $in: businessIds };
      }
    } else {
      // Demo mode: get all leads from all active businesses
      const businesses = await Business.find({ isActive: true });
      const businessIds = businesses.map(b => b._id);
      if (businessIds.length > 0) {
        query.businessId = { $in: businessIds };
      } else {
        // No businesses found - return empty array instead of error
        return res.status(200).json({
          success: true,
          count: 0,
          data: []
        });
      }
    }

    // Optional filters
    if (status) query.status = status;
    if (urgency) query.urgency = urgency;
    if (source) query.source = source;

    const leads = await Lead.find(query)
      .populate('serviceId', 'title image')
      .populate('businessId', 'name email')
      .sort({ createdAt: -1 })
      .limit(100); // Limit for performance

    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching leads',
      error: error.message
    });
  }
};

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
const getLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('serviceId', 'title image description')
      .populate('businessId', 'name email phone')
      .populate('assignedTo', 'name email');

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    // Verify business belongs to user
    const business = await Business.findOne({
      _id: lead.businessId._id,
      userId: req.user.id,
      isActive: true
    });

    if (!business) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this lead'
      });
    }

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching lead',
      error: error.message
    });
  }
};

// @desc    Create new lead (public endpoint - for forms/chatbot)
// @route   POST /api/leads
// @access  Public (or optional auth)
const createLead = async (req, res) => {
  try {
    const { businessId, serviceId, name, phone, email, pincode, description, source } = req.body;

    // Validation
    if (!businessId || !serviceId || !name || !phone || !email || !pincode) {
      return res.status(400).json({
        success: false,
        message: 'Please provide: businessId, serviceId, name, phone, email, and pincode'
      });
    }

    // Verify business exists and is active
    const business = await Business.findById(businessId);
    if (!business || !business.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Business not found or inactive'
      });
    }

    // Verify service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // AI Analysis
    const aiResult = await analyzeLead(service.title, description || '');

    // Create lead
    const lead = await Lead.create({
      businessId,
      serviceId,
      serviceName: service.title,
      name,
      phone,
      email,
      pincode,
      description: description || '',
      intent: aiResult.intent,
      urgency: aiResult.urgency,
      aiAnalysis: aiResult.analysis,
      status: 'new',
      source: source || 'form'
    });

    // Populate for response
    await lead.populate('serviceId', 'title image');
    await lead.populate('businessId', 'name email');

    // Send owner notifications using central controller (respects preferences and toggles)
    const isEmergency = aiResult.urgency === 'emergency';
    const isDemoMode = process.env.DEMO_MODE === 'true' || (!process.env.ENABLE_SMS && !process.env.ENABLE_WHATSAPP);

    // Use central notification controller (handles SMS/WhatsApp/Email with fallback)
    try {
      await notifyOwner({
        business,
        leadData: {
          issue: service.title,
          location: pincode,
          phone: phone,
          createdAt: lead.createdAt,
          afterHours: false // Could be calculated if needed
        },
        isEmergency: isEmergency,
        isDemoMode: isDemoMode
      });
    } catch (err) {
      console.error('Owner notification error:', err);
      // Continue even if notifications fail - lead is already saved
    }

    Promise.all([
      sendUserConfirmationEmail(email, name, service.title).catch(err => 
        console.error('User email error:', err)
      ),
      
      // Auto-reply to customer for normal leads
      !isEmergency && phone
        ? sendCustomerAutoReply(phone, name).catch(err => console.error('Customer auto-reply error:', err))
        : Promise.resolve()
    ]);

    // Trigger webhook (async - don't block response)
    triggerWebhook(lead.toObject()).then(result => {
      if (result.success) {
        lead.webhookTriggered = true;
        lead.webhookResponse = result;
        lead.save().catch(err => console.error('Error saving webhook status:', err));
      }
    }).catch(err => {
      console.error('Webhook error:', err);
    });

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: lead
    });
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating lead',
      error: error.message
    });
  }
};

// @desc    Update lead status
// @route   PATCH /api/leads/:id/status
// @access  Public (for demo) or Private
const updateLeadStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const validStatuses = ['new', 'contacted', 'qualified', 'converted', 'closed', 'lost'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    // If user is authenticated, verify business belongs to user
    if (req.user && req.user.id) {
      const business = await Business.findOne({
        _id: lead.businessId,
        userId: req.user.id,
        isActive: true
      });

      if (!business) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this lead'
        });
      }
    }

    // Update status
    lead.status = status;
    
    // Add note if provided
    if (notes) {
      lead.notes.push({
        note: notes,
        addedBy: req.user?.id || null
      });
    }

    // Save to MongoDB (persist changes)
    await lead.save();

    // Return response AFTER save is complete
    res.status(200).json({
      success: true,
      message: 'Lead status updated',
      data: lead
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating lead status',
      error: error.message
    });
  }
};

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Private
const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    // Verify business belongs to user
    const business = await Business.findOne({
      _id: lead.businessId,
      userId: req.user.id,
      isActive: true
    });

    if (!business) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this lead'
      });
    }

    // Update allowed fields
    const { status, urgency, assignedTo, notes } = req.body;
    if (status) lead.status = status;
    if (urgency) lead.urgency = urgency;
    if (assignedTo) lead.assignedTo = assignedTo;
    if (notes) {
      lead.notes.push({
        note: notes,
        addedBy: req.user.id
      });
    }

    await lead.save();

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      data: lead
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating lead',
      error: error.message
    });
  }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    // Verify business belongs to user
    const business = await Business.findOne({
      _id: lead.businessId,
      userId: req.user.id,
      isActive: true
    });

    if (!business) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this lead'
      });
    }

    await Lead.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting lead',
      error: error.message
    });
  }
};

// @desc    Create discount modal lead (simplified - no business/service required)
// @route   POST /api/leads
// @access  Public
const createDiscountLead = async (req, res) => {
  try {
    const { name, email, source } = req.body;

    // Only handle discount_modal source in this endpoint
    // For other sources, use the regular createLead endpoint
    if (source && source !== 'discount_modal') {
      return res.status(400).json({
        success: false,
        message: 'Invalid source. Use /api/leads for other lead types.'
      });
    }

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Create lead with discount_modal source using simple model
    const lead = await DiscountLead.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      source: 'discount_modal'
    });

    res.status(201).json({
      success: true,
      message: 'Lead created successfully'
    });
  } catch (error) {
    console.error('Error creating discount lead:', error);
    
    // Handle duplicate email or validation errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'This email has already been submitted'
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors).map(e => e.message).join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating lead'
    });
  }
};

module.exports = {
  getLeads,
  getLead,
  createLead,
  createDiscountLead,
  updateLeadStatus,
  updateLead,
  deleteLead
};

