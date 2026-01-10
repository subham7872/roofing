// TWILIO INTEGRATION - COMMENTED OUT (Can be enabled when needed)
// const twilio = require('twilio');

/**
 * Check if SMS is enabled via environment variable
 */
const isSMSEnabled = () => {
  // Twilio disabled - always return false
  return false;
  // return process.env.ENABLE_SMS === 'true';
};

/**
 * Check if WhatsApp is enabled via environment variable
 */
const isWhatsAppEnabled = () => {
  // Twilio disabled - always return false
  return false;
  // return process.env.ENABLE_WHATSAPP === 'true';
};

/**
 * Initialize Twilio client
 */
const getTwilioClient = () => {
  // Twilio disabled - always return null
  return null;
  
  /* COMMENTED OUT - Enable when Twilio credentials are configured
  // Check environment toggles first
  if (!isSMSEnabled() && !isWhatsAppEnabled()) {
    return null; // Both disabled, no need to initialize
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken || accountSid === 'YOUR_ACCOUNT_SID' || authToken === 'YOUR_AUTH_TOKEN') {
    console.warn('Twilio not configured. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in .env');
    return null;
  }

  try {
    return twilio(accountSid, authToken);
  } catch (error) {
    console.error('Twilio initialization error:', error.message);
    return null;
  }
  */
};

/**
 * Format phone number to E.164 format
 */
const formatPhoneNumber = (phone) => {
  if (!phone) return null;
  
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '');
  
  // Add + if not present
  if (!cleaned.startsWith('+')) {
    // Assume US number if no country code
    if (cleaned.length === 10) {
      cleaned = '+1' + cleaned;
    } else {
      cleaned = '+' + cleaned;
    }
  }
  
  return cleaned;
};

/**
 * Send WhatsApp message
 * @param {String} to - Phone number (E.164 format: +1234567890)
 * @param {String} message - Message content
 * @returns {Promise<Object>} Result object
 */
const sendWhatsAppMessage = async (to, message) => {
  // Twilio disabled - return disabled message
  console.log('⚠️ Twilio WhatsApp disabled - notifications will use email fallback');
  return { success: false, error: 'Twilio WhatsApp disabled' };
  
  /* COMMENTED OUT - Enable when Twilio is configured
  try {
    // Check environment toggle first
    if (!isWhatsAppEnabled()) {
      console.log('⚠️ WhatsApp disabled via ENABLE_WHATSAPP=false, skipping WhatsApp message');
      return { success: false, error: 'WhatsApp disabled' };
    }

    const client = getTwilioClient();
    if (!client) {
      console.log('⚠️ Twilio not configured, skipping WhatsApp message');
      return { success: false, error: 'Twilio not configured' };
    }

    const from = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886'; // Twilio sandbox number

    // Format phone number
    const formattedTo = formatPhoneNumber(to);
    if (!formattedTo) {
      return { success: false, error: 'Invalid phone number' };
    }

    // Add whatsapp: prefix if not present
    const whatsappTo = formattedTo.startsWith('whatsapp:') 
      ? formattedTo 
      : 'whatsapp:' + formattedTo;

    const result = await client.messages.create({
      from: from,
      to: whatsappTo,
      body: message
    });

    console.log('WhatsApp message sent:', result.sid);
    return { success: true, messageSid: result.sid };
  } catch (error) {
    console.error('WhatsApp send error:', error.message);
    return { success: false, error: error.message };
  }
  */
};

/**
 * Send SMS message
 * @param {String} to - Phone number (E.164 format: +1234567890)
 * @param {String} message - Message content
 * @returns {Promise<Object>} Result object
 */
const sendSMS = async (to, message) => {
  // Twilio disabled - return disabled message
  console.log('⚠️ Twilio SMS disabled - notifications will use email fallback');
  return { success: false, error: 'Twilio SMS disabled' };
  
  /* COMMENTED OUT - Enable when Twilio is configured
  try {
    // Check environment toggle first
    if (!isSMSEnabled()) {
      console.log('⚠️ SMS disabled via ENABLE_SMS=false, skipping SMS');
      return { success: false, error: 'SMS disabled' };
    }

    const client = getTwilioClient();
    if (!client) {
      console.log('⚠️ Twilio not configured, skipping SMS');
      return { success: false, error: 'Twilio not configured' };
    }

    const from = process.env.TWILIO_PHONE_NUMBER || process.env.TWILIO_FROM || '+15707125308';

    if (!from) {
      console.warn('TWILIO_PHONE_NUMBER not set, cannot send SMS');
      return { success: false, error: 'Twilio phone number not configured' };
    }

    // Format phone number
    const formattedTo = formatPhoneNumber(to);
    if (!formattedTo) {
      return { success: false, error: 'Invalid phone number' };
    }

    const result = await client.messages.create({
      from: from,
      to: formattedTo,
      body: message
    });

    console.log('SMS sent:', result.sid);
    return { success: true, messageSid: result.sid };
  } catch (error) {
    console.error('SMS send error:', error.message);
    return { success: false, error: error.message };
  }
  */
};

/**
 * Send emergency alert to owner (WhatsApp + SMS)
 * @param {String} ownerPhone - Owner phone number
 * @param {Object} leadData - Lead data with issue, location, phone, createdAt, afterHours
 * @returns {Promise<Object>} Result object
 */
const sendEmergencyAlert = async (ownerPhone, leadData) => {
  // Twilio disabled - return disabled message
  // Email fallback will be used via notifyOwner.js
  console.log('⚠️ Twilio emergency alerts disabled - using email fallback');
  return {
    success: false,
    error: 'Twilio disabled - use email fallback',
    whatsapp: { success: false, error: 'Twilio disabled' },
    sms: { success: false, error: 'Twilio disabled' }
  };
  
  /* COMMENTED OUT - Enable when Twilio is configured
  try {
    if (!ownerPhone) {
      return { success: false, error: 'Owner phone number not provided' };
    }

    const { issue, location, phone, createdAt, afterHours } = leadData;
    
    // Format createdAt timestamp
    const timeStr = createdAt 
      ? new Date(createdAt).toLocaleString('en-US', { 
          timeZone: 'America/New_York',
          dateStyle: 'short',
          timeStyle: 'short'
        })
      : new Date().toLocaleString();

    // Format message with AFTER HOURS prefix if applicable
    const prefix = afterHours ? '⚠️ AFTER HOURS\n\n' : '';
    const message = `${prefix}🔥 EMERGENCY LEAD
Issue: ${issue}
Location: ${location}
Phone: ${phone}
Time: ${timeStr}`;

    // Send both WhatsApp and SMS (await both to ensure they're sent before response)
    // Wrap in try-catch to prevent crashes
    const results = await Promise.allSettled([
      sendWhatsAppMessage(ownerPhone, message).catch(err => {
        console.error('WhatsApp send error in sendEmergencyAlert:', err.message);
        return { success: false, error: err.message };
      }),
      sendSMS(ownerPhone, message).catch(err => {
        console.error('SMS send error in sendEmergencyAlert:', err.message);
        return { success: false, error: err.message };
      })
    ]);

    const whatsappResult = results[0].status === 'fulfilled' ? results[0].value : { success: false, error: results[0].reason?.message || 'Unknown error' };
    const smsResult = results[1].status === 'fulfilled' ? results[1].value : { success: false, error: results[1].reason?.message || 'Unknown error' };

    return {
      success: whatsappResult.success || smsResult.success,
      whatsapp: whatsappResult,
      sms: smsResult
    };
  } catch (error) {
    // Never throw - always return error object
    console.error('sendEmergencyAlert error:', error.message);
    return {
      success: false,
      error: error.message,
      whatsapp: { success: false, error: error.message },
      sms: { success: false, error: error.message }
    };
  }
  */
};

/**
 * Send auto-reply to customer (WhatsApp only)
 * @param {String} customerPhone - Customer phone number
 * @param {String} customerName - Customer name
 * @returns {Promise<Object>} Result object
 */
const sendCustomerAutoReply = async (customerPhone, customerName) => {
  // Twilio disabled - return disabled message
  // Email confirmation will be used instead
  console.log('⚠️ Twilio customer auto-reply disabled - email confirmation will be used');
  return { success: false, error: 'Twilio disabled - use email confirmation' };
  
  /* COMMENTED OUT - Enable when Twilio is configured
  try {
    if (!customerPhone) {
      return { success: false, error: 'Customer phone number not provided' };
    }

    const message = `Thanks ${customerName}! Our team will contact you shortly.`;

    // Wrap in try-catch to prevent crashes
    const result = await sendWhatsAppMessage(customerPhone, message).catch(err => {
      console.error('Customer auto-reply error:', err.message);
      return { success: false, error: err.message };
    });

    return result;
  } catch (error) {
    // Never throw - always return error object
    console.error('sendCustomerAutoReply error:', error.message);
    return { success: false, error: error.message };
  }
  */
};

module.exports = {
  sendWhatsAppMessage,
  sendSMS,
  sendEmergencyAlert,
  sendCustomerAutoReply,
  getTwilioClient,
  formatPhoneNumber,
  isSMSEnabled,
  isWhatsAppEnabled
};
