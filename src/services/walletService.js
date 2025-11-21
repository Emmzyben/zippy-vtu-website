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
      throw new Error(error.response?.data?.message || 'Failed to initialize payment');
    }
  },

  async processTransaction(transactionData) {
    try {
      const response = await api.post('/wallet/transaction', transactionData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Transaction failed');
    }
  },

  async verifyPayment(reference) {
    try {
      const response = await api.post('/wallet/verify', { reference });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Payment verification failed');
    }
  },

  async validateRecipient(email) {
    try {
      const response = await api.post('/wallet/validate-recipient', { email });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to validate recipient');
    }
  },

  async transferFunds(recipientEmail, amount) {
    try {
      const response = await api.post('/wallet/transfer', {
        recipient_email: recipientEmail,
        amount: amount
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Transfer failed');
    }
  }
};
