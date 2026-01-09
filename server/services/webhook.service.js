const axios = require('axios');

/**
 * Trigger n8n webhook with lead data
 * @param {Object} leadData - Lead data to send
 * @returns {Promise<Object>} Webhook response
 */
const triggerWebhook = async (leadData) => {
  try {
    const webhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!webhookUrl) {
      console.warn('N8N_WEBHOOK_URL not configured. Skipping webhook trigger.');
      return {
        success: false,
        message: 'Webhook URL not configured'
      };
    }

    // Prepare payload for n8n
    const payload = {
      event: 'new_lead',
      timestamp: new Date().toISOString(),
      lead: {
        id: leadData._id || leadData.id,
        businessId: leadData.businessId,
        serviceName: leadData.serviceName,
        name: leadData.name,
        phone: leadData.phone,
        email: leadData.email,
        pincode: leadData.pincode,
        description: leadData.description,
        intent: leadData.intent,
        urgency: leadData.urgency,
        status: leadData.status,
        source: leadData.source,
        aiAnalysis: leadData.aiAnalysis,
        createdAt: leadData.createdAt
      }
    };

    // Send to n8n webhook
    const response = await axios.post(webhookUrl, payload, {
      timeout: 10000, // 10 second timeout
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Webhook triggered successfully:', response.status);

    return {
      success: true,
      status: response.status,
      data: response.data
    };
  } catch (error) {
    // Don't fail the lead creation if webhook fails
    console.error('Webhook trigger error:', error.message);
    
    return {
      success: false,
      message: error.message,
      error: error.response?.data || error.message
    };
  }
};

module.exports = {
  triggerWebhook
};

