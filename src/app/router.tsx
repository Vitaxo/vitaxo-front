import { createBrowserRouter } from 'react-router-dom'
import { GuestOnlyRoute, ProtectedRoute } from './auth-guard'
import { DashboardPage } from '@/pages/dashboard'
import { DocumentsPage } from '@/pages/documents'
import { LoginPage } from '@/pages/login'
import { RegisterPage } from '@/pages/register'

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
])
