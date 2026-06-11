import { api } from '@/shared/api/axios-instance'
import type { User } from '../model/user.types'

export const fetchUserProfile = () =>
  api.get<User>('/users/me').then((response) => response.data)
