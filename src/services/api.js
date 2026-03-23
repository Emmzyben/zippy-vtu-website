import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});


// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    console.log('🚀 API Request:', config.method?.toUpperCase(), config.url, config.data || '');
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      code: error.code
    });
    if (error.response?.status === 401 && !error.config.url.includes('/user/me')) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Beneficiaries API
export const beneficiariesAPI = {
  getBeneficiaries: () => api.get('/beneficiaries'),
  addBeneficiary: (data) => api.post('/beneficiaries', data),
  deleteBeneficiary: (id) => api.delete(`/beneficiaries/${id}`),
};

export const phoneBeneficiariesAPI = {
  getAll: () => api.get('/beneficiaries/phone'),
  add: (data) => api.post('/beneficiaries/phone', data),
  delete: (id) => api.delete(`/beneficiaries/phone/${id}`),
};

export const emailBeneficiariesAPI = {
  getAll: () => api.get('/beneficiaries/email'),
  add: (data) => api.post('/beneficiaries/email', data),
  delete: (id) => api.delete(`/beneficiaries/email/${id}`),
};

export default api;
