#!/bin/bash

# Deployment Script for Hostinger VPS
# Run this script on your VPS server after initial setup

set -e

echo "🚀 Starting deployment process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}⚠️  PM2 is not installed. Installing PM2 globally...${NC}"
    npm install -g pm2
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"

# Navigate to project directory
cd "$(dirname "$0")"

# Install/Update dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"

# Backend dependencies
echo "Installing backend dependencies..."
cd server
npm install --production
cd ..

# Frontend dependencies
echo "Installing frontend dependencies..."
cd client
npm install --production
npm run build
cd ..

# Create logs directory
mkdir -p logs

# Stop existing processes
echo -e "${YELLOW}🛑 Stopping existing processes...${NC}"
pm2 stop all || true
pm2 delete all || true

# Start applications with PM2
echo -e "${GREEN}🚀 Starting applications with PM2...${NC}"
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system reboot
pm2 startup

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${YELLOW}📝 Next steps:${NC}"
echo "1. Configure nginx with the provided nginx.conf"
echo "2. Update domain names in nginx.conf"
echo "3. Test the application: curl http://localhost:3000"
echo "4. Setup SSL certificate with Let's Encrypt (optional but recommended)"
echo ""
echo "View logs: pm2 logs"
echo "View status: pm2 status"
echo "Restart apps: pm2 restart all"
