import axios from 'axios';

const isLocal = window.location.hostname === "localhost"; 

const API_BASE_URL = isLocal
  ? "http://localhost:5000" 
  : "https://zippy-vtu.onrender.com"; 

// const API_BASE_URL =  "http://localhost:5000" ;

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
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
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
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

export default api;
