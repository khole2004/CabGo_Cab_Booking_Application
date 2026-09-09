import apiClient from './apiClient';
import { ENDPOINTS } from '../constants/apiEndpoints';

export const userService = {
  getMe: async () => {
    const response = await apiClient.get(ENDPOINTS.USERS.ME);
    return response.data?.data;
  },

  getSavedLocations: async () => {
    const response = await apiClient.get(ENDPOINTS.USERS.SAVED_LOCATIONS);
    return response.data?.data || [];
  },

  addSavedLocation: async (locationData) => {
    const response = await apiClient.post(ENDPOINTS.USERS.SAVED_LOCATIONS, locationData);
    return response.data?.data;
  },

  deleteSavedLocation: async (id) => {
    const response = await apiClient.delete(ENDPOINTS.USERS.DELETE_LOCATION(id));
    return response.data;
  },

  verifyCoupon: async (code) => {
    const response = await apiClient.get(ENDPOINTS.USERS.VERIFY_COUPON(code));
    return response.data?.data;
  },
};