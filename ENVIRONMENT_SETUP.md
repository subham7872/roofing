# 🌐 Environment Configuration Guide

## API URL Configuration for Development and Production

This guide explains how to configure the API URL for both local development and production deployment.

---

## 📋 QUICK SETUP

### Frontend (Client) Configuration

1. **Create `.env.local` file in `client/` directory:**

```bash
cd client
touch .env.local
```

2. **Add API URL based on environment:**

**For Local Development:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8088
```

**For Production:**
```env
NEXT_PUBLIC_API_URL=https://lms.indiacampus.in
```

### Backend (Server) Configuration

1. **Update `server/.env` file:**

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

## 🔧 DETAILED CONFIGURATION

### Frontend Environment Variables

**File:** `client/.env.local`

| Variable | Development | Production | Description |
|----------|-------------|------------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8088` | `https://lms.indiacampus.in` | Backend API base URL |

**Important Notes:**
- `NEXT_PUBLIC_` prefix is required for Next.js to expose the variable to the browser
- The URL should NOT have a trailing slash (`/`)
- The API path (`/api`) is added automatically by the code

### Backend Environment Variables

**File:** `server/.env`

| Variable | Development | Production | Description |
|----------|-------------|------------|-------------|
| `PORT` | `8088` | `8088` (or your server port) | Backend server port |
| `NODE_ENV` | `development` | `production` | Environment mode |
| `FRONTEND_URL` | `http://localhost:3000` | `https://lms.indiacampus.in` | Frontend domain for CORS |
| `CORS_ORIGIN` | `*` (optional) | `*` (or specific domains) | CORS origin policy |

---

## 📁 FILES UPDATED

### Frontend Files Using API URL:

1. ✅ `client/lib/api.js` - Already uses `NEXT_PUBLIC_API_URL`
2. ✅ `client/app/dashboard/page.js` - Updated to use env variable
3. ✅ `client/components/ChatbotWidget.js` - Updated to use env variable
4. ✅ `client/components/ChatWidget.jsx` - Updated to use env variable
5. ✅ `client/components/DiscountModal.js` - Updated to use env variable
6. ✅ `client/app/contact/page.js` - Updated to use env variable
7. ✅ `client/lib/config.js` - **NEW** Centralized API config helper

### Backend Files:

1. ✅ `server/app.js` - CORS updated to include `lms.indiacampus.in`

---

## 🚀 HOW TO USE

### Local Development

1. **Frontend `.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8088
```

2. **Backend `.env`:**
```env
PORT=8088
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=*
```

3. **Run both servers:**
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

### Production Deployment

1. **Frontend `.env.local` (or Vercel Environment Variables):**
```env
NEXT_PUBLIC_API_URL=https://lms.indiacampus.in
```

2. **Backend `.env` (or Railway/Render Environment Variables):**
```env
PORT=8088
NODE_ENV=production
FRONTEND_URL=https://lms.indiacampus.in
CORS_ORIGIN=*
```

3. **Deploy:**
   - Frontend: Deploy to Vercel (environment variables set in dashboard)
   - Backend: Deploy to Railway/Render (environment variables set in dashboard)

---

## 🔍 VERIFICATION

### Check API URL in Browser Console

1. Open browser console (F12)
2. Type: `console.log(process.env.NEXT_PUBLIC_API_URL)`
3. Should show: `http://localhost:8088` (dev) or `https://lms.indiacampus.in` (prod)

### Check Backend CORS Logs

1. Start backend server
2. Check console for: `CORS blocked origin: ...` warnings
3. If you see warnings, add the origin to `allowedOrigins` in `server/app.js`

---

## ⚠️ IMPORTANT NOTES

1. **Frontend Environment Variables:**
   - Must start with `NEXT_PUBLIC_` to be accessible in browser
   - Changes require server restart (`npm run dev`)
   - `.env.local` is gitignored (never commit)

2. **Backend CORS:**
   - Production domain (`lms.indiacampus.in`) is already added
   - Can use `CORS_ORIGIN=*` to allow all origins (less secure)
   - Better: List specific domains in `allowedOrigins` array

3. **API Path:**
   - Frontend code uses: `${API_BASE_URL}/api/...`
   - Backend routes are mounted at: `/api`
   - Result: `https://lms.indiacampus.in/api/...`

4. **HTTPS:**
   - Production must use `https://` (not `http://`)
   - Vercel automatically provides HTTPS
   - Backend must support HTTPS (via reverse proxy or native)

---

## 🐛 TROUBLESHOOTING

### Issue: "CORS Error" in Browser

**Solution:**
1. Check backend `.env` has `FRONTEND_URL` set correctly
2. Verify domain is in `allowedOrigins` array in `server/app.js`
3. Restart backend server

### Issue: "API URL is undefined"

**Solution:**
1. Ensure `.env.local` exists in `client/` directory
2. Variable name must be `NEXT_PUBLIC_API_URL` (with `NEXT_PUBLIC_` prefix)
3. Restart Next.js dev server (`npm run dev`)

### Issue: "Network Error" or "Failed to fetch"

**Solution:**
1. Verify backend is running on correct port (8088)
2. Check `NEXT_PUBLIC_API_URL` matches backend URL
3. Verify no firewall blocking the connection
4. Check browser console for specific error message

---

## 📝 EXAMPLE CONFIGURATION

### Development Setup

**`client/.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8088
```

**`server/.env`:**
```env
PORT=8088
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
```

### Production Setup

**Vercel Environment Variables:**
```
NEXT_PUBLIC_API_URL = https://lms.indiacampus.in
```

**Railway/Render Environment Variables:**
```
PORT = 8088
NODE_ENV = production
FRONTEND_URL = https://lms.indiacampus.in
MONGODB_URI = mongodb+srv://...
JWT_SECRET = ...
```

---

## ✅ CHECKLIST

- [ ] Created `client/.env.local` with `NEXT_PUBLIC_API_URL`
- [ ] Updated `server/.env` with `FRONTEND_URL`
- [ ] Verified backend CORS includes production domain
- [ ] Tested local development (both servers running)
- [ ] Verified API calls work in browser console
- [ ] Set production environment variables in hosting dashboard
- [ ] Tested production deployment

---

**Last Updated:** January 2025
**Status:** Production Ready
