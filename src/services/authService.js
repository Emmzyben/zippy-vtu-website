import api from './api';

export const authService = {
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  async getCurrentUser() {
    try {
      const response = await api.get('/user/me');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get user');
    }
  },

  async updateProfile(userData) {
    try {
      const response = await api.put('/user/profile', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Profile update failed');
    }
  },

  async changePassword(passwords) {
    try {
      const response = await api.put('/user/password', passwords);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Password change failed');
    }
  },

  async googleAuth(credential, referralCode = '') {
    try {
      const response = await api.post('/auth/google', { 
        credential, 
        referral_code: referralCode 
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Google authentication failed');
    }
  }
};