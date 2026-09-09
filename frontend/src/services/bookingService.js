import apiClient from './apiClient';
import { ENDPOINTS } from '../constants/apiEndpoints';

export const bookingService = {
  create: async (bookingData) => {
    const response = await apiClient.post(ENDPOINTS.BOOKINGS.CREATE, bookingData);
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(ENDPOINTS.BOOKINGS.BY_ID(id));
    return response.data?.data;
  },

  getByRef: async (ref) => {
    const response = await apiClient.get(ENDPOINTS.BOOKINGS.BY_REF(ref));
    return response.data?.data;
  },

  getMyBookings: async () => {
    const response = await apiClient.get(ENDPOINTS.BOOKINGS.MY_BOOKINGS);
    return response.data?.data || [];
  },

  updateStatus: async (id, status, otpCode = null, cancellationReason = null) => {
    const response = await apiClient.patch(ENDPOINTS.BOOKINGS.UPDATE_STATUS(id), {
      status,
      otpCode,
      cancellationReason,
    });
    return response.data;
  },

  cancel: async (id, reason = 'User requested cancellation') => {
    const response = await apiClient.post(ENDPOINTS.BOOKINGS.CANCEL(id), null, {
      params: { reason },
    });
    return response.data;
  },
};