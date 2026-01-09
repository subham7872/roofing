const { getSafeSteps } = require('./geminiService');
const axios = require('axios');

/**
 * Get AI provider from environment (OpenAI, Claude, or Gemini)
 */
const getAIProvider = () => {
  return process.env.AI_PROVIDER || 'openai'; // Default to OpenAI
};

/**
 * Call OpenAI GPT-4 API
 */
const callOpenAI = async (prompt, systemPrompt = '') => {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === 'YOUR_API_KEY') {
      throw new Error('OpenAI API key not configured');
    }

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: process.env.OPENAI_MODEL || 'gpt-4',
        messages: [
          ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI API error:', error.message);
    throw error;
  }
};

/**
 * Call Anthropic Claude API
 */
const callClaude = async (prompt, systemPrompt = '') => {
  try {
    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey || apiKey === 'YOUR_API_KEY') {
      throw new Error('Claude API key not configured');
    }

    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022',
        max_tokens: 500,
        system: systemPrompt || 'You are a helpful assistant for a restoration services company.',
        messages: [
          { role: 'user', content: prompt }
        ]
      },
      {
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.content[0].text.trim();
  } catch (error) {
    console.error('Claude API error:', error.message);
    throw error;
  }
};

/**
 * Analyze lead intent and urgency using AI (OpenAI, Claude, or Gemini)
 * @param {String} serviceName - Service name
 * @param {String} description - Lead description
 * @returns {Promise<Object>} AI analysis with intent and urgency
 */
const analyzeLead = async (serviceName, description = '') => {
  try {
    const provider = getAIProvider();
    const descriptionLower = (description || '').toLowerCase();
    const serviceLower = (serviceName || '').toLowerCase();

    let aiResponse = '';
    let intent = 'inquiry';
    let urgency = 'normal';

    // Try AI analysis first
    try {
      const prompt = `Analyze this restoration service inquiry and determine:
1. Intent: inquiry, emergency, quote, complaint, or other
2. Urgency: emergency, high, normal, or low

Service: ${serviceName}
Description: ${description || 'No description provided'}

Respond in JSON format:
{
  "intent": "inquiry|emergency|quote|complaint|other",
  "urgency": "emergency|high|normal|low",
  "reasoning": "brief explanation"
}`;

      const systemPrompt = 'You are an AI assistant that analyzes customer inquiries for a 24/7 emergency restoration company. Be accurate and concise.';

      if (provider === 'openai') {
        aiResponse = await callOpenAI(prompt, systemPrompt);
      } else if (provider === 'claude') {
        aiResponse = await callClaude(prompt, systemPrompt);
      } else {
        // Fallback to Gemini
        aiResponse = await getSafeSteps(serviceName, description || 'Service inquiry');
      }

      // Try to parse JSON response
      try {
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          intent = parsed.intent || intent;
          urgency = parsed.urgency || urgency;
        }
      } catch (parseError) {
        // If JSON parsing fails, use keyword detection
        console.log('AI response not in JSON format, using keyword detection');
      }
    } catch (aiError) {
      console.log('AI analysis failed, using keyword detection:', aiError.message);
    }

    // Fallback keyword detection
    if (intent === 'inquiry' && urgency === 'normal') {
      if (descriptionLower.includes('emergency') || descriptionLower.includes('urgent') || 
          descriptionLower.includes('asap') || descriptionLower.includes('immediately') ||
          descriptionLower.includes('now') || descriptionLower.includes('right away')) {
        intent = 'emergency';
        urgency = 'emergency';
      } else if (descriptionLower.includes('quote') || descriptionLower.includes('price') || 
                 descriptionLower.includes('cost') || descriptionLower.includes('estimate')) {
        intent = 'quote';
      } else if (descriptionLower.includes('complaint') || descriptionLower.includes('issue') || 
                 descriptionLower.includes('problem') || descriptionLower.includes('dissatisfied')) {
        intent = 'complaint';
      }

      if (urgency === 'normal') {
        if (descriptionLower.includes('soon') || descriptionLower.includes('quick') || 
            descriptionLower.includes('today') || descriptionLower.includes('asap')) {
          urgency = 'high';
        } else if (descriptionLower.includes('later') || descriptionLower.includes('future') ||
                   descriptionLower.includes('someday') || descriptionLower.includes('maybe')) {
          urgency = 'low';
        }
      }
    }

    return {
      intent,
      urgency,
      analysis: aiResponse || 'AI analysis completed using keyword detection'
    };
  } catch (error) {
    console.error('AI analysis error:', error.message);
    // Return safe defaults on error
    return {
      intent: 'inquiry',
      urgency: 'normal',
      analysis: 'AI analysis unavailable. Default values assigned.'
    };
  }
};

/**
 * Generate chatbot response for conversation flow
 * @param {Array} conversationHistory - Array of {role, content} messages
 * @param {String} userMessage - Current user message
 * @param {Object} leadData - Current collected lead data
 * @returns {Promise<String>} AI response
 */
const generateChatbotResponse = async (conversationHistory, userMessage, leadData = {}) => {
  try {
    const provider = getAIProvider();
    
    const systemPrompt = `You are a helpful AI assistant for RestorePro Services, a 24/7 emergency restoration company.
Your role is to:
1. Ask qualification questions to understand the customer's needs
2. Collect: name, phone, email, service type, location (pincode), and description
3. Be friendly, professional, and empathetic
4. Guide the conversation naturally
5. Once you have all information, confirm details and offer to submit

Current collected data: ${JSON.stringify(leadData)}
Ask for missing information naturally.`;

    const messages = [
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ];

    const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n');

    let response = '';
    if (provider === 'openai') {
      response = await callOpenAI(prompt, systemPrompt);
    } else if (provider === 'claude') {
      response = await callClaude(prompt, systemPrompt);
    } else {
      // Fallback to simple response
      response = generateFallbackResponse(userMessage, leadData);
    }

    return response;
  } catch (error) {
    console.error('Chatbot response error:', error.message);
    return generateFallbackResponse(userMessage, leadData);
  }
};

/**
 * Generate fallback response when AI is not available
 */
const generateFallbackResponse = (userMessage, leadData) => {
  const message = userMessage.toLowerCase();
  const missing = [];

  if (!leadData.name) missing.push('name');
  if (!leadData.phone) missing.push('phone number');
  if (!leadData.email) missing.push('email');
  if (!leadData.serviceType) missing.push('service type');
  if (!leadData.pincode) missing.push('location (pincode)');

  if (missing.length === 0) {
    return `Great! I have all your information. Would you like me to submit your request? Our team will contact you within 60 minutes.`;
  }

  const nextField = missing[0];
  const responses = {
    name: "I'd be happy to help! What's your name?",
    phone: `Thanks ${leadData.name || ''}! What's your phone number so we can contact you?`,
    email: "What's your email address?",
    serviceType: "What type of service do you need? (Water damage, Fire damage, Mold, Storm damage, etc.)",
    pincode: "What's your location? Please provide your pincode/zip code."
  };

  return responses[nextField] || "How can I help you with your restoration needs today?";
};

module.exports = {
  analyzeLead,
  generateChatbotResponse,
  getAIProvider
};

