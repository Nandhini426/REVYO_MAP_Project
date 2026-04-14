// ============================================================
//  API Service — connects frontend to backend
// ============================================================

import axios from 'axios';

const API_BASE = 'http://localhost:5002/api';

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const user = localStorage.getItem('revyo_user');
  if (user) {
    try {
      const { token } = JSON.parse(user);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch { /* empty */ }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const data = error.response?.data;
    let message = data?.message || error.message || 'Request failed';
    
    // If there are detailed validation errors, combine them
    if (data?.errors && Array.isArray(data.errors)) {
      const detailed = data.errors.map(e => e.message).join(', ');
      message = `${message}: ${detailed}`;
    }
    
    throw new Error(message);
  }
);

// ── Auth ────────────────────────────────
export const authAPI = {
  register: (body) => api.post('/auth/register', body),
  login: (body) => api.post('/auth/login', body),
  getMe: () => api.get('/auth/me'),
  getUsers: () => api.get('/auth/users'),
  updateUserStatus: (id, status) => api.patch(`/auth/users/${id}/status`, { status }),
  checkEmail: (email) => api.post('/auth/check-email', { email }),
};

// ── Products ────────────────────────────
export const productAPI = {
  getAll: () => api.get('/products'),
  getOne: (id) => api.get(`/products/${id}`),
  create: (body) => api.post('/products', body),
  update: (id, body) => api.put(`/products/${id}`, body),
  delete: (id) => api.delete(`/products/${id}`),
};

// ── Orders ──────────────────────────────
export const orderAPI = {
  getAll: () => api.get('/orders'),
  getOne: (id) => api.get(`/orders/${id}`),
  place: (data) => api.post('/orders', data),
  updateStatus: (id, status) =>
    api.patch(`/orders/${id}/status`, { status }),
  downloadInvoice: (id) => api.get(`/orders/${id}/invoice`, { responseType: 'blob' })
}

// ── Donations ───────────────────────────
export const donationAPI = {
  getAll: () => api.get('/donations'),
  create: (body) => api.post('/donations', body),
  claim: (id) => api.patch(`/donations/${id}/claim`),
  confirmPickup: (id) => api.patch(`/donations/${id}/pickup`),
  getStats: () => api.get('/donations/stats'),
};
