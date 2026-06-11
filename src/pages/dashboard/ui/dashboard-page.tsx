import { useUserStore } from '@/entities/user'
import { logoutFromKeycloak } from '@/features/auth'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'

const getDisplayName = (
  email: string,
  fullName?: string | null,
  firstName?: string | null,
  lastName?: string | null,
) => fullName ?? ([firstName, lastName].filter(Boolean).join(' ') || email)

export const DashboardPage = () => {
  const { user } = useUserStore()

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 pt-10">
        <Card>
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
            <CardDescription>Session Keycloak active.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm">
              Utilisateur connecté:{' '}
              <span className="font-medium">
                {user ? getDisplayName(user.email, user.fullName, user.firstName, user.lastName) : 'inconnu'}
              </span>
            </p>
            <div>
              <Button onClick={() => void logoutFromKeycloak()} variant="outline">
                Se déconnecter
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
