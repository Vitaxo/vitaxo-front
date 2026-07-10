import { createBrowserRouter } from 'react-router-dom'
import { GuestOnlyRoute, ProtectedRoute } from './auth-guard'
import { DashboardPage } from '@/pages/dashboard'
import { DocumentsPage } from '@/pages/documents'
import { GuaranteesPage } from '@/pages/guarantees'
import { LoginPage } from '@/pages/login'
import { ProfilePage } from '@/pages/profile'
import { RegisterPage } from '@/pages/register'
import { RefundsPage } from '@/pages/refunds'

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <GuestOnlyRoute>
        <LoginPage />
      </GuestOnlyRoute>
    ),
  },
  {
    path: '/register',
    element: (
      <GuestOnlyRoute>
        <RegisterPage />
      </GuestOnlyRoute>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/documents',
    element: (
      <ProtectedRoute>
        <DocumentsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/refunds',
    element: (
      <ProtectedRoute>
        <RefundsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/guarantees',
    element: (
      <ProtectedRoute>
        <GuaranteesPage />
      </ProtectedRoute>
    ),
  },
])
