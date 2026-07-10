import { api } from '@/shared/api/axios-instance'
import type {
  CreateRefundPayload,
  MyContract,
  Refund,
  UpdateUserProfilePayload,
  User,
} from '../model/user.types'

export const fetchUserProfile = () =>
  api.get<User>('/users/me').then((response) => response.data)

export const updateUserProfile = (payload: UpdateUserProfilePayload) =>
  api.patch<User>('/users/me', payload).then((response) => response.data)

export const fetchMyRefunds = () =>
  api.get<Refund[]>('/refunds/me').then((response) => response.data)

export const createRefund = (payload: CreateRefundPayload) =>
  api.post<Refund>('/refunds', payload).then((response) => response.data)

export const fetchMyContract = () =>
  api.get<MyContract>('/contracts/me').then((response) => response.data)
