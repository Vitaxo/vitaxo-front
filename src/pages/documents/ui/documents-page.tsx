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
import { fetchHealthInsuranceCard, fetchInsuranceCertificate } from '@/entities/document'
import { logoutFromKeycloak } from '@/features/auth'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'

type CardAction = 'view' | 'download'

type DownloadableDocument = {
  description: string
  fetch: () => Promise<Blob>
  fileName: string
  icon: typeof CreditCard
  id: string
  title: string
}

const downloadableDocuments: DownloadableDocument[] = [
  {
    description: 'Présentez-la à votre professionnel de santé pour éviter l’avance de frais.',
    fetch: fetchHealthInsuranceCard,
    fileName: 'carte-tiers-payant.pdf',
    icon: CreditCard,
    id: 'health-insurance-card',
    title: 'Carte de tiers payant',
  },
  {
    description: 'Justificatif de votre couverture santé à transmettre aux organismes qui la demandent.',
    fetch: fetchInsuranceCertificate,
    fileName: 'attestation-mutuelle.pdf',
    icon: FileText,
    id: 'insurance-certificate',
    title: 'Attestation de mutuelle',
  },
]

const comingSoonDocuments = [
  {
    description: 'L’historique de vos factures et remboursements.',
    icon: ReceiptText,
    label: 'Factures',
  },
]

export const DocumentsPage = () => {
  const [pendingKey, setPendingKey] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleDocument = async (doc: DownloadableDocument, mode: CardAction) => {
    setError(null)
    setPendingKey(`${doc.id}:${mode}`)

    try {
      const blob = await doc.fetch()
      const url = window.URL.createObjectURL(blob)

      if (mode === 'view') {
        window.open(url, '_blank', 'noopener,noreferrer')
      } else {
        const link = document.createElement('a')
        link.href = url
        link.download = doc.fileName
        document.body.appendChild(link)
        link.click()
        link.remove()
      }

      window.setTimeout(() => window.URL.revokeObjectURL(url), 10_000)
    } catch {
      setError(
        'Impossible de générer ce document pour le moment. Votre profil doit être actif (onboarding complété).',
      )
    } finally {
      setPendingKey(null)
    }
  }

  const isBusy = pendingKey !== null

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

        <section className="grid gap-4 md:grid-cols-2">
          {downloadableDocuments.map((doc) => {
            const Icon = doc.icon

            return (
              <Card key={doc.id}>
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <CardTitle>{doc.title}</CardTitle>
                      <CardDescription>{doc.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                  <Button disabled={isBusy} onClick={() => void handleDocument(doc, 'view')}>
                    <Eye />
                    {pendingKey === `${doc.id}:view` ? 'Ouverture…' : 'Voir'}
                  </Button>
                  <Button
                    disabled={isBusy}
                    onClick={() => void handleDocument(doc, 'download')}
                    variant="outline"
                  >
                    <Download />
                    {pendingKey === `${doc.id}:download` ? 'Téléchargement…' : 'Télécharger le PDF'}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </section>

        <section className="grid gap-4 md:grid-cols-3">
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
