import { api } from '@/shared/api/axios-instance'
import type { UpdateUserProfilePayload, User } from '../model/user.types'

export const fetchUserProfile = () =>
  api.get<User>('/users/me').then((response) => response.data)

export const updateUserProfile = (payload: UpdateUserProfilePayload) =>
  api.patch<User>('/users/me', payload).then((response) => response.data)
