import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useUserStore } from '@/entities/user'

export const GuestOnlyRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useUserStore()

  if (isAuthenticated) {
    return <Navigate replace to="/dashboard" />
  }

  return <>{children}</>
}

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useUserStore()

  if (!isAuthenticated) {
    return <Navigate replace to="/" />
  }

  return <>{children}</>
}
