# 🔧 Git Repository Fix Instructions

## Issue Identified

It looks like you may have accidentally committed files that shouldn't be in git, such as:
- `.next/` build files (Next.js build output)
- `.env` files with secrets
- `node_modules/` dependencies

## ✅ What I've Fixed

1. **Updated `.gitignore`** to properly ignore:
   - `.next/` directories
   - `.env` files
   - `node_modules/`
   - Build outputs
   - Logs and cache files

2. **Removed tracked `.next` files** from git (but kept them locally)

## 🔧 Next Steps to Clean Your Repository

### Step 1: Remove All Tracked Files That Should Be Ignored

```bash
# Remove .next files from git tracking (already done, but verify)
git rm -r --cached client/.next

# Remove any .env files from tracking (if they were committed)
git rm --cached server/.env 2>/dev/null || true
git rm --cached client/.env.local 2>/dev/null || true

# Remove node_modules if tracked (shouldn't be, but check)
git rm -r --cached client/node_modules 2>/dev/null || true
git rm -r --cached server/node_modules 2>/dev/null || true

# Remove any other build/cache files
git rm -r --cached client/.next 2>/dev/null || true
```

### Step 2: Verify What Will Be Committed

```bash
git status
```

You should NOT see:
- ❌ `.env` files
- ❌ `.next/` directories
- ❌ `node_modules/`
- ❌ Build outputs

You SHOULD see:
- ✅ Source code files (`.js`, `.jsx`, `.json`, etc.)
- ✅ Configuration files (`.gitignore`, `next.config.js`, etc.)

### Step 3: Commit the Fix

```bash
# Stage the .gitignore update and removed files
git add .gitignore
git add -u  # Stage all deleted files

# Commit the cleanup
git commit -m "fix: Remove tracked build files and update .gitignore"

# If you had accidentally committed .env files with secrets:
# DO NOT PUSH YET - See Step 4 first!
```

### Step 4: If You Committed Secrets (IMPORTANT!)

If you accidentally committed `.env` files with secrets (MongoDB URI, JWT_SECRET, API keys, etc.), you need to:

#### Option A: If You Haven't Pushed Yet (Safe)

```bash
# Just commit the fix and push
git commit -m "fix: Remove secrets and update .gitignore"
git push origin main
```

#### Option B: If You Already Pushed (Remove from History)

```bash
# Remove .env files from git history using git filter-branch
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch server/.env client/.env.local" \
  --prune-empty --tag-name-filter cat -- --all

# Clean up
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push (dangerous - coordinate with team)
git push origin main --force-with-lease
```

**⚠️ WARNING:** Force pushing rewrites history. Only do this if you're working alone or have coordinated with your team.

### Step 5: Verify Secrets Are Removed

```bash
# Check if any secrets are still in the repository
git log --all --full-history -- server/.env
git log --all --full-history -- client/.env.local

# If these return nothing, secrets are removed ✅
```

### Step 6: Create .env.example Files (Recommended)

Create example files for others (without secrets):

```bash
# Backend .env.example
cd server
cat > .env.example << 'EOF'
# Server Configuration
NODE_ENV=production
PORT=8088
FRONTEND_URL=http://localhost:3000

# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# JWT Secret (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=your_secure_jwt_secret_min_32_characters

# Email Configuration
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASSWORD=your_smtp_password
FROM_EMAIL=your_email@example.com
REPLY_TO_EMAIL=your_email@example.com

# Twilio (Optional)
# TWILIO_ACCOUNT_SID=
# TWILIO_AUTH_TOKEN=
# TWILIO_PHONE_NUMBER=
# ENABLE_SMS=false
# ENABLE_WHATSAPP=false
EOF

# Frontend .env.example
cd ../client
cat > .env.example << 'EOF'
# API URL
NEXT_PUBLIC_API_URL=http://localhost:8088
EOF

cd ..
```

Then commit these example files:

```bash
git add server/.env.example client/.env.example
git commit -m "docs: Add .env.example files for configuration reference"
git push origin main
```

## ✅ Final Checklist

After fixing:

- [ ] `.gitignore` properly configured
- [ ] `.next/` files removed from git tracking
- [ ] `.env` files removed from git tracking
- [ ] `node_modules/` not tracked
- [ ] No secrets in git history (check with `git log --all`)
- [ ] `.env.example` files created (optional but recommended)
- [ ] Changes committed and pushed
- [ ] Secrets rotated (if they were exposed in git)

## 🛡️ Security Best Practices

1. **Never commit `.env` files** - They contain secrets
2. **Always use `.env.example`** - Show structure without secrets
3. **Rotate secrets** if they were exposed in git history
4. **Use environment variables** in deployment (VPS, hosting)
5. **Review commits** before pushing: `git diff --cached`

## 📝 Current Status

```bash
# Check what's currently tracked
git ls-files | grep -E "\.env|\.next|node_modules"

# Should return empty (nothing matching)
```

---

**Status:** ✅ Repository cleanup instructions provided  
**Action Required:** Follow steps above to clean your repository
