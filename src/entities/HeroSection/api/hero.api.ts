import type { ServerHeroInfo } from '../model/hero.model'
import { api } from 'src/boot/axios'
import type { AxiosError } from 'axios'
import type { HeroInfo } from '../model/hero.model'

// Убираем жестко заданный baseURL, используем настройку из axios
// api.defaults.baseURL = 'http://127.0.0.1:8000/api'

function toSnakeCase<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  const res: Record<string, unknown> = {}
  for (const key in obj) {
    res[key.replace(/([A-Z])/g, '_$1').toLowerCase()] = obj[key]
  }
  return res
}

// Получить данные героя
export async function getHeroInfo(): Promise<ServerHeroInfo> {
  const res = await api.get('/hero')
  return res.data
}

// Обновить данные героя
export async function updateHeroInfo(data: ServerHeroInfo): Promise<ServerHeroInfo> {
  try {
    const res = await api.post('/hero', toSnakeCase(data as unknown as Record<string, unknown>))
    return res.data
  } catch (error: unknown) {
    let message = 'Ошибка сохранения профиля'
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const axiosError = error as AxiosError<{ message?: string; errors?: Record<string, string[]> }>
      const err = axiosError.response?.data
      if (err) {
        if (err.message) message = err.message
        if (err.errors) message += ': ' + Object.values(err.errors).flat().join(', ')
      }
    }
    throw new Error(message)
  }
}

export const heroApi = {
  getHero: () => {
    return api.get<HeroInfo>('/hero/1')
  },

  updateHero: (data: HeroInfo) => {
    return api.put<HeroInfo>('/hero/1', data)
  }
} 