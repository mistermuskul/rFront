export const config = {
    API_URL: import.meta.env.VITE_API_URL || 'https://rserver-production.up.railway.app/api',
    // Здесь можно добавить другие общие настройки приложения
} as const; 