import api from './api';

export const flightService = {
    getAirports: async () => {
        try {
            const response = await api.get('/flights/airports');
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch airports';
        }
    },

    searchFlights: async (searchData) => {
        try {
            const response = await api.post('/flights/search', searchData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Flight search failed';
        }
    },

    selectFlight: async (selectData) => {
        try {
            const response = await api.post('/flights/select', selectData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Flight selection failed';
        }
    },

    bookFlight: async (bookingData) => {
        try {
            const response = await api.post('/flights/book', bookingData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Flight booking failed';
        }
    },

    issueTicket: async (ticketData) => {
        try {
            const response = await api.post('/flights/ticket', ticketData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Ticket issuance failed';
        }
    },

    getBookingDetails: async (bookingId) => {
        try {
            const response = await api.get(`/flights/details/${bookingId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch booking details';
        }
    }
};
