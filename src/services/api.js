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
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Only redirect to login if it's a 401 error and not from the login or initial user check
    const isAuthRequest = error.config.url.includes('/auth/login') || error.config.url.includes('/user/me');
    
    if (error.response?.status === 401 && !isAuthRequest) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Prevent multiple redirects if we are already on the login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?expired=true';
      }
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
