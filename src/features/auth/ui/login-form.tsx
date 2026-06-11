import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { loginWithKeycloak } from '../api/auth-queries'

export const LoginForm = () => {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async () => {
    try {
      setError(null)
      setIsPending(true)
      await loginWithKeycloak()
    } catch {
      setIsPending(false)
      setError("Impossible de démarrer l'authentification Keycloak")
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Connexion</CardTitle>
        <CardDescription>Authentification standard via Keycloak</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          Email, mot de passe et MFA éventuel sont gérés côté IAM.
        </p>
        {error && <p className="text-destructive text-sm">{error}</p>}
        <Button className="w-full" disabled={isPending} onClick={handleLogin}>
          {isPending ? 'Redirection…' : 'Se connecter avec Keycloak'}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Pas encore de compte ?{' '}
          <Link
            to="/register"
            className="text-foreground underline underline-offset-4 hover:text-primary"
          >
            S&apos;inscrire
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
