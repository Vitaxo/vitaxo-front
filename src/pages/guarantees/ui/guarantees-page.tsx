import { ArrowLeft, ShieldCheck, Stethoscope } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { fetchMyContract } from '@/entities/user'
import { queryKeys } from '@/shared/api/query-keys'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('fr-FR', { currency: 'EUR', style: 'currency' }).format(value)

const formatDate = (value: string | null) => {
  if (!value) return '-'
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(new Date(value))
}

const errorMessage = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { message?: string } } }).response?.data?.message ?? fallback

export const GuaranteesPage = () => {
  const contractQuery = useQuery({
    queryKey: queryKeys.contracts.me(),
    queryFn: fetchMyContract,
  })

  const contract = contractQuery.data

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4 sm:px-6">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <p className="font-heading text-lg font-semibold">Mes garanties</p>
            <p className="text-xs text-muted-foreground">Contrat actif et couverture sante</p>
          </div>
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

        {contractQuery.isLoading && (
          <Card>
            <CardHeader>
              <CardTitle>Chargement des garanties</CardTitle>
              <CardDescription>Recuperation de votre contrat actif.</CardDescription>
            </CardHeader>
          </Card>
        )}

        {contractQuery.isError && (
          <Card>
            <CardHeader>
              <CardTitle>Garanties indisponibles</CardTitle>
              <CardDescription>
                {errorMessage(contractQuery.error, 'Impossible de charger vos garanties.')}
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {contract && (
          <>
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <CardTitle>{contract.planName}</CardTitle>
                    <CardDescription>{contract.planDescription}</CardDescription>
                  </div>
                  <span className="inline-flex w-fit items-center rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    {contract.contractStatus}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-4">
                <Info label="Prix mensuel" value={formatCurrency(contract.price)} />
                <Info label="Debut" value={formatDate(contract.startDate)} />
                <Info label="Fin" value={formatDate(contract.endDate)} />
                <Info label="Contrat" value={`#${contract.contractId}`} />
              </CardContent>
            </Card>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {contract.garanties.map((garantie) => (
                <Card key={garantie.typeSoin}>
                  <CardHeader>
                    <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Stethoscope className="size-5" />
                    </div>
                    <CardTitle>{garantie.typeSoin}</CardTitle>
                    <CardDescription>Type de soin couvert</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3">
                    <Info label="Taux BRSS" value={`${garantie.refundRate}%`} />
                    <Info label="Plafond" value={formatCurrency(garantie.maxAmount)} />
                  </CardContent>
                </Card>
              ))}
            </section>
          </>
        )}
      </main>
    </div>
  )
}

const Info = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg bg-muted/60 p-3">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="mt-1 break-words font-medium">{value}</p>
  </div>
)
