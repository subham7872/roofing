# AI-Powered Lead Capture System - Setup Guide

## Overview

This system provides:
- **AI Chatbot** - Conversational lead qualification using OpenAI GPT-4 or Claude
- **WhatsApp + SMS** - Owner alerts via Twilio
- **Lead Dashboard** - Simple interface to view and manage leads
- **Owner Alerts** - Email + WhatsApp/SMS notifications for emergencies

## Environment Variables

Add these to your `server/.env` file:

### AI Configuration (Choose One)

**Option 1: OpenAI GPT-4**
```env
AI_PROVIDER=openai
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4  # or gpt-3.5-turbo
```

**Option 2: Anthropic Claude**
```env
AI_PROVIDER=claude
CLAUDE_API_KEY=your_claude_api_key_here
CLAUDE_MODEL=claude-3-5-sonnet-20241022
```

**Option 3: Google Gemini (Fallback)**
```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here
```

### Twilio Configuration (WhatsApp + SMS)

```env
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890  # Your Twilio phone number for SMS
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886  # Twilio sandbox or your WhatsApp number
```

**Note:** For WhatsApp, you can use Twilio's sandbox number (`whatsapp:+14155238886`) for testing. To send to any number, join the sandbox by sending "join [your-code]" to the sandbox number.

### Existing Variables (Keep These)

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=8088

# Email (Brevo)
SMTP_USER=your_brevo_email
SMTP_PASSWORD=your_brevo_password
FROM_EMAIL=your_verified_sender_email
OWNER_EMAIL=owner@example.com
```

## Installation

1. **Install Twilio package:**
```bash
cd server
npm install twilio
```

2. **Restart your server:**
```bash
npm run dev
```

## How It Works

### 1. Chatbot Flow

1. User opens chat widget on website
2. Chatbot asks qualification questions:
   - Name
   - Phone number
   - Email
   - Service type
   - Location (pincode)
   - Description
3. AI analyzes the conversation and classifies:
   - **Intent**: inquiry, emergency, quote, complaint, other
   - **Urgency**: emergency, high, normal, low
4. User confirms submission
5. Lead is saved to MongoDB with `source: 'chatbot'`
6. Notifications are sent:
   - User: Confirmation email
   - Owner: Notification email
   - Owner: WhatsApp + SMS (if emergency)

### 2. Owner Alerts

When a lead is created with `urgency: 'emergency'`:
- ✅ Email notification (via Brevo)
- ✅ WhatsApp message (via Twilio)
- ✅ SMS message (via Twilio)

### 3. Lead Dashboard

- View all leads with filters:
  - **Status**: new, contacted, qualified, converted, closed
  - **Source**: chatbot, form, api, manual, discount_modal
- See AI analysis and urgency classification
- Update lead status

## API Endpoints

### Chatbot

**POST /api/chatbot/message**
```json
{
  "sessionId": "chat_1234567890_abc123",
  "message": "My name is John"
}
```

**POST /api/chatbot/submit**
```json
{
  "sessionId": "chat_1234567890_abc123",
  "businessId": "optional_business_id",
  "serviceId": "optional_service_id"
}
```

**GET /api/chatbot/session/:sessionId**
Returns conversation history and collected data

## Testing

1. **Test Chatbot:**
   - Open your website
   - Click the chat widget (bottom right)
   - Follow the conversation flow
   - Submit a lead

2. **Test WhatsApp:**
   - Create a lead with `urgency: 'emergency'`
   - Check owner's WhatsApp for message

3. **Test Dashboard:**
   - Login to dashboard
   - Navigate to Leads
   - Filter by source: "chatbot"
   - View lead details

## Troubleshooting

### AI Not Responding
- Check `AI_PROVIDER` is set correctly
- Verify API key is valid
- Check server logs for errors

### Twilio Not Sending
- Verify `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN`
- For WhatsApp: Join Twilio sandbox first
- Check phone number format (E.164: +1234567890)
- Check Twilio console for errors

### Chatbot Not Working
- Check API endpoint: `http://localhost:8088/api/chatbot/message`
- Verify CORS is configured correctly
- Check browser console for errors

## Business Configuration

In your Business model settings, you can configure:
- `ownerEmail` - Email for notifications
- `ownerPhone` - Phone for WhatsApp/SMS (E.164 format)

Example:
```javascript
{
  settings: {
    ownerEmail: "owner@example.com",
    ownerPhone: "+1234567890"  // Include country code
  }
}
```

## Notes

- **No CRM pipelines** - Simple lead storage only
- **No automation builders** - Direct API integration
- **No analytics** - Basic lead viewing only
- **AI is configurable** - Switch between OpenAI, Claude, or Gemini
- **Twilio is optional** - System works without it (emails only)
