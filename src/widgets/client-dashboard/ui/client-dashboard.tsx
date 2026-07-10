import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  HeartPulse,
  LogOut,
  ReceiptText,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { fetchMyRefunds, useUserStore } from '@/entities/user'
import { logoutFromKeycloak } from '@/features/auth'
import { queryKeys } from '@/shared/api/query-keys'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'

const getDisplayName = (
  email: string,
  fullName?: string | null,
  firstName?: string | null,
  lastName?: string | null,
) => fullName ?? ([firstName, lastName].filter(Boolean).join(' ') || email)

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('fr-FR', { currency: 'EUR', style: 'currency' }).format(value)

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(new Date(value))

const quickActions = [
  {
    description: 'Transmettre une facture ou un justificatif.',
    icon: ReceiptText,
    label: 'Demander un remboursement',
    to: '/refunds',
  },
  {
    description: 'Retrouver vos attestations et documents.',
    icon: FileText,
    label: 'Mes documents',
    to: '/documents',
  },
  {
    description: 'Consulter vos informations personnelles.',
    icon: ShieldCheck,
    label: 'Mon profil',
    to: '/profile',
  },
  {
    description: 'Consulter vos garanties sante.',
    icon: Stethoscope,
    label: 'Voir mes garanties',
    to: '/guarantees',
  },
]

export const ClientDashboard = () => {
  const { user } = useUserStore()
  const refundsQuery = useQuery({
    queryKey: queryKeys.refunds.me(),
    queryFn: fetchMyRefunds,
  })

  const displayName = user
    ? getDisplayName(user.email, user.fullName, user.firstName, user.lastName)
    : 'adherent'

  const refunds = refundsQuery.data ?? []
  const recentRefunds = refunds.slice(0, 3)
  const totalRefunded = refunds.reduce(
    (sum, refund) =>
      sum + refund.details.reduce((detailSum, detail) => detailSum + detail.refundAmount, 0),
    0,
  )

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <HeartPulse className="size-5" />
            </div>
            <div>
              <p className="font-heading text-lg font-semibold">Vitaxo</p>
              <p className="text-xs text-muted-foreground">Espace adherent</p>
            </div>
          </div>
          <Button onClick={() => void logoutFromKeycloak()} variant="outline">
            <LogOut />
            <span className="hidden sm:inline">Se deconnecter</span>
          </Button>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
        <section>
          <p className="text-sm font-medium text-muted-foreground">Votre espace sante</p>
          <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight">
            Bonjour, {displayName}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Retrouvez un apercu de votre couverture et de vos derniers remboursements.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle>Contrat Sante Essentiel</CardTitle>
                  <CardDescription>Couverture individuelle</CardDescription>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  <CheckCircle2 className="size-3.5" />
                  Actif
                </span>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-muted/60 p-3">
                <p className="text-xs text-muted-foreground">Debut du contrat</p>
                <p className="mt-1 font-medium">1 janvier 2026</p>
              </div>
              <div className="rounded-lg bg-muted/60 p-3">
                <p className="text-xs text-muted-foreground">Beneficiaires</p>
                <p className="mt-1 font-medium">1 personne</p>
              </div>
              <div className="rounded-lg bg-muted/60 p-3">
                <p className="text-xs text-muted-foreground">Teletransmission</p>
                <p className="mt-1 font-medium">Activee</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Remboursements 2026</CardTitle>
              <CardDescription>Montant total verse</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-heading text-3xl font-semibold">{formatCurrency(totalRefunded)}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {refunds.length} demande{refunds.length > 1 ? 's' : ''} cette annee
              </p>
            </CardContent>
          </Card>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-heading text-xl font-semibold">Actions rapides</h2>
              <p className="text-sm text-muted-foreground">
                Accedez aux principales actions de votre espace adherent.
              </p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {quickActions.map(({ description, icon: Icon, label, to }) => {
              const card = (
                <Card
                  className={cn(
                    'h-full transition-colors hover:bg-muted/30',
                    to && 'cursor-pointer',
                  )}
                >
                  <CardContent className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{label}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
                      <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                        {to ? 'Acceder' : 'Bientot disponible'}
                        <ArrowRight className="size-3" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )

              return to ? (
                <Link className="block" key={label} to={to}>
                  {card}
                </Link>
              ) : (
                <div key={label}>{card}</div>
              )
            })}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Activite recente</CardTitle>
              <CardDescription>Vos derniers remboursements</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              {refundsQuery.isLoading && (
                <p className="py-3 text-sm text-muted-foreground">Chargement...</p>
              )}
              {refundsQuery.isError && (
                <p className="py-3 text-sm text-destructive">
                  Impossible de charger les remboursements.
                </p>
              )}
              {!refundsQuery.isLoading && !refundsQuery.isError && recentRefunds.length === 0 && (
                <p className="py-3 text-sm text-muted-foreground">Aucune demande pour le moment.</p>
              )}
              {recentRefunds.map((refund) => {
                const refundAmount = refund.details.reduce(
                  (sum, detail) => sum + detail.refundAmount,
                  0,
                )
                const firstDetail = refund.details[0]
                const label =
                  refund.details.length > 1
                    ? `${refund.details.length} lignes de soin`
                    : (firstDetail?.typeSoinName ?? `Demande #${refund.refundId}`)

                return (
                  <div
                    key={refund.refundId}
                    className="flex items-center justify-between gap-4 border-b py-3 last:border-b-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{label}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {formatDate(refund.createdAt)}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-medium">{formatCurrency(refundAmount)}</p>
                      <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
                        {refund.status === 'APPROVED' ? (
                          <CheckCircle2 className="size-3 text-emerald-600" />
                        ) : (
                          <Clock3 className="size-3 text-amber-600" />
                        )}
                        {refund.status}
                      </p>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground">
            <CardHeader>
              <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary-foreground/10">
                <ShieldCheck className="size-5" />
              </div>
              <CardTitle>Votre couverture est active</CardTitle>
              <CardDescription className="text-primary-foreground/70">
                Votre contrat et la teletransmission sont operationnels.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-primary-foreground/70">
                Les dernieres demandes de remboursement sont maintenant synchronisees avec le backend.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
