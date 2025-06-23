import { boot } from 'quasar/wrappers'
import axios from 'axios'
import { getCurrentApiConfig } from 'src/config/app.config'

const api = axios.create({
  baseURL: getCurrentApiConfig().baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Добавляем токен к каждому запросу, если он есть
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Обработка ошибок
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('roles')
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)

export default boot(({ app }) => {
  // Убираем глобальный $axios, оставляем только настроенный $api
  // app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api } 