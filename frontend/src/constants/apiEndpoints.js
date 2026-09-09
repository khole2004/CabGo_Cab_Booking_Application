export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8088/api';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  VEHICLES: {
    LIST: '/vehicles',
    BY_CODE: (code) => `/vehicles/${code}`,
  },
  BOOKINGS: {
    CREATE: '/bookings',
    BY_ID: (id) => `/bookings/${id}`,
    BY_REF: (ref) => `/bookings/ref/${ref}`,
    MY_BOOKINGS: '/bookings/my-bookings',
    UPDATE_STATUS: (id) => `/bookings/${id}/status`,
    CANCEL: (id) => `/bookings/${id}/cancel`,
  },
  DRIVERS: {
    ME: '/drivers/me',
    UPDATE_STATUS: '/drivers/status',
    ONLINE: '/drivers/online',
    INCOMING: '/drivers/incoming-requests',
  },
  PAYMENTS: {
    PROCESS: '/payments/process',
    BY_BOOKING: (id) => `/payments/booking/${id}`,
  },
  USERS: {
    ME: '/users/me',
    SAVED_LOCATIONS: '/users/saved-locations',
    DELETE_LOCATION: (id) => `/users/saved-locations/${id}`,
    VERIFY_COUPON: (code) => `/users/verify-coupon/${code}`,
  },
};
