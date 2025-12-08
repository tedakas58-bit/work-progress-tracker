import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
};

export const annualPlanAPI = {
  create: (data) => api.post('/annual-plans', data),
  getAll: () => api.get('/annual-plans'),
  getById: (id) => api.get(`/annual-plans/${id}`),
};

export const reportAPI = {
  submit: (data) => api.post('/reports/submit', data),
  getMyReports: () => api.get('/reports/my-reports'),
  getAllReports: (planId) => api.get(`/reports/plan/${planId}`),
  getBranchComparison: (planId) => api.get(`/reports/comparison/${planId}`),
};

export const actionAPI = {
  create: (data) => api.post('/actions', data),
  getByPlan: (planId) => api.get(`/actions/plan/${planId}`),
  getMyReports: () => api.get('/actions/my-reports'),
  submit: (data) => api.post('/actions/submit', data),
  getAllReports: (planId) => api.get(`/actions/reports/plan/${planId}`),
  getSummary: (planId) => api.get(`/actions/summary/${planId}`),
};

export default api;
