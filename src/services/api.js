import axios from 'axios';

// In local dev: REACT_APP_API_URL=http://localhost:5000/api
// In Vercel production: same-origin /api (no env var needed)
const BASE_URL = process.env.REACT_APP_API_URL || '/api';

const client = axios.create({ baseURL: BASE_URL });

// Attach JWT token to every request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('vasavi_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normalise errors to a consistent shape
client.interceptors.response.use(
  (res) => res.data,
  (err) => Promise.reject(err.response?.data || { error: 'Network error' })
);

export const api = {
  // Auth
  login: (phone, password) => client.post('/auth/login', { phone, password }),
  signup: (name, shop, phone, password) => client.post('/auth/signup', { name, shop, phone, password }),

  // Products
  getProducts: (params = {}) => client.get('/products', { params }),
  getProductById: (id) => client.get(`/products/${id}`),

  // Orders
  getOrders: () => client.get('/orders'),
  placeOrder: (items, total, deliverySlot, address) =>
    client.post('/orders', { items, total, deliverySlot, address }),

  // User
  getMe: () => client.get('/users/me'),
  updateMe: (data) => client.put('/users/me', data),

  // Dashboard
  getDashboardStats: () => client.get('/dashboard/stats'),
};
