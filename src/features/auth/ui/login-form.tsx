import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'
import { useLogin } from '../api/auth-queries'
import { loginSchema, type LoginFormValues } from '../model/auth-schema'

export const LoginForm = () => {
  const navigate = useNavigate()
  const { mutate: login, isPending, error } = useLogin()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = (values: LoginFormValues) => {
    login(values, {
      onSuccess: () => navigate('/dashboard'),
    })
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Connexion</CardTitle>
        <CardDescription>Connectez-vous à votre compte Vitaxo</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="vous@exemple.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && (
              <p className="text-destructive text-sm">
                {(error as { response?: { data?: { message?: string } } }).response?.data?.message ??
                  'Identifiants incorrects'}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Connexion…' : 'Se connecter'}
            </Button>
          </form>
        </Form>
        <p className="text-center text-sm text-muted-foreground">
          Pas encore de compte ?{' '}
          <Link
            to="/register"
            className="text-foreground underline underline-offset-4 hover:text-primary"
          >
            S'inscrire
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
