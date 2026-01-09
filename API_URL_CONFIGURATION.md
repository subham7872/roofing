# 🌐 API URL Configuration - Complete Setup

## ✅ CONFIGURATION STATUS

**All hardcoded API URLs have been replaced with environment variables.**

The system now supports:
- ✅ Local Development: `http://localhost:8088/api`
- ✅ Production: `https://lms.indiacampus.in/api`

---

## 📋 FILES UPDATED

### Frontend Files (All Use `NEXT_PUBLIC_API_URL`):

1. ✅ `client/lib/api.js` - Axios base configuration
2. ✅ `client/app/dashboard/page.js` - Dashboard API calls
3. ✅ `client/components/ChatbotWidget.js` - Chatbot structured API calls
4. ✅ `client/components/ChatWidget.jsx` - Chat widget API calls
5. ✅ `client/components/DiscountModal.js` - Discount modal submission (was localhost:5000, now fixed)
6. ✅ `client/app/contact/page.js` - Contact form submission
7. ✅ `client/lib/config.js` - **NEW** Centralized API config helper
8. ✅ `client/services/api.js` - Services API calls

### Backend Files:

1. ✅ `server/app.js` - CORS updated to include `lms.indiacampus.in`

---

## 🔧 ENVIRONMENT VARIABLES

### Frontend Environment File

**Location:** `client/.env.local` (create if doesn't exist)

**For Local Development:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8088
```

**For Production:**
```env
NEXT_PUBLIC_API_URL=https://lms.indiacampus.in
```

**Important:**
- File name must be `.env.local` (not `.env`)
- Variable MUST start with `NEXT_PUBLIC_` prefix
- No trailing slash in URL
- Restart Next.js dev server after changes: `cd client && npm run dev`

### Backend Environment File

**Location:** `server/.env`

**For Local Development:**
```env
PORT=8088
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=*
```

**For Production:**
```env
PORT=8088
NODE_ENV=production
FRONTEND_URL=https://lms.indiacampus.in
CORS_ORIGIN=*
```

---

## 🚀 SETUP STEPS

### Step 1: Create Frontend Environment File

```bash
cd client
touch .env.local
```

Add to `.env.local`:
```env
# Local Development
NEXT_PUBLIC_API_URL=http://localhost:8088

# For Production (uncomment when deploying):
# NEXT_PUBLIC_API_URL=https://lms.indiacampus.in
```

### Step 2: Update Backend Environment File

Edit `server/.env` and add/update:
```env
# Add these if not present:
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=*
```

For production, update to:
```env
FRONTEND_URL=https://lms.indiacampus.in
CORS_ORIGIN=*
```

### Step 3: Restart Servers

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

---

## 🎯 HOW IT WORKS

### Development Mode

When `NEXT_PUBLIC_API_URL=http://localhost:8088`:

- All API calls go to: `http://localhost:8088/api/...`
- Backend runs on: `http://localhost:8088`
- Frontend runs on: `http://localhost:3000`
- CORS allows: `http://localhost:3000`

### Production Mode

When `NEXT_PUBLIC_API_URL=https://lms.indiacampus.in`:

- All API calls go to: `https://lms.indiacampus.in/api/...`
- Backend runs on: `https://lms.indiacampus.in`
- Frontend runs on: (Your Vercel domain)
- CORS allows: `https://lms.indiacampus.in` and your frontend domain

---

## 🔍 VERIFICATION

### Check API URL in Code

Open browser console (F12) and type:
```javascript
console.log(process.env.NEXT_PUBLIC_API_URL)
```

Should show:
- Development: `http://localhost:8088`
- Production: `https://lms.indiacampus.in`

### Check API Calls in Network Tab

1. Open DevTools (F12)
2. Go to Network tab
3. Trigger an API call (e.g., submit chatbot, view dashboard)
4. Check request URL:
   - Development: `http://localhost:8088/api/...`
   - Production: `https://lms.indiacampus.in/api/...`

### Test Backend Endpoint

```bash
# Development
curl http://localhost:8088/health

# Production
curl https://lms.indiacampus.in/health
```

Should return:
```json
{"success":true,"message":"Server is running"}
```

---

## 📦 PRODUCTION DEPLOYMENT

### Frontend (Vercel)

1. **Set Environment Variable in Vercel Dashboard:**
   - Go to Project Settings → Environment Variables
   - Add: `NEXT_PUBLIC_API_URL` = `https://lms.indiacampus.in`
   - Apply to: Production, Preview, Development

2. **Redeploy:**
   - Vercel will automatically redeploy
   - Or trigger manual deployment

### Backend (Railway/Render)

1. **Set Environment Variables:**
   ```
   FRONTEND_URL=https://lms.indiacampus.in
   CORS_ORIGIN=*
   PORT=8088
   NODE_ENV=production
   ```

2. **Set Custom Domain:**
   - Railway/Render → Settings → Custom Domain
   - Add: `lms.indiacampus.in`
   - Follow DNS configuration instructions

3. **Verify:**
   - Check `https://lms.indiacampus.in/health` returns success

---

## ⚠️ IMPORTANT NOTES

1. **Environment Variable Naming:**
   - Frontend: Must use `NEXT_PUBLIC_` prefix
   - Backend: No prefix needed

2. **URL Format:**
   - Use `http://` for localhost
   - Use `https://` for production
   - No trailing slash (`/`)

3. **Restart Required:**
   - Frontend: Must restart Next.js dev server
   - Backend: Must restart Express server

4. **CORS Configuration:**
   - Production domain (`lms.indiacampus.in`) is already in allowed origins
   - Can use `CORS_ORIGIN=*` for development
   - For production, better to list specific domains

5. **DNS Setup:**
   - Point `lms.indiacampus.in` A record to your backend server IP
   - Railway/Render will provide specific instructions
   - SSL certificate is automatic (HTTPS)

---

## ✅ CHECKLIST

Before deploying:

- [ ] Created `client/.env.local` with `NEXT_PUBLIC_API_URL`
- [ ] Updated `server/.env` with `FRONTEND_URL` and `CORS_ORIGIN`
- [ ] Tested locally with `http://localhost:8088`
- [ ] Verified API calls work in browser console
- [ ] Set production environment variables in hosting dashboards
- [ ] Configured DNS for `lms.indiacampus.in`
- [ ] Tested production backend endpoint (`/health`)
- [ ] Verified HTTPS is working (SSL certificate)

---

## 📞 SUPPORT

If API calls fail:

1. Check environment variable is set correctly
2. Verify backend is running
3. Check CORS configuration
4. Verify DNS and SSL certificate (production)
5. Check browser console for specific error messages

---

**Configuration Complete!** ✅
**Status:** Ready for Production
**Last Updated:** January 2025
