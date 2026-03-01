import axios from 'axios';

export const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/api',
  withCredentials: true,
});

// Attach JWT token from localStorage to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Redirect to login on 401 (expired/invalid token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      // Only redirect if we're on an admin page (avoid redirecting public users)
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  },
);

export type BookingRequestPayload = {
  fullName: string;
  email: string;
  phone: string;
  eventType: 'WEDDING' | 'CORPORATE' | 'FESTIVAL' | 'PRIVATE' | 'OTHER';
  eventDate: string; // ISO date (YYYY-MM-DD)
  location: string;
  budgetUGX?: number;
  message?: string;
};

export async function createBookingRequest(payload: BookingRequestPayload) {
  const { data } = await api.post('/bookings', payload);
  return data;
}

export type PaymentRequestPayload = {
  amount: number;
  currency: string;
  description: string;
  email: string;
  phoneNumber?: string;
  callbackUrl: string;
  notification_id?: string;
};

export async function initiatePayment(payload: PaymentRequestPayload) {
  const { data } = await api.post('/payments/initiate', payload);
  return data;
}
