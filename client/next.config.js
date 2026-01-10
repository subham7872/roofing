/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone mode for better VPS deployment (creates optimized server build)
  output: 'standalone',
  
  images: {
    unoptimized: true, // Keep unoptimized for now
    // For production, you can add:
    // domains: ['your-domain.com'],
    // remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  
  // API rewrites - proxy API requests to Express backend
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8088';
    
    // If NEXT_PUBLIC_API_URL includes /api, use it as-is
    // Otherwise, append /api
    const apiBase = apiUrl.endsWith('/api') ? apiUrl.replace('/api', '') : apiUrl;
    
    return [
      {
        source: '/api/:path*',
        destination: `${apiBase}/api/:path*`,
      },
    ];
  },
  
  // Production optimizations
  poweredByHeader: false,
  compress: true,
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8088',
  },
};

module.exports = nextConfig;


