const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Server error');
  }
  return data;
};

export const registerUser = (payload) => request('/auth/register', {
  method: 'POST',
  body: JSON.stringify(payload)
});

export const sendOTP = (payload) => request('/auth/send-otp', {
  method: 'POST',
  body: JSON.stringify(payload)
});

export const verifyOTP = (payload) => request('/auth/verify-otp', {
  method: 'POST',
  body: JSON.stringify(payload)
});

export const loginWithPassword = (payload) => request('/auth/login', {
  method: 'POST',
  body: JSON.stringify(payload)
});

export const getCurrentUser = () => request('/auth/me');

export const createOrder = (payload) => request('/payment/checkout', {
  method: 'POST',
  body: JSON.stringify(payload)
});

export const verifyPayment = (payload) => request('/payment/verify', {
  method: 'POST',
  body: JSON.stringify(payload)
});

export const forgotPassword = (payload) => request('/auth/forgot-password', {
  method: 'POST',
  body: JSON.stringify(payload)
});

export const resetPassword = (payload) => request('/auth/reset-password', {
  method: 'POST',
  body: JSON.stringify(payload)
});

export const fetchMyOrders = () => request('/payment/my-orders');

// User Profile & Address Management
export const updateProfile = (payload) => request('/users/profile', {
  method: 'PUT',
  body: JSON.stringify(payload)
});

export const fetchAddresses = () => request('/users/addresses');

export const addAddress = (payload) => request('/users/addresses', {
  method: 'POST',
  body: JSON.stringify(payload)
});

export const updateAddress = (id, payload) => request(`/users/addresses/${id}`, {
  method: 'PUT',
  body: JSON.stringify(payload)
});

export const deleteAddress = (id) => request(`/users/addresses/${id}`, {
  method: 'DELETE'
});

export const deactivateAccount = () => request('/users/deactivate', {
  method: 'PUT'
});

export const deleteAccount = () => request('/users/deactivate', {
  method: 'PUT'
});

// ─── Product Management (Public & Admin) ─────────────────────

export const fetchProducts = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return request(`/products?${query}`);
};

export const fetchProductById = (id) => request(`/products/${id}`);

export const adminAddProduct = (payload) => request('/admin/products', {
  method: 'POST',
  body: JSON.stringify(payload)
});

export const adminUpdateProduct = (id, payload) => request(`/admin/products/${id}`, {
  method: 'PUT',
  body: JSON.stringify(payload)
});

export const adminDeleteProduct = (id) => request(`/admin/products/${id}`, {
  method: 'DELETE'
});

export const adminFetchStats = () => request('/admin/stats/advanced');

// Default export for unified access (used by Admin components)
const api = {
  get: (url) => request(url, { method: 'GET' }),
  post: (url, data) => request(url, { method: 'POST', body: JSON.stringify(data) }),
  put: (url, data) => request(url, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (url) => request(url, { method: 'DELETE' }),
};

export default api;

