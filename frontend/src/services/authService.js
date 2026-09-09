import apiClient from './apiClient';
import { ENDPOINTS } from '../constants/apiEndpoints';
import { tokenStorage } from '../utils/tokenStorage';

export const authService = {
  login: async (identifier, password, role = 'passenger') => {
    const response = await apiClient.post(ENDPOINTS.AUTH.LOGIN, {
      identifier,
      password,
      role,
    });
    if (response.data?.success && response.data?.data) {
      const { token, user } = response.data.data;
      tokenStorage.setToken(token);
      tokenStorage.setUser(user);
    }
    return response.data;
  },

  register: async (registerData) => {
    const response = await apiClient.post(ENDPOINTS.AUTH.REGISTER, registerData);
    if (response.data?.success && response.data?.data) {
      const { token, user } = response.data.data;
      tokenStorage.setToken(token);
      tokenStorage.setUser(user);
    }
    return response.data;
  },

  logout: () => {
    tokenStorage.clearAll();
  },

  getCurrentUser: () => {
    return tokenStorage.getUser();
  },

  isAuthenticated: () => {
    return !!tokenStorage.getToken();
  },
};