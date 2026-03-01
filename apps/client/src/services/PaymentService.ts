import { api } from '@/lib/api';

export interface PaymentDetails {
  amount: number;
  description: string;
  email: string;
  phoneNumber?: string;
  currency?: string;
  callbackUrl?: string;
  notification_id?: string;
}

export const initiatePayment = async (details: PaymentDetails) => {
  try {
    const { data } = await api.post('/payments/initiate', details);
    if (data.redirect_url) {
      window.location.href = data.redirect_url;
    } else {
      throw new Error("Redirect URL missing");
    }
  } catch (error) {
    throw error;
  }
};

export const initiateTip = async (params: {
  amount: number;
  email: string;
  phoneNumber?: string;
}) => {
  const { data } = await api.post('/payments/tip', {
    ...params,
    callbackUrl: window.location.origin + '/payment-success',
  });
  if (data.redirect_url) {
    window.location.href = data.redirect_url;
  }
  return data;
};

export const initiateMusicPurchase = async (params: {
  songIds: string[];
  email: string;
  phoneNumber?: string;
}) => {
  const { data } = await api.post('/purchases/initiate', {
    ...params,
    callbackUrl: window.location.origin + '/payment-success',
  });
  if (data.redirect_url) {
    window.location.href = data.redirect_url;
  }
  return data;
};

export const initiateTicketPurchase = async (params: {
  concertId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
}) => {
  const { data } = await api.post('/tickets/purchase', {
    ...params,
    callbackUrl: window.location.origin + '/payment-success',
  });
  if (data.redirect_url) {
    window.location.href = data.redirect_url;
  }
  return data;
};
