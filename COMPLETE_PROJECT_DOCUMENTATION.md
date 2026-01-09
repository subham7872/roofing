# 🏗️ COMPLETE PROJECT DOCUMENTATION
## RestorePro Services - AI Lead Automation Platform

---

## 📋 TABLE OF CONTENTS

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Architecture Overview](#architecture-overview)
5. [Environment Setup](#environment-setup)
6. [Complete Flow Diagrams](#complete-flow-diagrams)
7. [API Endpoints Reference](#api-endpoints-reference)
8. [Database Models](#database-models)
9. [Step-by-Step Implementation Guide](#step-by-step-implementation-guide)
10. [How to Run the Project](#how-to-run-the-project)
11. [Deployment Guide](#deployment-guide)

---

## 🎯 PROJECT OVERVIEW

**RestorePro Services** is a full-stack AI-powered lead capture and automation platform designed for emergency service businesses (Plumbing, HVAC, Water Damage, Emergency Restoration).

### Key Features:
- ✅ User Authentication (JWT with HTTP-only cookies)
- ✅ Multi-business Management (Up to 3 businesses per user)
- ✅ AI Chatbot for Lead Qualification
- ✅ Lead Management Dashboard
- ✅ Multi-channel Notifications (Email, SMS, WhatsApp)
- ✅ Service Pages (Plumbing, HVAC, Water Damage, Emergency)
- ✅ Contact Forms & Discount Modal

---

## 🛠️ TECHNOLOGY STACK

### Frontend (Client)
- **Framework**: Next.js 15 (App Router)
- **Language**: JavaScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks + Context API
- **HTTP Client**: Axios
- **Animations**: Framer Motion
- **Fonts**: Inter (Google Fonts)

### Backend (Server)
- **Framework**: Node.js + Express.js
- **Language**: JavaScript
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer
- **Email**: Nodemailer (Brevo/Sendinblue SMTP)
- **SMS/WhatsApp**: Twilio (Optional)
- **AI Integration**: Google Gemini API (Placeholder)

### External Services
- **Database**: MongoDB Atlas (or local MongoDB)
- **Email Service**: Brevo (formerly Sendinblue)
- **SMS/WhatsApp**: Twilio (Optional, can run without)
- **Hosting**: Vercel (Frontend) + Railway/Render (Backend)

---

## 📁 PROJECT STRUCTURE

```
roofing/
│
├── client/                          # Next.js Frontend Application
│   ├── app/                         # Next.js App Router
│   │   ├── layout.js               # Root layout with metadata
│   │   ├── page.js                 # Home page (server component)
│   │   ├── HomeClient.js           # Home page (client component)
│   │   ├── LayoutWrapper.js        # Client wrapper for Navbar/Footer
│   │   ├── EmergencyContext.js     # Emergency funnel context
│   │   │
│   │   ├── login/                  # Login page
│   │   │   ├── page.js
│   │   │   └── layout.js
│   │   │
│   │   ├── register/               # Registration page
│   │   │   ├── page.js
│   │   │   └── layout.js
│   │   │
│   │   ├── dashboard/              # Dashboard pages
│   │   │   ├── page.js             # Main dashboard (leads table)
│   │   │   ├── leads/page.js       # Leads page with filters
│   │   │   ├── settings/page.js    # Settings page
│   │   │   └── layout.js
│   │   │
│   │   ├── plumbing/               # Service pages
│   │   ├── hvac/
│   │   ├── water-damage/
│   │   ├── emergency/
│   │   ├── about/
│   │   └── contact/
│   │
│   ├── components/                  # React Components
│   │   ├── Navbar.js               # Navigation header
│   │   ├── Footer.jsx              # Footer component
│   │   ├── Hero.jsx                # Hero section
│   │   ├── Services.jsx            # Services showcase
│   │   ├── HowItWorks.jsx          # Process flow section
│   │   ├── BeforeAfter.jsx         # Before/After images
│   │   ├── TrustSection.jsx        # Trust indicators
│   │   ├── InsuranceSection.jsx    # Insurance info
│   │   ├── DiscountModal.js        # Auto-popup discount modal
│   │   ├── ChatbotWidget.js        # AI chatbot widget
│   │   └── EmergencyBanner.js      # Emergency banner
│   │
│   ├── hooks/                       # Custom React Hooks
│   │   └── useEmergencySafe.js     # Safe emergency context hook
│   │
│   ├── lib/                         # Utility Libraries
│   │   ├── api.js                  # API client (axios wrapper)
│   │   └── auth.js                 # Authentication helpers
│   │
│   ├── public/                      # Static Assets
│   │   └── assets/
│   │       ├── logo.png
│   │       ├── hero.jpg
│   │       └── bef.jpg
│   │
│   └── package.json                 # Frontend dependencies
│
│
└── server/                          # Express.js Backend API
    ├── app.js                       # Main Express app
    │
    ├── config/                      # Configuration Files
    │   └── email.js                 # Email service (Brevo)
    │
    ├── controller/                  # Route Controllers (Business Logic)
    │   ├── auth.controller.js       # Authentication (register, login, logout)
    │   ├── business.controller.js   # Business CRUD operations
    │   ├── lead.controller.js       # Lead CRUD operations
    │   ├── chatbot.controller.js    # Chatbot conversation & lead submission
    │   ├── contact.controller.js    # Contact form submissions
    │   ├── serviceController.js     # Service management
    │   └── emergencyController.js   # Legacy emergency requests
    │
    ├── middleware/                  # Express Middleware
    │   ├── auth.middleware.js       # JWT authentication middleware
    │   └── upload.js                # Multer file upload config
    │
    ├── model/                       # Mongoose Schemas (Main Models)
    │   ├── User.model.js            # User schema
    │   ├── Business.model.js        # Business/Company schema
    │   ├── Lead.model.js            # Lead schema (full model)
    │   ├── Contact.model.js         # Contact message schema
    │   ├── Service.js               # Service schema
    │   └── EmergencyRequest.js      # Legacy emergency schema
    │
    ├── models/                      # Additional Models
    │   └── Lead.js                  # Discount modal lead (simplified)
    │
    ├── routes/                      # Express Routes
    │   ├── appRouter.js             # Main router (aggregates all routes)
    │   ├── auth.routes.js           # Authentication routes
    │   ├── business.routes.js       # Business routes
    │   ├── lead.routes.js           # Lead routes
    │   ├── chatbot.routes.js        # Chatbot routes
    │   ├── contact.routes.js        # Contact routes
    │   └── services.routes.js       # Service routes
    │
    ├── services/                    # External Service Integrations
    │   ├── ai.service.js            # AI analysis (Gemini/OpenAI/Claude)
    │   ├── geminiService.js         # Google Gemini integration
    │   ├── twilio.service.js        # Twilio service (legacy)
    │   └── webhook.service.js       # n8n webhook integration
    │
    ├── utils/                       # Utility Functions
    │   ├── twilio.js                # Twilio messaging (WhatsApp/SMS)
    │   └── notifyOwner.js           # Central notification controller
    │
    ├── uploads/                     # Uploaded Files Directory
    │
    ├── .env                         # Environment Variables (DO NOT COMMIT)
    └── package.json                 # Backend dependencies
```

---

## 🏛️ ARCHITECTURE OVERVIEW

### Client-Server Communication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT (Next.js)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Pages      │  │  Components  │  │    Hooks     │     │
│  │  (Routes)    │→ │  (UI/Forms)  │→ │  (API Calls) │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                            │                                │
│                            ↓                                │
│                    ┌──────────────┐                        │
│                    │  lib/api.js  │                        │
│                    │ (Axios Client)│                       │
│                    └──────────────┘                        │
│                            │                                │
└────────────────────────────┼────────────────────────────────┘
                             │
                             │ HTTP Requests (JSON)
                             │ JWT Token (HTTP-only Cookie)
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                    SERVER (Express.js)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Routes     │→ │  Middleware  │→ │  Controllers │     │
│  │  (Endpoints) │  │  (Auth/CORS) │  │  (Business   │     │
│  └──────────────┘  └──────────────┘  │   Logic)     │     │
│                            │          └──────────────┘     │
│                            ↓                │               │
│                    ┌──────────────┐        │               │
│                    │   Services   │        │               │
│                    │ (AI/Email/   │        │               │
│                    │  Twilio)     │        │               │
│                    └──────────────┘        │               │
│                            │                │               │
│                            ↓                ↓               │
│                    ┌──────────────────────────────┐        │
│                    │    MongoDB (Mongoose)        │        │
│                    │  - Users                     │        │
│                    │  - Businesses                │        │
│                    │  - Leads                     │        │
│                    │  - Contacts                  │        │
│                    └──────────────────────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 ENVIRONMENT SETUP

### Frontend Environment Variables (`client/.env.local`)

```env
# API Base URL (Backend Server)
NEXT_PUBLIC_API_URL=http://localhost:8088
```

### Backend Environment Variables (`server/.env`)

```env
# Server Configuration
PORT=8088
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/restorepro
# OR
MONGO_DB_URL=mongodb+srv://username:password@cluster.mongodb.net/restorepro

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
JWT_EXPIRE=30d

# Email Service (Brevo/Sendinblue)
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your_brevo_email@example.com
SMTP_PASSWORD=your_brevo_password
FROM_EMAIL=subham.kbsinstitute@gmail.com
REPLY_TO_EMAIL=subham.kbsinstitute@gmail.com

# Twilio (Optional - System works without it)
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

# Twilio Feature Toggles (Optional)
ENABLE_SMS=false
ENABLE_WHATSAPP=false
DEMO_MODE=true

# AI Service (Optional)
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_claude_key

# Webhook Integration (Optional - n8n)
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/lead
```

---

## 🔄 COMPLETE FLOW DIAGRAMS

### 1. USER REGISTRATION & LOGIN FLOW

```
┌──────────┐
│   User   │
└────┬─────┘
     │
     │ 1. Visit /register
     ↓
┌──────────────────────┐
│  Register Page       │
│  - Name              │
│  - Email             │
│  - Password          │
└────┬─────────────────┘
     │
     │ 2. Submit Form (POST /api/auth/register)
     ↓
┌────────────────────────────────────────┐
│  Backend: auth.controller.js           │
│  - Validate input                      │
│  - Check if user exists                │
│  - Hash password (bcrypt)              │
│  - Create user in MongoDB              │
│  - Generate JWT token                  │
│  - Set HTTP-only cookie                │
└────┬───────────────────────────────────┘
     │
     │ 3. Return success + user data
     ↓
┌──────────────────────┐
│  Redirect to         │
│  /dashboard          │
└──────────────────────┘

LOGIN FLOW (Similar):
1. Visit /login
2. Enter email + password
3. POST /api/auth/login
4. Backend validates credentials
5. Generate JWT token
6. Set HTTP-only cookie
7. Redirect to /dashboard
```

### 2. LEAD CAPTURE FLOW (Chatbot)

```
┌──────────┐
│ Visitor  │
└────┬─────┘
     │
     │ 1. Clicks chatbot widget (red button)
     ↓
┌──────────────────────┐
│  ChatbotWidget.js    │
│  Opens chat panel    │
└────┬─────────────────┘
     │
     │ 2. Hardcoded conversation flow:
     │    Step 1: "What problem are you facing?"
     │    Step 2: "City or ZIP code?"
     │    Step 3: "Emergency/Today/Flexible?"
     │    Step 4: "Your name?"
     │    Step 5: "Phone number?"
     ↓
┌────────────────────────────────────────┐
│  POST /api/chatbot/structured/submit   │
│  Body: {                                │
│    sessionId,                           │
│    issue,                               │
│    location,                            │
│    urgency,                             │
│    name,                                │
│    phone                                │
│  }                                      │
└────┬───────────────────────────────────┘
     │
     ↓
┌────────────────────────────────────────┐
│  Backend: chatbot.controller.js        │
│  1. Validate session                   │
│  2. Detect emergency (keywords)        │
│  3. Find active business               │
│  4. Create lead in MongoDB             │
│  5. If emergency:                      │
│     - Send WhatsApp + SMS to owner     │
│     - OR email fallback                │
│  6. If normal:                         │
│     - Send email to owner              │
│     - Auto-reply to customer           │
└────┬───────────────────────────────────┘
     │
     │ 7. Return success
     ↓
┌──────────────────────┐
│  Show success        │
│  message to user     │
└──────────────────────┘
     │
     │ 8. Lead saved in MongoDB
     ↓
┌──────────────────────┐
│  Dashboard displays  │
│  new lead instantly  │
└──────────────────────┘
```

### 3. LEAD CAPTURE FLOW (Discount Modal)

```
┌──────────┐
│ Visitor  │
└────┬─────┘
     │
     │ 1. Lands on website
     │ 2. After 4 seconds → DiscountModal auto-opens
     │ 3. User enters Name + Email
     │ 4. Clicks "Unlock My Discount"
     ↓
┌────────────────────────────────────────┐
│  POST /api/leads                       │
│  Body: {                                │
│    name: "John Doe",                   │
│    email: "john@example.com",          │
│    source: "discount_modal"            │
│  }                                      │
└────┬───────────────────────────────────┘
     │
     ↓
┌────────────────────────────────────────┐
│  Backend: lead.controller.js           │
│  - Check if source === 'discount_modal'│
│  - Use DiscountLead model              │
│  - Save to MongoDB (discount_leads)    │
│  - Store in localStorage               │
│    (modalSubmitted = true)             │
└────┬───────────────────────────────────┘
     │
     │ 5. Return success
     ↓
┌──────────────────────┐
│  Show success        │
│  Modal closes        │
│  Won't show again    │
└──────────────────────┘
```

### 4. DASHBOARD FLOW

```
┌──────────┐
│   User   │
└────┬─────┘
     │
     │ 1. Visit /dashboard (authenticated)
     ↓
┌──────────────────────┐
│  Dashboard Page      │
│  - Fetches leads     │
│  - Displays table    │
└────┬─────────────────┘
     │
     │ 2. GET /api/leads
     ↓
┌────────────────────────────────────────┐
│  Backend: lead.controller.js           │
│  - If authenticated: Filter by user's  │
│    businesses                          │
│  - If public (demo): Get all leads     │
│  - Return leads array                  │
└────┬───────────────────────────────────┘
     │
     │ 3. Display leads in table:
     │    - Name
     │    - Phone
     │    - Issue
     │    - Urgency (red if emergency)
     │    - Time
     │    - Status (dropdown)
     ↓
┌──────────────────────┐
│  User updates status │
│  (New/Called/Booked/ │
│   Lost)              │
└────┬─────────────────┘
     │
     │ 4. PATCH /api/leads/:id/status
     ↓
┌────────────────────────────────────────┐
│  Backend: lead.controller.js           │
│  - Update lead status in MongoDB       │
│  - Return updated lead                 │
└────┬───────────────────────────────────┘
     │
     │ 5. Update UI
     ↓
┌──────────────────────┐
│  Status updated      │
│  Persisted in DB     │
└──────────────────────┘
```

### 5. NOTIFICATION FLOW (Emergency Lead)

```
┌────────────────────────────────────────┐
│  Emergency Lead Created                │
│  (via chatbot or form)                 │
└────┬───────────────────────────────────┘
     │
     ↓
┌────────────────────────────────────────┐
│  notifyOwner() Function                │
│  (utils/notifyOwner.js)                │
│                                         │
│  1. Check business.notifications       │
│     - sms: true/false                  │
│     - whatsapp: true/false             │
│     - email: true (always)             │
│                                         │
│  2. Check environment toggles:         │
│     - ENABLE_SMS                       │
│     - ENABLE_WHATSAPP                  │
│     - DEMO_MODE                        │
└────┬───────────────────────────────────┘
     │
     ↓
┌────────────────────────────────────────┐
│  If DEMO_MODE or Twilio not configured:│
│  → Log mock message to console         │
│  → Send email with "[WhatsApp          │
│     Simulation]" subject               │
└────┬───────────────────────────────────┘
     │
     ↓
┌────────────────────────────────────────┐
│  If Twilio configured + enabled:       │
│                                         │
│  Try SMS (if enabled):                 │
│  ┌──────────────────────────────┐     │
│  │ sendSMS() → Twilio API       │     │
│  └──────────────────────────────┘     │
│                                         │
│  Try WhatsApp (if enabled):            │
│  ┌──────────────────────────────┐     │
│  │ sendWhatsAppMessage() →      │     │
│  │ Twilio WhatsApp API          │     │
│  └──────────────────────────────┘     │
│                                         │
│  If both fail → Email fallback:        │
│  ┌──────────────────────────────┐     │
│  │ sendOwnerNotificationEmail() │     │
│  │ → Brevo SMTP                 │     │
│  └──────────────────────────────┘     │
└────────────────────────────────────────┘
```

---

## 📡 API ENDPOINTS REFERENCE

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login user (returns JWT cookie) |
| POST | `/api/auth/logout` | Private | Logout user (clears cookie) |
| GET | `/api/auth/me` | Private | Get current user profile |

### Business Routes (`/api/businesses`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/businesses` | Private | Get user's businesses (max 3) |
| GET | `/api/businesses/:id` | Private | Get single business |
| POST | `/api/businesses` | Private | Create new business |
| PUT | `/api/businesses/:id` | Private | Update business |
| DELETE | `/api/businesses/:id` | Private | Delete business |

### Lead Routes (`/api/leads`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/leads` | Public* | Get all leads (demo) or filtered (auth) |
| GET | `/api/leads/:id` | Private | Get single lead |
| POST | `/api/leads` | Public* | Create lead (routes to discount or full) |
| PATCH | `/api/leads/:id/status` | Public* | Update lead status |
| PUT | `/api/leads/:id` | Private | Update lead |
| DELETE | `/api/leads/:id` | Private | Delete lead |

*Public for demo, protected when authenticated

### Chatbot Routes (`/api/chatbot`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/chatbot/structured` | Public | Handle chatbot message (conversation) |
| POST | `/api/chatbot/structured/submit` | Public | Submit structured lead from chatbot |
| POST | `/api/chatbot/lead` | Public | Simplified chatbot lead submission |

### Contact Routes (`/api/contact`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/contact` | Public | Submit contact form |
| GET | `/api/contact` | Private | Get all contact messages |
| GET | `/api/contact/:id` | Private | Get single contact message |
| PUT | `/api/contact/:id/status` | Private | Update contact status |

### Service Routes (`/api/services`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/services` | Public | Get all services |
| GET | `/api/services/:id` | Public | Get single service |
| POST | `/api/services` | Private | Create service (with image upload) |
| PUT | `/api/services/:id` | Private | Update service |
| DELETE | `/api/services/:id` | Private | Delete service |

---

## 🗄️ DATABASE MODELS

### User Model

```javascript
{
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  plan: String (default: 'starter'),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Business Model

```javascript
{
  userId: ObjectId (required, ref: 'User'),
  name: String (required),
  email: String (required),
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  industry: String,
  website: String,
  isActive: Boolean (default: true),
  settings: {
    ownerEmail: String,
    ownerPhone: String,
    autoAssignLeads: Boolean (default: true),
    notifications: {
      sms: Boolean (default: false),
      whatsapp: Boolean (default: false),
      email: Boolean (default: true)
    }
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Lead Model (Full)

```javascript
{
  businessId: ObjectId (required, ref: 'Business'),
  serviceId: ObjectId (ref: 'Service', optional for chatbot),
  serviceName: String,
  name: String (required),
  phone: String (required*),
  email: String (required),
  pincode: String (required*),
  description: String,
  intent: String (default: 'inquiry'),
  urgency: String (enum: ['emergency', 'high', 'normal', 'low']),
  status: String (enum: ['new', 'called', 'booked', 'lost'], default: 'new'),
  source: String (enum: ['chatbot', 'form', 'api', 'manual', 'discount_modal']),
  aiAnalysis: String,
  afterHours: Boolean (default: false),
  webhookTriggered: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}

*Optional when source === 'discount_modal'
```

### Discount Lead Model (Simplified)

```javascript
{
  name: String (required),
  email: String (required),
  source: String (default: 'discount_modal'),
  createdAt: Date
}
```

### Contact Model

```javascript
{
  name: String (required),
  email: String (required),
  subject: String (required),
  message: String (required),
  status: String (enum: ['new', 'read', 'replied'], default: 'new'),
  createdAt: Date
}
```

---

## 📝 STEP-BY-STEP IMPLEMENTATION GUIDE

### Step 1: Initial Setup

1. **Clone/Download Project**
   ```bash
   cd roofing
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../server
   npm install
   ```

### Step 2: Environment Configuration

1. **Create Frontend `.env.local`**
   ```bash
   cd client
   cp .env.example .env.local
   # Edit .env.local and add:
   NEXT_PUBLIC_API_URL=http://localhost:8088
   ```

2. **Create Backend `.env`**
   ```bash
   cd ../server
   # Create .env file and add all required variables (see Environment Setup section)
   ```

3. **Generate JWT Secret**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   # Copy output to JWT_SECRET in .env
   ```

### Step 3: Database Setup

1. **Create MongoDB Database**
   - Use MongoDB Atlas (cloud) OR local MongoDB
   - Create database: `restorepro`
   - Get connection string

2. **Add MongoDB URI to `.env`**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/restorepro
   ```

### Step 4: Email Service Setup (Brevo)

1. **Sign up at Brevo.com**
2. **Get SMTP credentials**
3. **Verify sender email**
4. **Add to `.env`**:
   ```env
   SMTP_USER=your_brevo_email
   SMTP_PASSWORD=your_brevo_password
   FROM_EMAIL=verified_sender@example.com
   ```

### Step 5: Twilio Setup (Optional)

1. **Sign up at Twilio.com**
2. **Get Account SID and Auth Token**
3. **Get Phone Number**
4. **Add to `.env`**:
   ```env
   TWILIO_ACCOUNT_SID=ACxxxxx
   TWILIO_AUTH_TOKEN=your_token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

5. **For Demo Mode** (recommended):
   ```env
   ENABLE_SMS=false
   ENABLE_WHATSAPP=false
   DEMO_MODE=true
   ```

### Step 6: Run Development Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
# Server runs on http://localhost:8088
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
# Frontend runs on http://localhost:3000
```

### Step 7: Test the Application

1. **Visit Frontend**: `http://localhost:3000`
2. **Register Account**: `/register`
3. **Create Business**: Dashboard → Create Business
4. **Test Chatbot**: Click red chatbot button
5. **Submit Lead**: Complete chatbot flow
6. **View Dashboard**: `/dashboard` (should show new lead)

---

## 🚀 HOW TO RUN THE PROJECT

### Development Mode

**Backend:**
```bash
cd server
npm run dev
```

**Frontend:**
```bash
cd client
npm run dev
```

### Production Build

**Backend:**
```bash
cd server
NODE_ENV=production npm start
```

**Frontend:**
```bash
cd client
npm run build
npm start
```

---

## 🌐 DEPLOYMENT GUIDE

### Frontend Deployment (Vercel)

1. **Push to GitHub**
2. **Import to Vercel**
3. **Set Environment Variables**:
   - `NEXT_PUBLIC_API_URL=https://your-backend-url.com`
4. **Deploy**

### Backend Deployment (Railway/Render)

1. **Push to GitHub**
2. **Create new service** on Railway/Render
3. **Connect repository**
4. **Set Environment Variables** (all from `server/.env`)
5. **Deploy**
6. **Update Frontend** `NEXT_PUBLIC_API_URL` to backend URL

---

## 🔍 TROUBLESHOOTING

### Common Issues

1. **JWT_SECRET Error**
   - Ensure `.env` has `JWT_SECRET` (minimum 32 characters)
   - Restart server after adding

2. **MongoDB Connection Error**
   - Check `MONGODB_URI` in `.env`
   - Ensure network access is enabled (Atlas)

3. **CORS Errors**
   - Check `CORS_ORIGIN` in backend `.env`
   - Should match frontend URL

4. **Email Not Sending**
   - Verify Brevo credentials
   - Check sender email is verified in Brevo dashboard

5. **Twilio Not Working**
   - Set `DEMO_MODE=true` for demos (no charges)
   - Check `ENABLE_SMS` and `ENABLE_WHATSAPP` flags

---

## 📚 KEY CONCEPTS EXPLAINED

### Authentication Flow
- Uses JWT tokens stored in HTTP-only cookies
- Prevents XSS attacks (can't access cookie via JavaScript)
- Tokens expire after 30 days
- Refresh requires re-login

### Lead Capture Methods
1. **Chatbot**: AI-powered qualification (hardcoded flow)
2. **Discount Modal**: Auto-popup after 4 seconds
3. **Contact Form**: Manual submission
4. **API**: Direct API calls

### Notification System
- **Demo-Safe**: Works without Twilio (email fallback)
- **Client-Configurable**: Per-business preferences
- **Environment Toggles**: Global enable/disable
- **Never Fails**: Always falls back to email

### Database Structure
- **Users**: One user can have up to 3 businesses
- **Businesses**: Each business can have multiple leads
- **Leads**: Central lead storage (all sources)
- **Services**: Catalog of available services

---

## ✅ CHECKLIST FOR NEW DEVELOPERS

- [ ] Read this documentation
- [ ] Set up environment variables
- [ ] Run both servers locally
- [ ] Test registration/login
- [ ] Test chatbot lead capture
- [ ] Test dashboard lead viewing
- [ ] Test notification system
- [ ] Understand authentication flow
- [ ] Understand lead capture flow
- [ ] Understand notification flow

---

## 📞 SUPPORT

For issues or questions:
1. Check troubleshooting section
2. Review error logs in console
3. Check environment variables
4. Verify database connection
5. Test API endpoints with Postman

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Status**: Production Ready
