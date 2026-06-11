import axios from 'axios'
import { env } from '@/shared/config/env'
import { getAccessToken } from '@/shared/lib/access-token'

export const api = axios.create({
  baseURL: env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = getAccessToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use((response) => response, (error) => Promise.reject(error))
