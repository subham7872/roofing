const { sendSMS, sendWhatsAppMessage, isSMSEnabled, isWhatsAppEnabled } = require('./twilio');
const { sendOwnerNotificationEmail } = require('../config/email');

/**
 * Central notification controller for owner alerts
 * 
 * Rules:
 * - Never throws errors
 * - Always falls back to email if SMS/WhatsApp fail
 * - Respects client preferences and environment toggles
 * 
 * @param {Object} options
 * @param {Object} options.business - Business document with settings
 * @param {Object} options.leadData - Lead data (issue, location, phone, createdAt, afterHours)
 * @param {Boolean} options.isEmergency - Whether this is an emergency lead
 * @param {Boolean} options.isDemoMode - If true, log mock messages instead of sending
 * @returns {Promise<Object>} Result object with notification status
 */
const notifyOwner = async ({ business, leadData, isEmergency = false, isDemoMode = false }) => {
  const results = {
    sms: { attempted: false, success: false },
    whatsapp: { attempted: false, success: false },
    email: { attempted: false, success: false },
    fallbackUsed: false
  };

  // Get notification preferences
  const notifications = business.settings?.notifications || {
    sms: false,
    whatsapp: false,
    email: true  // Default to email
  };

  // Get owner contact info
  const ownerPhone = business.settings?.ownerPhone || business.phone;
  const ownerEmail = business.settings?.ownerEmail || business.email;

  // Format message
  const { issue, location, phone, createdAt, afterHours } = leadData;
  const timeStr = createdAt 
    ? new Date(createdAt).toLocaleString('en-US', { 
        timeZone: 'America/New_York',
        dateStyle: 'short',
        timeStyle: 'short'
      })
    : new Date().toLocaleString();
  
  const prefix = afterHours ? '⚠️ AFTER HOURS\n\n' : '';
  const message = `${prefix}🔥 EMERGENCY LEAD
Issue: ${issue}
Location: ${location}
Phone: ${phone}
Time: ${timeStr}`;

  // DEMO MODE: Log mock messages
  if (isDemoMode) {
    console.log('🔥 [MOCK] Emergency notification would be sent:');
    console.log(`   SMS: ${notifications.sms && isSMSEnabled() ? 'ENABLED' : 'DISABLED'}`);
    console.log(`   WhatsApp: ${notifications.whatsapp && isWhatsAppEnabled() ? 'ENABLED' : 'DISABLED'}`);
    console.log(`   Email: ${notifications.email ? 'ENABLED' : 'DISABLED'}`);
    console.log(`   To: ${ownerPhone || ownerEmail}`);
    return {
      success: true,
      demo: true,
      ...results
    };
  }

  // EMERGENCY LEADS: Try SMS and WhatsApp first
  if (isEmergency) {
    // Try SMS
    if (notifications.sms && isSMSEnabled() && ownerPhone) {
      results.sms.attempted = true;
      try {
        const smsResult = await sendSMS(ownerPhone, message);
        results.sms.success = smsResult.success;
        if (smsResult.success) {
          console.log('📲 SMS sent via Twilio to owner');
        } else {
          console.log(`⚠️ SMS failed: ${smsResult.error}`);
        }
      } catch (error) {
        console.error('SMS error:', error.message);
        results.sms.success = false;
      }
    }

    // Try WhatsApp
    if (notifications.whatsapp && isWhatsAppEnabled() && ownerPhone) {
      results.whatsapp.attempted = true;
      try {
        const whatsappResult = await sendWhatsAppMessage(ownerPhone, message);
        results.whatsapp.success = whatsappResult.success;
        if (whatsappResult.success) {
          console.log('💬 WhatsApp sent via Twilio to owner');
        } else {
          console.log(`⚠️ WhatsApp failed: ${whatsappResult.error}`);
        }
      } catch (error) {
        console.error('WhatsApp error:', error.message);
        results.whatsapp.success = false;
      }
    }

    // Fallback to email if SMS/WhatsApp didn't work OR if email is preferred
    const needsEmailFallback = !results.sms.success && !results.whatsapp.success;
    if (notifications.email && (needsEmailFallback || !notifications.sms && !notifications.whatsapp)) {
      results.email.attempted = true;
      results.fallbackUsed = needsEmailFallback;
      try {
        const emailResult = await sendOwnerNotificationEmail({
          ...leadData,
          urgency: 'emergency',
          businessName: business.name,
          ownerEmail: ownerEmail
        });
        results.email.success = emailResult.success;
        if (emailResult.success) {
          console.log('📧 Email sent to owner' + (results.fallbackUsed ? ' (fallback)' : ''));
        } else {
          console.log(`⚠️ Email failed: ${emailResult.error}`);
        }
      } catch (error) {
        console.error('Email error:', error.message);
        results.email.success = false;
      }
    }
  } else {
    // NORMAL LEADS: Email only (or preferred channel)
    if (notifications.email) {
      results.email.attempted = true;
      try {
        const emailResult = await sendOwnerNotificationEmail({
          ...leadData,
          urgency: 'normal',
          businessName: business.name,
          ownerEmail: ownerEmail
        });
        results.email.success = emailResult.success;
        if (emailResult.success) {
          console.log('📧 Email sent to owner for normal lead');
        }
      } catch (error) {
        console.error('Email error:', error.message);
        results.email.success = false;
      }
    }
  }

  // Final success status
  const overallSuccess = results.sms.success || results.whatsapp.success || results.email.success;

  return {
    success: overallSuccess,
    ...results
  };
};

module.exports = { notifyOwner };
