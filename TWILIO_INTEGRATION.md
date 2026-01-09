# Twilio Integration Guide

## Overview

Twilio is integrated for WhatsApp and SMS alerts based on lead urgency.

## Behavior

### Emergency Leads (`urgency === "emergency"`)
- ✅ Send WhatsApp message to owner
- ✅ Send SMS message to owner

**Message Format:**
```
🔥 EMERGENCY LEAD
Issue: {{issue}}
Location: {{location}}
Phone: {{phone}}
Time: {{createdAt}}
```

### Normal Leads (`urgency === "normal"`)
- ✅ Send WhatsApp auto-reply to customer

**Message Format:**
```
Thanks {{name}}! Our team will contact you shortly.
```

## Environment Variables

Add these to your `server/.env` file:

```env
# Twilio Credentials
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here

# Twilio Phone Numbers
TWILIO_PHONE_NUMBER=+1234567890  # Your Twilio phone number for SMS
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886  # Twilio WhatsApp number (sandbox or your number)
```

## Setup Instructions

1. **Get Twilio Credentials:**
   - Sign up at https://www.twilio.com
   - Get your Account SID and Auth Token from the dashboard
   - Get a phone number for SMS
   - For WhatsApp, use the sandbox number or get a WhatsApp-enabled number

2. **Add to .env:**
   ```env
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_PHONE_NUMBER=+1234567890
   TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
   ```

3. **WhatsApp Sandbox (Testing):**
   - Use `whatsapp:+14155238886` as `TWILIO_WHATSAPP_FROM`
   - Join the sandbox by sending "join [your-code]" to the sandbox number
   - Only numbers in the sandbox can receive messages

4. **Production WhatsApp:**
   - Request a WhatsApp-enabled number from Twilio
   - Update `TWILIO_WHATSAPP_FROM` with your WhatsApp number

## Files

- **`server/utils/twilio.js`** - Twilio utility functions
  - `sendEmergencyAlert()` - Sends WhatsApp + SMS to owner for emergencies
  - `sendCustomerAutoReply()` - Sends WhatsApp auto-reply to customer for normal leads
  - `sendWhatsAppMessage()` - Generic WhatsApp sender
  - `sendSMS()` - Generic SMS sender

## Usage

The integration is automatic when leads are created:

1. **Emergency Lead Created:**
   - Owner receives WhatsApp + SMS with emergency details
   - Customer does NOT receive auto-reply

2. **Normal Lead Created:**
   - Customer receives WhatsApp auto-reply
   - Owner does NOT receive WhatsApp/SMS (only email)

## Phone Number Format

Phone numbers are automatically formatted to E.164 format:
- Input: `555-1234` → Output: `+15551234`
- Input: `(555) 123-4567` → Output: `+15551234567`
- Input: `+1 555 123 4567` → Output: `+15551234567`

## Business Configuration

Set owner phone number in Business settings:

```javascript
{
  settings: {
    ownerPhone: "+1234567890"  // E.164 format
  }
}
```

Or use the business phone number as fallback.

## Error Handling

- If Twilio is not configured, messages are skipped (no errors)
- Errors are logged but don't block lead creation
- Both WhatsApp and SMS are attempted for emergencies (if one fails, the other still sends)

## Testing

1. Create an emergency lead:
   ```bash
   POST /api/chatbot/lead
   {
     "issue": "Water leak",
     "location": "12345",
     "urgency": "emergency",
     "name": "John Doe",
     "phone": "+1234567890"
   }
   ```
   - Owner should receive WhatsApp + SMS

2. Create a normal lead:
   ```bash
   POST /api/chatbot/lead
   {
     "issue": "General inquiry",
     "location": "12345",
     "urgency": "normal",
     "name": "Jane Doe",
     "phone": "+1234567890"
   }
   ```
   - Customer should receive WhatsApp auto-reply
