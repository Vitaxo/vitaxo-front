import { useState } from 'react'
import {
  ArrowLeft,
  CreditCard,
  Download,
  Eye,
  FileText,
  HeartPulse,
  LogOut,
  ReceiptText,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { fetchHealthInsuranceCard } from '@/entities/document'
import { logoutFromKeycloak } from '@/features/auth'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'

type CardAction = 'view' | 'download'

const comingSoonDocuments = [
  {
    description: 'Vos attestations de couverture santé.',
    icon: FileText,
    label: 'Attestations',
  },
  {
    description: 'L’historique de vos factures et remboursements.',
    icon: ReceiptText,
    label: 'Factures',
  },
]

export const DocumentsPage = () => {
  const [pendingAction, setPendingAction] = useState<CardAction | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCard = async (mode: CardAction) => {
    setError(null)
    setPendingAction(mode)

    try {
      const blob = await fetchHealthInsuranceCard()
      const url = window.URL.createObjectURL(blob)

      if (mode === 'view') {
        window.open(url, '_blank', 'noopener,noreferrer')
      } else {
        const link = document.createElement('a')
        link.href = url
        link.download = 'carte-tiers-payant.pdf'
        document.body.appendChild(link)
        link.click()
        link.remove()
      }

      // Keep the object URL alive long enough for the opened tab to load it.
      window.setTimeout(() => window.URL.revokeObjectURL(url), 10_000)
    } catch {
      setError(
        'Impossible de générer la carte pour le moment. Votre profil doit être actif (onboarding complété).',
      )
    } finally {
      setPendingAction(null)
    }
  }

  const isBusy = pendingAction !== null

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
              <p className="text-xs text-muted-foreground">Espace adhérent</p>
            </div>
          </div>
          <Button onClick={() => void logoutFromKeycloak()} variant="outline">
            <LogOut />
            <span className="hidden sm:inline">Se déconnecter</span>
          </Button>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
        <section>
          <Link
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
            to="/dashboard"
          >
            <ArrowLeft className="size-4" />
            Retour au tableau de bord
          </Link>
          <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight">Mes documents</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Retrouvez et téléchargez vos documents santé.
          </p>
        </section>

        {error ? (
          <div
            className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            role="alert"
          >
            {error}
          </div>
        ) : null}

        <section className="grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <CreditCard className="size-5" />
                </div>
                <div>
                  <CardTitle>Carte de tiers payant</CardTitle>
                  <CardDescription>
                    Présentez-la à votre professionnel de santé pour éviter l’avance de frais.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button disabled={isBusy} onClick={() => void handleCard('view')}>
                <Eye />
                {pendingAction === 'view' ? 'Ouverture…' : 'Voir la carte'}
              </Button>
              <Button
                disabled={isBusy}
                onClick={() => void handleCard('download')}
                variant="outline"
              >
                <Download />
                {pendingAction === 'download' ? 'Téléchargement…' : 'Télécharger le PDF'}
              </Button>
            </CardContent>
          </Card>

          {comingSoonDocuments.map(({ description, icon: Icon, label }) => (
            <Card key={label}>
              <CardContent className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Icon className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{description}</p>
                  <span className="mt-3 inline-flex text-xs font-medium text-muted-foreground">
                    Bientôt disponible
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </main>
    </div>
  )
}
