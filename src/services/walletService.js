import api from './api';

export const walletService = {
  async getBalance() {
    try {
      const response = await api.get('/wallet/balance');
      return response.data.balance;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get balance');
    }
  },

  async getTransactions() {
    try {
      const response = await api.get('/transactions');
      return response.data.transactions;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get transactions');
    }
  },

  async fundWallet(amount) {
    try {
      const response = await api.post('/wallet/fund', { amount });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fund wallet');
    }
  },

  async processTransaction(transactionData) {
    try {
      const response = await api.post('/wallet/transaction', transactionData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Transaction failed');
    }
  }
};