import apiClient from './apiClient';
import { ENDPOINTS } from '../constants/apiEndpoints';

export const paymentService = {
  processPayment: async (paymentData) => {
    const response = await apiClient.post(ENDPOINTS.PAYMENTS.PROCESS, paymentData);
    return response.data;
  },

  getByBooking: async (bookingId) => {
    const response = await apiClient.get(ENDPOINTS.PAYMENTS.BY_BOOKING(bookingId));
    return response.data?.data;
  },
};