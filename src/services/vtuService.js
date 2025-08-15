import api from './api';

export const vtuService = {
  async buyAirtime(data) {
    try {
      const response = await api.post('/vtu/airtime', data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Airtime purchase failed');
    }
  },

  async buyData(data) {
    try {
      const response = await api.post('/vtu/data', data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Data purchase failed');
    }
  },

  async payBill(data) {
    try {
      const response = await api.post('/vtu/bills', data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Bill payment failed');
    }
  },

  async getDataPlans(network) {
    try {
      const response = await api.get(`/vtu/data-plans/${network}`);
      return response.data.plans;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get data plans');
    }
  },

  async getBillProviders(type) {
    try {
      const response = await api.get(`/vtu/bill-providers/${type}`);
      return response.data.providers;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get providers');
    }
  }
};