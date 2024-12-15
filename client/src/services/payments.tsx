
import axios from 'axios';
import CONFIG from '../config.tsx';

const API_URL = `${CONFIG.API_URL}/checkout`;

const api = axios.create({
    baseURL: API_URL,
});

export const createPaymentLink = async (paymentData: {
    success_url: string;
    cancel_url: string;
    unit_amount: number;
    runner_name: string;
    event_name: string;
  }) => {
    try {
      const response = await api.post('/create-payment-link', paymentData);
      return response.data;
    } catch (error) {
      console.error('Error creating payment link:', error.response || error.message);
      throw error;
    }
  };
  