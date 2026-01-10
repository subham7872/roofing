// PM2 Ecosystem Configuration for VPS Deployment
// This file manages both Next.js frontend and Express backend

module.exports = {
  apps: [
    {
      name: 'nextjs-frontend',
      cwd: './client',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8088',
      },
      error_file: './logs/nextjs-error.log',
      out_file: './logs/nextjs-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
    },
    {
      name: 'express-backend',
      cwd: './server',
      script: 'app.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 8088,
        FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
      },
      error_file: './logs/express-error.log',
      out_file: './logs/express-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
    },
  ],
};
