import apiClient from './apiClient';
import { ENDPOINTS } from '../constants/apiEndpoints';

export const driverService = {
  getProfile: async () => {
    const response = await apiClient.get(ENDPOINTS.DRIVERS.ME);
    return response.data?.data;
  },

  updateStatus: async (statusData) => {
    const response = await apiClient.patch(ENDPOINTS.DRIVERS.UPDATE_STATUS, statusData);
    return response.data?.data;
  },

  getOnlineDrivers: async () => {
    const response = await apiClient.get(ENDPOINTS.DRIVERS.ONLINE);
    return response.data?.data || [];
  },

  getIncomingRequests: async () => {
    const response = await apiClient.get(ENDPOINTS.DRIVERS.INCOMING);
    return response.data?.data || [];
  },
};