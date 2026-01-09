# Quick Start Guide - SaaS Lead Automation Platform

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies
```bash
cd server
npm install
```

### Step 2: Configure Environment
Add to `server/.env`:
```env
JWT_SECRET=change_this_to_random_string_in_production
N8N_WEBHOOK_URL=https://your-n8n.com/webhook (optional)
```

### Step 3: Start Server
```bash
cd server
npm start
```

Server runs on `http://localhost:8088`

---

## 🧪 Test the System

### 1. Register a User
```bash
curl -X POST http://localhost:8088/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:8088/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }' \
  -c cookies.txt
```

### 3. Create a Business
```bash
curl -X POST http://localhost:8088/api/businesses \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "My Restoration Business",
    "email": "business@example.com",
    "phone": "+1234567890",
    "settings": {
      "ownerEmail": "owner@example.com"
    }
  }'
```

**Save the business ID from response!**

### 4. Get a Service ID
```bash
curl http://localhost:8088/api/services
```

**Save a service ID from response!**

### 5. Create a Lead (Public - No Auth)
```bash
curl -X POST http://localhost:8088/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "businessId": "YOUR_BUSINESS_ID_HERE",
    "serviceId": "YOUR_SERVICE_ID_HERE",
    "name": "Jane Customer",
    "phone": "+1987654321",
    "email": "jane@example.com",
    "pincode": "90210",
    "description": "Urgent water damage in kitchen",
    "source": "form"
  }'
```

**What happens:**
- ✅ Lead saved to database
- ✅ AI analyzes intent & urgency
- ✅ User gets confirmation email
- ✅ Owner gets notification email
- ✅ n8n webhook triggered (if configured)

### 6. View Leads (Protected)
```bash
curl http://localhost:8088/api/leads?businessId=YOUR_BUSINESS_ID \
  -b cookies.txt
```

---

## 🎨 Frontend Setup

### 1. Install Dependencies
```bash
cd client
npm install
```

### 2. Configure API URL
Create `client/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8088
```

### 3. Start Frontend
```bash
cd client
npm run dev
```

Frontend runs on `http://localhost:3000`

### 4. Access Dashboard
- Go to `http://localhost:3000/login`
- Register/Login
- Create business
- View leads

---

## 📋 Common Tasks

### Update Lead Status
```bash
curl -X PUT http://localhost:8088/api/leads/LEAD_ID/status \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "status": "contacted",
    "notes": "Called customer, scheduled for tomorrow"
  }'
```

### Get Business Stats
```bash
curl http://localhost:8088/api/businesses/BUSINESS_ID/stats \
  -b cookies.txt
```

---

## 🔧 Troubleshooting

### "JWT_SECRET not defined"
→ Add `JWT_SECRET=your_secret` to `server/.env`

### "Business limit reached"
→ Starter plan allows max 3 businesses per user

### "Email not sending"
→ Check Brevo credentials in `.env`
→ Verify sender email in Brevo dashboard

### "Webhook not working"
→ Check `N8N_WEBHOOK_URL` in `.env`
→ Webhook failures don't block lead creation

---

## 📚 Next Steps

1. **Read Full Docs**: `SAAS_API_DOCUMENTATION.md`
2. **Review Summary**: `SAAS_UPGRADE_SUMMARY.md`
3. **Customize**: Update email templates, add features
4. **Deploy**: Follow production checklist

---

**You're ready to go! 🎉**

