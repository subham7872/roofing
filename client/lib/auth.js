'use client';

import { authAPI } from './api';

export const login = async (email, password) => {
  try {
    const response = await authAPI.login({ email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

export const register = async (name, email, password) => {
  try {
    const response = await authAPI.register({ name, email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Registration failed' };
  }
};

export const logout = async () => {
  try {
    await authAPI.logout();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  } catch (error) {
    console.error('Logout error:', error);
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await authAPI.getMe();
    return response.data.data.user;
  } catch (error) {
    return null;
  }
};

