import api from './api';

export const organizerService = {
  async getDashboardStats() {
    try {
      const response = await api.get('/organizer/dashboard');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch dashboard stats');
    }
  },

  async getTransactions() {
    try {
      const response = await api.get('/organizer/transactions');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch organizer transactions');
    }
  },

  async getSettings() {
    try {
      const response = await api.get('/organizer/settings.php');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch settings');
    }
  },

  async uploadBanner(file) {
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await api.post('/uploads/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to upload banner');
    }
  },

  async getOrganizerEvents() {
    try {
      const response = await api.get('/organizer/events');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch your events');
    }
  },

  async getEventPerformance(id) {
    try {
      const response = await api.get(`/organizer/event-performance?id=${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch event performance');
    }
  },

  async enroll() {
    try {
      const response = await api.post('/organizer/enroll');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Enrollment failed');
    }
  },

  async createEvent(eventData) {
    try {
      const response = await api.post('/ticketing/events', eventData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create event');
    }
  },

  async cancelEvent(id) {
    try {
      const response = await api.post('/ticketing/cancel-event', { event_id: id });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to cancel event');
    }
  },

  async deleteEvent(id) {
    try {
      const response = await api.post('/ticketing/delete-event', { id });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete event');
    }
  },

  async rescheduleEvent(id, newDate) {
    try {
      const response = await api.post('/ticketing/reschedule-event', { event_id: id, new_date: newDate });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to reschedule event');
    }
  },

  async validateTicket(qrHash) {
    try {
      const response = await api.post('/ticketing/validate', { qr_hash: qrHash });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ticket validation failed');
    }
  }
};
