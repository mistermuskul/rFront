export const USE_LOCAL_API = true; // true = локальный, false = сервер

const isDevelopment = process.env.NODE_ENV === 'development';

export const API_CONFIG = {
  local: {
    baseURL: 'http://localhost:8000/api',
    name: 'Локальный сервер'
  },
  server: {
    baseURL: 'https://rserver-production.up.railway.app/api',
    name: 'Продакшн сервер'
  }
} as const;

export const getCurrentApiConfig = () => {
  return USE_LOCAL_API ? API_CONFIG.local : API_CONFIG.server;
};

export const getRouterBase = () => {
  return isDevelopment ? '/' : '/rFront/';
};

export const config = {
  API_CONFIG,
  getCurrentApiConfig,
  USE_LOCAL_API,
  getRouterBase,
  isDevelopment,
  API_URL: getCurrentApiConfig().baseURL,
} as const; 