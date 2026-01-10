# ⚡ Quick Deployment Guide for Hostinger VPS

## 🚀 Quick Start (5 Minutes)

### Step 1: SSH into Your VPS

```bash
ssh root@your-vps-ip
```

### Step 2: Install Node.js 18+

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
sudo apt install -y nginx git
```

### Step 3: Clone/Upload Your Project

```bash
cd /var/www
sudo mkdir -p roofing && sudo chown -R $USER:$USER roofing
cd roofing
git clone https://github.com/your-username/roofing.git .
```

### Step 4: Setup Environment Variables

```bash
# Backend
cd server
nano .env
# Add your MongoDB URI, JWT_SECRET, SMTP credentials, etc.
# Save: Ctrl+X, then Y, then Enter

# Frontend
cd ../client
nano .env.local
# Add: NEXT_PUBLIC_API_URL=https://your-domain.com/api
# Save: Ctrl+X, then Y, then Enter
```

### Step 5: Install Dependencies and Build

```bash
cd /var/www/roofing/server
npm install --production

cd ../client
npm install --production
npm run build
```

### Step 6: Start with PM2

```bash
cd /var/www/roofing
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Follow instructions shown
```

### Step 7: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/roofing
```

Paste this (replace `your-domain.com` with your actual domain):

```nginx
upstream nextjs_frontend {
    server localhost:3000;
}

upstream express_backend {
    server localhost:8088;
}

server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    location / {
        proxy_pass http://nextjs_frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
    
    location /api {
        proxy_pass http://express_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Save and enable:

```bash
sudo ln -s /etc/nginx/sites-available/roofing /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### Step 8: Setup SSL (Optional but Recommended)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### Step 9: Test

Visit: `http://your-domain.com` or `https://your-domain.com`

---

## ✅ Verification

```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs

# Test locally
curl http://localhost:3000
curl http://localhost:8088/api/health
```

---

## 🔄 Future Updates

```bash
cd /var/www/roofing
git pull origin main
cd server && npm install --production && cd ..
cd client && npm install --production && npm run build && cd ..
pm2 restart all
```

---

## 🐛 Troubleshooting

**Issue: Port 3000 or 8088 in use**
```bash
sudo lsof -i :3000
sudo kill -9 <PID>
pm2 restart all
```

**Issue: 502 Bad Gateway**
```bash
pm2 status  # Check if processes are running
pm2 logs    # Check for errors
sudo tail -f /var/log/nginx/error.log
```

**Issue: Cannot build Next.js**
```bash
cd client
rm -rf .next node_modules
npm install
npm run build
```

---

## 📞 Need Help?

Check the full guide: `VPS_DEPLOYMENT_GUIDE.md`
