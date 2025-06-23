// Простой флаг для переключения режимов
export const USE_LOCAL_API = false; // true = локальный, false = сервер

// Определяем окружение
const isDevelopment = process.env.NODE_ENV === 'development';

// Конфигурация API
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

// Получение текущей конфигурации
export const getCurrentApiConfig = () => {
  return USE_LOCAL_API ? API_CONFIG.local : API_CONFIG.server;
};

// Базовый путь для роутера
export const getRouterBase = () => {
  return isDevelopment ? '/' : '/rFront/';
};

export const config = {
  API_CONFIG,
  getCurrentApiConfig,
  USE_LOCAL_API,
  getRouterBase,
  isDevelopment,
  // Для обратной совместимости
  API_URL: getCurrentApiConfig().baseURL,
} as const; 