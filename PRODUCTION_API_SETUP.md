# 🚀 Production API URL Setup Guide

## ✅ CONFIGURATION COMPLETE

All hardcoded API URLs have been replaced with environment variables. The system is now ready for both development and production.

---

## 📋 WHAT WAS UPDATED

### Frontend Files Updated:
1. ✅ `client/lib/api.js` - Already uses `NEXT_PUBLIC_API_URL`
2. ✅ `client/app/dashboard/page.js` - Uses `NEXT_PUBLIC_API_URL`
3. ✅ `client/components/ChatbotWidget.js` - Updated to use env variable
4. ✅ `client/components/ChatWidget.jsx` - Updated to use env variable  
5. ✅ `client/components/DiscountModal.js` - Updated (was localhost:5000, now uses env)
6. ✅ `client/app/contact/page.js` - Updated to use env variable
7. ✅ `client/lib/config.js` - **NEW** Centralized API config helper
8. ✅ `client/services/api.js` - Already uses `NEXT_PUBLIC_API_URL`

### Backend Files Updated:
1. ✅ `server/app.js` - CORS updated to include `lms.indiacampus.in`
2. ✅ `server/.env.example` - Added `FRONTEND_URL` and `CORS_ORIGIN` variables

---

## 🔧 ENVIRONMENT VARIABLES SETUP

### Frontend Configuration (`client/.env.local`)

**For Local Development:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8088
```

**For Production:**
```env
NEXT_PUBLIC_API_URL=https://lms.indiacampus.in
```

**Important:**
- Variable MUST start with `NEXT_PUBLIC_` to be accessible in browser
- No trailing slash (`/`) in URL
- Restart Next.js dev server after changes: `npm run dev`

### Backend Configuration (`server/.env`)

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
# OR set specific origins:
# CORS_ORIGIN=https://lms.indiacampus.in,https://www.indiacampus.in
```

---

## 🌐 PRODUCTION DEPLOYMENT STEPS

### Step 1: Frontend Deployment (Vercel)

1. **Push code to GitHub**

2. **Import project to Vercel**
   - Go to https://vercel.com
   - Import your repository
   - Configure build settings

3. **Set Environment Variables in Vercel Dashboard:**
   ```
   NEXT_PUBLIC_API_URL = https://lms.indiacampus.in
   ```

4. **Deploy**
   - Vercel will automatically deploy
   - Your frontend will be available at your Vercel URL (or custom domain)

### Step 2: Backend Deployment (Railway/Render)

1. **Push code to GitHub**

2. **Create new service** on Railway or Render

3. **Connect repository**

4. **Set Environment Variables in Dashboard:**
   ```
   PORT = 8088
   NODE_ENV = production
   FRONTEND_URL = https://lms.indiacampus.in
   CORS_ORIGIN = *
   MONGODB_URI = mongodb+srv://...
   JWT_SECRET = ...
   SMTP_USER = ...
   SMTP_PASSWORD = ...
   # ... all other backend env variables
   ```

5. **Set Custom Domain (if using subdomain):**
   - In Railway/Render dashboard, set custom domain: `lms.indiacampus.in`
   - Add DNS records as instructed by your hosting provider
   - Wait for SSL certificate (automatic with Railway/Render)

6. **Deploy**
   - Backend will be available at `https://lms.indiacampus.in`

### Step 3: Update Frontend Environment Variable

After backend is deployed and domain is configured:

1. **Update Vercel Environment Variable:**
   ```
   NEXT_PUBLIC_API_URL = https://lms.indiacampus.in
   ```

2. **Redeploy Frontend** (or Vercel will auto-deploy)

---

## 🔍 VERIFICATION

### Test Local Development

1. **Start Backend:**
   ```bash
   cd server
   npm run dev
   # Should run on http://localhost:8088
   ```

2. **Start Frontend:**
   ```bash
   cd client
   npm run dev
   # Should run on http://localhost:3000
   ```

3. **Check Browser Console:**
   - Open http://localhost:3000
   - Open DevTools (F12)
   - Check Network tab for API calls
   - Should show: `http://localhost:8088/api/...`

### Test Production

1. **Verify Backend is Running:**
   ```bash
   curl https://lms.indiacampus.in/health
   # Should return: {"success":true,"message":"Server is running"}
   ```

2. **Verify Frontend API Calls:**
   - Open your production frontend URL
   - Open DevTools (F12) → Network tab
   - Check API calls
   - Should show: `https://lms.indiacampus.in/api/...`

3. **Verify CORS:**
   - Frontend should be able to call backend without CORS errors
   - Check browser console for CORS errors

---

## 🎯 API URL USAGE

### In Code

All API calls now use:
```javascript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8088';

// Example:
fetch(`${API_BASE_URL}/api/leads`)
fetch(`${API_BASE_URL}/api/chatbot/structured`)
fetch(`${API_BASE_URL}/api/contact`)
```

### Files Using API URL:

- ✅ `client/lib/api.js` - Axios base URL
- ✅ `client/app/dashboard/page.js` - Dashboard leads fetch
- ✅ `client/components/ChatbotWidget.js` - Chatbot API calls
- ✅ `client/components/ChatWidget.jsx` - Chat widget API calls
- ✅ `client/components/DiscountModal.js` - Discount modal submission
- ✅ `client/app/contact/page.js` - Contact form submission
- ✅ `client/services/api.js` - Services API calls

---

## 🔐 CORS CONFIGURATION

### Backend CORS (`server/app.js`)

The backend now allows requests from:

**Development:**
- `http://localhost:3000`
- `http://localhost:3001`
- `http://localhost:5173`
- `http://127.0.0.1:3000`

**Production:**
- `https://lms.indiacampus.in`
- `http://lms.indiacampus.in`
- Any domain set in `FRONTEND_URL` environment variable

**Override:**
- Set `CORS_ORIGIN=*` in `.env` to allow all origins (less secure, but works for demos)

---

## 📝 QUICK REFERENCE

### Development
```env
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8088

# Backend (.env)
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=*
```

### Production
```env
# Frontend (Vercel Environment Variables)
NEXT_PUBLIC_API_URL=https://lms.indiacampus.in

# Backend (Railway/Render Environment Variables)
FRONTEND_URL=https://lms.indiacampus.in
CORS_ORIGIN=*
```

---

## ⚠️ IMPORTANT NOTES

1. **HTTPS Required for Production:**
   - Use `https://` (not `http://`) for production
   - Vercel provides HTTPS automatically
   - Railway/Render provides HTTPS automatically

2. **Environment Variable Naming:**
   - Frontend: Must start with `NEXT_PUBLIC_`
   - Backend: Any name (no prefix needed)

3. **Restart Required:**
   - Frontend: Restart Next.js dev server after changing `.env.local`
   - Backend: Restart server after changing `.env`

4. **DNS Configuration:**
   - Point `lms.indiacampus.in` to your backend server IP
   - Railway/Render will provide instructions for custom domain setup

5. **SSL Certificate:**
   - Railway/Render automatically provides SSL (HTTPS)
   - No manual SSL configuration needed

---

## ✅ CHECKLIST

Before deploying to production:

- [ ] Backend deployed and accessible at `https://lms.indiacampus.in`
- [ ] Backend `/health` endpoint returns success
- [ ] Frontend environment variable set: `NEXT_PUBLIC_API_URL=https://lms.indiacampus.in`
- [ ] Backend CORS includes `https://lms.indiacampus.in`
- [ ] All API calls use environment variable (no hardcoded URLs)
- [ ] Tested locally with production URL in `.env.local`
- [ ] DNS records configured for `lms.indiacampus.in`
- [ ] SSL certificate active (automatic with Railway/Render)

---

## 🐛 TROUBLESHOOTING

### Issue: CORS Error in Production

**Solution:**
1. Check backend `.env` has `FRONTEND_URL=https://lms.indiacampus.in`
2. Verify `lms.indiacampus.in` is in `allowedOrigins` array in `server/app.js`
3. Restart backend server

### Issue: API Calls Go to localhost in Production

**Solution:**
1. Check Vercel environment variables: `NEXT_PUBLIC_API_URL`
2. Ensure value is `https://lms.indiacampus.in` (not localhost)
3. Redeploy frontend

### Issue: Backend Not Accessible

**Solution:**
1. Verify backend is running: `curl https://lms.indiacampus.in/health`
2. Check DNS records point to correct server
3. Verify SSL certificate is active
4. Check backend logs for errors

---

## 📞 SUPPORT

For issues:
1. Check `ENVIRONMENT_SETUP.md` for detailed configuration
2. Verify all environment variables are set correctly
3. Check browser console and backend logs
4. Test API endpoints with Postman or curl

---

**Status:** ✅ Production Ready
**Last Updated:** January 2025
