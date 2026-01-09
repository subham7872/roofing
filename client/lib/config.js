/**
 * API Configuration
 * Centralized API URL configuration for both development and production
 */

// Get API base URL from environment variable
// Development: http://localhost:8088
// Production: https://lms.indiacampus.in (or your production backend URL)
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8088';

// Helper to ensure API URL doesn't have trailing slash
export const getApiUrl = (endpoint) => {
  const baseUrl = API_BASE_URL.replace(/\/$/, ''); // Remove trailing slash
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};

export default API_BASE_URL;
