import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8088';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
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
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request made but no response received
      console.error('Network Error:', error.request);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const getServices = async () => {
  try {
    const response = await api.get('/api/services');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching services:', error);
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
