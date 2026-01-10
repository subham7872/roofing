// TWILIO INTEGRATION - COMMENTED OUT (Can be enabled when needed)
// const twilio = require('twilio');

/**
 * Initialize Twilio client
 */
const getTwilioClient = () => {
  // Twilio disabled - always return null
  return null;
  
  /* COMMENTED OUT - Enable when Twilio credentials are configured
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
 * Send WhatsApp message
 * @param {String} to - Phone number (E.164 format: +1234567890)
 * @param {String} message - Message content
 * @returns {Promise<Object>} Result object
 */
const sendWhatsAppMessage = async (to, message) => {
  // Twilio disabled - return disabled message
  console.log('⚠️ Twilio WhatsApp disabled - use email notifications');
  return { success: false, error: 'Twilio WhatsApp disabled' };
  
  /* COMMENTED OUT - Enable when Twilio is configured
  try {
    const client = getTwilioClient();
    if (!client) {
      console.log('Twilio not configured, skipping WhatsApp message');
      return { success: false, error: 'Twilio not configured' };
    }

    const from = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886'; // Twilio sandbox number

    // Format phone number
    let formattedTo = to;
    if (!formattedTo.startsWith('+')) {
      formattedTo = '+' + formattedTo.replace(/\D/g, '');
    }
    if (!formattedTo.startsWith('whatsapp:')) {
      formattedTo = 'whatsapp:' + formattedTo;
    }

    const result = await client.messages.create({
      from: from,
      to: formattedTo,
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
  console.log('⚠️ Twilio SMS disabled - use email notifications');
  return { success: false, error: 'Twilio SMS disabled' };
  
  /* COMMENTED OUT - Enable when Twilio is configured
  try {
    const client = getTwilioClient();
    if (!client) {
      console.log('Twilio not configured, skipping SMS');
      return { success: false, error: 'Twilio not configured' };
    }

    const from = process.env.TWILIO_PHONE_NUMBER || process.env.TWILIO_FROM;

    if (!from) {
      console.warn('TWILIO_PHONE_NUMBER not set, cannot send SMS');
      return { success: false, error: 'Twilio phone number not configured' };
    }

    // Format phone number
    let formattedTo = to;
    if (!formattedTo.startsWith('+')) {
      formattedTo = '+' + formattedTo.replace(/\D/g, '');
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

module.exports = {
  sendWhatsAppMessage,
  sendSMS,
  getTwilioClient
};
