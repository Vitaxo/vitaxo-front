import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, LogOut, Save, UserRound } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import {
  fetchUserProfile,
  updateUserProfile,
  type UpdateUserProfilePayload,
  type User,
} from '@/entities/user'
import { logoutFromKeycloak } from '@/features/auth'
import { queryKeys } from '@/shared/api/query-keys'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'

const profileSchema = z.object({
  firstName: z.string().trim().min(1, 'Requis').max(120, 'Maximum 120 caracteres'),
  lastName: z.string().trim().min(1, 'Requis').max(120, 'Maximum 120 caracteres'),
  phone: z.string().max(20, 'Maximum 20 caracteres'),
  streetNumber: z.string().trim().min(1, 'Requis').max(20, 'Maximum 20 caracteres'),
  streetName: z.string().trim().min(1, 'Requis').max(255, 'Maximum 255 caracteres'),
  complement: z.string().max(255, 'Maximum 255 caracteres'),
  zipCode: z.string().trim().min(1, 'Requis').max(20, 'Maximum 20 caracteres'),
  city: z.string().trim().min(1, 'Requis').max(120, 'Maximum 120 caracteres'),
  country: z.string().trim().min(1, 'Requis').max(3, 'Maximum 3 caracteres'),
  iban: z.string().max(34, 'Maximum 34 caracteres'),
})

type ProfileFormValues = z.infer<typeof profileSchema>

const textValue = (value: unknown) => {
  if (value === null || value === undefined) return ''
  return String(value)
}

const displayValue = (value: unknown) => {
  const valueAsText = textValue(value)
  return valueAsText === '' ? '-' : valueAsText
}

const toFormValues = (profile: User): ProfileFormValues => ({
  firstName: textValue(profile.firstName),
  lastName: textValue(profile.lastName),
  phone: textValue(profile.phone),
  streetNumber: textValue(profile.streetNumber),
  streetName: textValue(profile.streetName),
  complement: textValue(profile.complement),
  zipCode: textValue(profile.zipCode),
  city: textValue(profile.city),
  country: textValue(profile.country),
  iban: '',
})

const errorMessage = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { message?: string } } }).response?.data?.message ?? fallback

const ProfileField = ({ label, value }: { label: string; value: unknown }) => (
  <div className="rounded-lg bg-muted/60 p-3">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="mt-1 break-words font-medium">{displayValue(value)}</p>
  </div>
)

export const ProfilePage = () => {
  const queryClient = useQueryClient()
  const { data: profile, error, isError, isLoading } = useQuery({
    queryKey: queryKeys.user.profile(),
    queryFn: fetchUserProfile,
  })

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      streetNumber: '',
      streetName: '',
      complement: '',
      zipCode: '',
      city: '',
      country: '',
      iban: '',
    },
  })

  const updateProfile = useMutation({
    mutationFn: (payload: UpdateUserProfilePayload) => updateUserProfile(payload),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(queryKeys.user.profile(), updatedProfile)
      form.reset(toFormValues(updatedProfile))
    },
  })

  useEffect(() => {
    if (profile) {
      form.reset(toFormValues(profile))
    }
  }, [form, profile])

  const onSubmit = (values: ProfileFormValues) => {
    const payload: UpdateUserProfilePayload = {
      firstName: values.firstName,
      lastName: values.lastName,
      phone: values.phone,
      streetNumber: values.streetNumber,
      streetName: values.streetName,
      complement: values.complement,
      zipCode: values.zipCode,
      city: values.city,
      country: values.country,
    }

    const iban = values.iban.trim()
    if (iban) {
      payload.iban = iban
    }

    updateProfile.mutate(payload)
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <UserRound className="size-5" />
            </div>
            <div>
              <p className="font-heading text-lg font-semibold">Mon profil</p>
              <p className="text-xs text-muted-foreground">Informations adherent</p>
            </div>
          </div>
          <Button onClick={() => void logoutFromKeycloak()} variant="outline">
            <LogOut />
            <span className="hidden sm:inline">Se deconnecter</span>
          </Button>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
        <Link
          className="inline-flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          to="/dashboard"
        >
          <ArrowLeft className="size-4" />
          Retour au dashboard
        </Link>

        {isLoading && (
          <Card>
            <CardHeader>
              <CardTitle>Chargement du profil</CardTitle>
              <CardDescription>Recuperation de vos informations.</CardDescription>
            </CardHeader>
          </Card>
        )}

        {isError && (
          <Card>
            <CardHeader>
              <CardTitle>Profil indisponible</CardTitle>
              <CardDescription>
                {errorMessage(error, 'Impossible de charger votre profil.')}
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {profile && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Identite</CardTitle>
                    <CardDescription>
                      Email, naissance et statut ne sont pas modifiables ici
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 sm:grid-cols-2">
                    <ProfileField label="Email" value={profile.email} />
                    <ProfileField label="Statut" value={profile.status} />
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prenom</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telephone</FormLabel>
                          <FormControl>
                            <Input placeholder="+33612345678" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <ProfileField label="Date de naissance" value={profile.birthday} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Adresse et donnees sensibles</CardTitle>
                    <CardDescription>
                      Le SSN reste masque. Renseignez un nouvel IBAN seulement pour le modifier
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="streetNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Numero</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="streetName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rue</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="complement"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                          <FormLabel>Complement</FormLabel>
                          <FormControl>
                            <Input placeholder="Laisser vide pour supprimer" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Code postal</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ville</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pays</FormLabel>
                          <FormControl>
                            <Input placeholder="FRA" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <ProfileField label="SSN" value={profile.maskedSsn} />
                    <ProfileField label="IBAN actuel" value={profile.maskedIban} />
                    <FormField
                      control={form.control}
                      name="iban"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nouvel IBAN</FormLabel>
                          <FormControl>
                            <Input placeholder="FR7630006000011234567890189" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                {updateProfile.isSuccess && (
                  <p className="text-sm text-muted-foreground">Profil mis a jour.</p>
                )}
                {updateProfile.isError && (
                  <p className="text-sm text-destructive">
                    {errorMessage(updateProfile.error, 'Impossible de mettre a jour le profil.')}
                  </p>
                )}
                <Button disabled={updateProfile.isPending} type="submit">
                  <Save />
                  {updateProfile.isPending ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </main>
    </div>
  )
}
