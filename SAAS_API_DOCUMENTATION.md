# SaaS Lead Automation Platform - API Documentation

## Base URL
```
http://localhost:8088/api
```

## Authentication

All protected routes require JWT authentication via HTTP-only cookies or Bearer token.

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Current User
```http
GET /api/auth/me
Cookie: token=xxx
```

### Logout
```http
POST /api/auth/logout
Cookie: token=xxx
```

---

## Business Management

### Get All Businesses (Protected)
```http
GET /api/businesses
Cookie: token=xxx
```

### Get Single Business (Protected)
```http
GET /api/businesses/:id
Cookie: token=xxx
```

### Create Business (Protected - Max 3 for Starter Plan)
```http
POST /api/businesses
Cookie: token=xxx
Content-Type: application/json

{
  "name": "My Business",
  "email": "business@example.com",
  "phone": "+1234567890",
  "industry": "Restoration",
  "website": "https://example.com",
  "settings": {
    "ownerEmail": "owner@example.com",
    "autoAssignLeads": true
  }
}
```

### Update Business (Protected)
```http
PUT /api/businesses/:id
Cookie: token=xxx
Content-Type: application/json

{
  "name": "Updated Business Name",
  "email": "newemail@example.com"
}
```

### Delete Business (Protected - Soft Delete)
```http
DELETE /api/businesses/:id
Cookie: token=xxx
```

### Get Business Stats (Protected)
```http
GET /api/businesses/:id/stats
Cookie: token=xxx
```

---

## Lead Management

### Create Lead (Public - for forms/chatbot)
```http
POST /api/leads
Content-Type: application/json

{
  "businessId": "507f1f77bcf86cd799439011",
  "serviceId": "507f1f77bcf86cd799439012",
  "name": "Jane Doe",
  "phone": "+1234567890",
  "email": "jane@example.com",
  "pincode": "12345",
  "description": "Need urgent service",
  "source": "form"
}
```

**Response includes:**
- AI analysis (intent, urgency)
- Lead ID
- Status: "new"

**Automatically triggers:**
1. User confirmation email (Brevo)
2. Owner notification email (Brevo)
3. n8n webhook (if configured)

### Get All Leads (Protected)
```http
GET /api/leads?businessId=xxx&status=new&urgency=emergency&source=form
Cookie: token=xxx
```

### Get Single Lead (Protected)
```http
GET /api/leads/:id
Cookie: token=xxx
```

### Update Lead Status (Protected)
```http
PUT /api/leads/:id/status
Cookie: token=xxx
Content-Type: application/json

{
  "status": "contacted",
  "notes": "Called customer, scheduled appointment"
}
```

### Update Lead (Protected)
```http
PUT /api/leads/:id
Cookie: token=xxx
Content-Type: application/json

{
  "status": "qualified",
  "urgency": "high",
  "assignedTo": "507f1f77bcf86cd799439013",
  "notes": "High-value lead"
}
```

### Delete Lead (Protected)
```http
DELETE /api/leads/:id
Cookie: token=xxx
```

---

## Services (Legacy - Still Works)

### Get All Services (Public)
```http
GET /api/services
```

### Get Single Service (Public)
```http
GET /api/services/:id
```

### Create Service (Protected)
```http
POST /api/services
Cookie: token=xxx
Content-Type: multipart/form-data

image: [file]
title: "Service Name"
description: "Service description"
```

---

## Lead Flow

When a lead is created:

1. **Save to Database** - Lead saved with businessId, serviceId, contact info
2. **AI Analysis** - Intent and urgency determined (via Gemini or fallback)
3. **Emails Sent**:
   - User: Confirmation email
   - Owner: Notification with lead details
4. **Webhook Triggered** - n8n webhook called (async, non-blocking)
5. **Response** - Lead data returned to client

---

## Lead Status Values

- `new` - Just created
- `contacted` - Customer has been contacted
- `qualified` - Lead is qualified
- `converted` - Lead converted to customer
- `closed` - Lead closed (won/lost)
- `lost` - Lead lost

## Lead Urgency Values

- `emergency` - Requires immediate attention
- `high` - High priority
- `normal` - Normal priority
- `low` - Low priority

## Lead Intent Values

- `inquiry` - General inquiry
- `emergency` - Emergency request
- `quote` - Requesting quote
- `complaint` - Complaint
- `other` - Other

---

## Environment Variables

```env
MONGO_DB_URL=mongodb+srv://...
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your_brevo_email
SMTP_PASSWORD=your_brevo_key
FROM_EMAIL=verified_sender@example.com
OWNER_EMAIL=owner@example.com
N8N_WEBHOOK_URL=https://your-n8n.com/webhook/lead
GEMINI_API_KEY=your_gemini_key (optional)
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error (development only)"
}
```

---

## Success Responses

All success responses follow this format:

```json
{
  "success": true,
  "message": "Success message (optional)",
  "data": { ... },
  "count": 10 (for list endpoints)
}
```

