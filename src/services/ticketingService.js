import api from './api';

export const ticketingService = {
  async getEvents() {
    try {
      const response = await api.get('/ticketing/events');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch events');
    }
  },

  async getEventDetails(id) {
    try {
      const response = await api.get(`/ticketing/event?id=${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch event details');
    }
  },

  async purchaseTicket(ticketTypeId) {
    try {
      const response = await api.post('/ticketing/purchase', { ticket_type_id: ticketTypeId });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Purchase failed');
    }
  },

  async getMyTickets() {
    try {
      const response = await api.get('/ticketing/my-tickets');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch your tickets');
    }
  },

  async requestRefund(ticketId, reason) {
    try {
      const response = await api.post('/ticketing/refund-request', { ticket_id: ticketId, reason });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Refund request failed');
    }
  },

  async getRefundStatus(ticketId) {
    try {
      const response = await api.get(`/ticketing/refund-status?ticket_id=${ticketId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch refund status');
    }
  },

  async respondToReschedule(ticketId, choice) {
    try {
      const response = await api.post('/ticketing/respond-reschedule', { ticket_id: ticketId, choice });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Response to reschedule failed');
    }
  }
};
