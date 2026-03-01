import axios from 'axios';

export const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/api',
  withCredentials: true,
});

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
