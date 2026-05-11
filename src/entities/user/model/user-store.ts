import { create } from 'zustand'
import type { User } from './user.types'

type UserStore = {
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User) => void
  setToken: (token: string) => void
  logout: () => void
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem('auth_token'),
  setUser: (user) => set({ user, isAuthenticated: true }),
  setToken: (token) => {
    localStorage.setItem('auth_token', token)
    set({ isAuthenticated: true })
  },
  logout: () => {
    localStorage.removeItem('auth_token')
    set({ user: null, isAuthenticated: false })
  },
}))
