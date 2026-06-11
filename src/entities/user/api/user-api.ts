import { api } from '@/shared/api/axios-instance'
import type { User } from '../model/user.types'

export const fetchUserProfile = () =>
  api.get<User>('/users/me/profile').then((response) => response.data)
