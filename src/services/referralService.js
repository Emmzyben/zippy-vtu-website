import api from './api';

export const referralService = {
  async getReferralData() {
    try {
      const response = await api.get('/referral');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get referral data');
    }
  },

  async getReferralHistory() {
    try {
      const response = await api.get('/referral/history');
      return response.data.referrals;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get referral history');
    }
  }
};