import apiClient from './apiClient';
import { ENDPOINTS } from '../constants/apiEndpoints';

export const vehicleService = {
  getAll: async () => {
    const response = await apiClient.get(ENDPOINTS.VEHICLES.LIST);
    return response.data?.data || [];
  },

  getByCode: async (code) => {
    const response = await apiClient.get(ENDPOINTS.VEHICLES.BY_CODE(code));
    return response.data?.data;
  },
};