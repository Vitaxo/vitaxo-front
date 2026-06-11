import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { registerWithKeycloak } from '../api/auth-queries'

export const RegisterForm = () => {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRegister = async () => {
    try {
      setError(null)
      setIsPending(true)
      await registerWithKeycloak()
    } catch {
      setIsPending(false)
      setError("Impossible de démarrer l'inscription Keycloak")
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Créer un compte</CardTitle>
        <CardDescription>Inscription standard via Keycloak</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          Votre compte sera créé et sécurisé par le service d'identité Mutuelle.
        </p>
        {error && <p className="text-destructive text-sm">{error}</p>}
        <Button className="w-full" disabled={isPending} onClick={handleRegister}>
          {isPending ? 'Redirection…' : 'Créer un compte avec Keycloak'}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Déjà un compte ?{' '}
          <Link
            to="/"
            className="text-foreground underline underline-offset-4 hover:text-primary"
          >
            Se connecter
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
