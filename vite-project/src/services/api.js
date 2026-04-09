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
