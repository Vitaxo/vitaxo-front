import { api } from '@/shared/api/axios-instance'
import type { AuthResponse } from '../model/user.types'

type LoginPayload = { email: string; password: string }
type RegisterPayload = { name: string; email: string; password: string }

export const loginUser = (payload: LoginPayload) =>
  api.post<AuthResponse>('/auth/login', payload).then((r) => r.data)

export const registerUser = (payload: RegisterPayload) =>
  api.post<AuthResponse>('/auth/register', payload).then((r) => r.data)
