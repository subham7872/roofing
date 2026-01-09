import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8088';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const submitEmergencyRequest = async (requestData) => {
  try {
    const response = await api.post('/api/emergency-requests', requestData);
    return response.data;
  } catch (error) {
    console.error('Error submitting emergency request:', error);
    throw error;
  }
};

export const getEmergencyRequestById = async (id) => {
  try {
    const response = await api.get(`/api/emergency-requests/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching emergency request:', error);
    throw error;
  }
};

