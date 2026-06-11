import { create } from 'zustand'
import type { User } from './user.types'

type UserStore = {
  isAuthInitialized: boolean
  user: User | null
  isAuthenticated: boolean
  initializeAuth: (payload: { isAuthenticated: boolean; user: User | null }) => void
  setUser: (user: User | null) => void
  clearAuth: () => void
}

export const useUserStore = create<UserStore>((set) => ({
  isAuthInitialized: false,
  user: null,
  isAuthenticated: false,
  initializeAuth: ({ isAuthenticated, user }) =>
    set({ isAuthInitialized: true, isAuthenticated, user }),
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  clearAuth: () => set({ isAuthInitialized: true, isAuthenticated: false, user: null }),
}))
