import type { ReactNode } from 'react'
import { useUserStore } from '@/entities/user'
import { useAuthBootstrap } from '@/features/auth'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthInitialized } = useUserStore()
  const sessionQuery = useAuthBootstrap()

  if (!isAuthInitialized || sessionQuery.isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <p className="text-sm text-muted-foreground">Initialisation de la session…</p>
      </div>
    )
  }

  return <>{children}</>
}
