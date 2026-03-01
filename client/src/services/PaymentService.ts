import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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
    const res = await axios.post(`${API_URL}/payments/initiate`, details);
    if (res.data.redirect_url) {
      window.location.href = res.data.redirect_url;
    } else {
      throw new Error("Redirect URL missing");
    }
  } catch (error) {
    console.error("Payment initiation failed", error);
    throw error;
  }
};
