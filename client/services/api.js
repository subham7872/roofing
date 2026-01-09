import axios from 'axios';

// Try multiple possible ports
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side: check environment variable or try common ports
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8088';
  }
  // Server-side
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8088';
};

const API_BASE_URL = getApiBaseUrl();

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Increased timeout
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API] Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('[API] Response Error:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url
      });
    } else if (error.request) {
      // Request made but no response received
      console.error('[API] Network Error - No response received:', {
        message: error.message,
        code: error.code,
        url: error.config?.baseURL + error.config?.url,
        suggestion: 'Make sure the server is running on ' + API_BASE_URL
      });
    } else {
      // Something else happened
      console.error('[API] Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const getServices = async () => {
  try {
    const response = await api.get('/api/services');
    return response.data.data || [];
  } catch (error) {
    // More detailed error logging
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.error(`[API] Cannot connect to server at ${API_BASE_URL}. Make sure the server is running.`);
    } else if (error.code === 'ETIMEDOUT') {
      console.error(`[API] Request timeout. Server at ${API_BASE_URL} is not responding.`);
    } else {
      console.error('[API] Error fetching services:', error.message);
    }
    // Return empty array to prevent UI crash
    return [];
  }
};

export const getServiceById = async (id) => {
  try {
    const response = await api.get(`/api/services/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching service:', error);
    throw error;
  }
};

export const createService = async (serviceData) => {
  try {
    const response = await api.post('/api/services', serviceData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating service:', error);
    throw error;
  }
};

export const updateService = async (id, serviceData) => {
  try {
    const response = await api.put(`/api/services/${id}`, serviceData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating service:', error);
    throw error;
  }
};

export const deleteService = async (id) => {
  try {
    const response = await api.delete(`/api/services/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
};

// For file uploads (using FormData)
export const createServiceWithImage = async (formData) => {
  try {
    const response = await api.post('/api/services', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error creating service with image:', error);
    throw error;
  }
};

export const updateServiceWithImage = async (id, formData) => {
  try {
    const response = await api.put(`/api/services/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error updating service with image:', error);
    throw error;
  }
};
