import { ArrowLeft, Plus, ReceiptText, Send, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { createRefund, fetchMyRefunds, type CreateRefundPayload, type Refund } from '@/entities/user'
import { queryKeys } from '@/shared/api/query-keys'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

type RefundLineForm = {
  id: string
  typeSoinId: string
  totalAmount: string
}

const careTypes = [
  { id: '1', label: 'Consultation' },
  { id: '2', label: 'Dentaire' },
  { id: '3', label: 'Optique' },
]

const newLine = (): RefundLineForm => ({
  id: crypto.randomUUID(),
  typeSoinId: '1',
  totalAmount: '',
})

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('fr-FR', { currency: 'EUR', style: 'currency' }).format(value)

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))

const parseAmount = (value: string) => Number(value.replace(',', '.')) || 0

const errorMessage = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { message?: string } } }).response?.data?.message ?? fallback

export const RefundsPage = () => {
  const queryClient = useQueryClient()
  const [lines, setLines] = useState<RefundLineForm[]>([newLine()])

  const refundsQuery = useQuery({
    queryKey: queryKeys.refunds.me(),
    queryFn: fetchMyRefunds,
  })

  const totalAmount = useMemo(
    () => lines.reduce((sum, line) => sum + parseAmount(line.totalAmount), 0),
    [lines],
  )

  const createRefundMutation = useMutation({
    mutationFn: (payload: CreateRefundPayload) => createRefund(payload),
    onSuccess: () => {
      setLines([newLine()])
      void queryClient.invalidateQueries({ queryKey: queryKeys.refunds.me() })
    },
  })

  const updateLine = (id: string, patch: Partial<RefundLineForm>) => {
    setLines((current) => current.map((line) => (line.id === id ? { ...line, ...patch } : line)))
  }

  const removeLine = (id: string) => {
    setLines((current) => (current.length === 1 ? current : current.filter((line) => line.id !== id)))
  }

  const addLine = () => {
    setLines((current) => [...current, newLine()])
  }

  const submitRefund = () => {
    const details = lines.map((line) => ({
      typeSoinId: Number(line.typeSoinId),
      totalAmount: Number(parseAmount(line.totalAmount).toFixed(2)),
    }))

    if (details.some((detail) => detail.totalAmount <= 0)) return

    createRefundMutation.mutate({
      amountRequested: Number(totalAmount.toFixed(2)),
      details,
    })
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4 sm:px-6">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <ReceiptText className="size-5" />
          </div>
          <div>
            <p className="font-heading text-lg font-semibold">Remboursements</p>
            <p className="text-xs text-muted-foreground">Creation et suivi des demandes</p>
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

        <section className="grid gap-4 lg:grid-cols-[0.95fr_1.35fr]">
          <Card>
            <CardHeader>
              <CardTitle>Nouvelle demande</CardTitle>
              <CardDescription>Ajoutez une ou plusieurs lignes de soin</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {lines.map((line, index) => (
                <div className="grid gap-3 rounded-lg border p-3 sm:grid-cols-[1fr_1fr_auto]" key={line.id}>
                  <div className="space-y-2">
                    <Label htmlFor={`care-${line.id}`}>Type de soin</Label>
                    <select
                      className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                      id={`care-${line.id}`}
                      onChange={(event) => updateLine(line.id, { typeSoinId: event.target.value })}
                      value={line.typeSoinId}
                    >
                      {careTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`amount-${line.id}`}>Montant</Label>
                    <Input
                      id={`amount-${line.id}`}
                      min="0"
                      onChange={(event) => updateLine(line.id, { totalAmount: event.target.value })}
                      placeholder="42.50"
                      step="0.01"
                      type="number"
                      value={line.totalAmount}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      aria-label={`Supprimer la ligne ${index + 1}`}
                      disabled={lines.length === 1}
                      onClick={() => removeLine(line.id)}
                      size="icon"
                      type="button"
                      variant="outline"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              ))}

              <Button onClick={addLine} type="button" variant="outline">
                <Plus />
                Ajouter une ligne
              </Button>

              <div className="flex items-center justify-between rounded-lg bg-muted/60 p-3">
                <span className="text-sm text-muted-foreground">Total demande</span>
                <span className="font-heading text-lg font-semibold">{formatCurrency(totalAmount)}</span>
              </div>

              {createRefundMutation.isError && (
                <p className="text-sm text-destructive">
                  {errorMessage(createRefundMutation.error, 'Impossible de creer la demande.')}
                </p>
              )}
              {createRefundMutation.isSuccess && (
                <p className="text-sm text-muted-foreground">Demande de remboursement creee.</p>
              )}

              <Button
                disabled={createRefundMutation.isPending || totalAmount <= 0}
                onClick={submitRefund}
                type="button"
              >
                <Send />
                {createRefundMutation.isPending ? 'Envoi...' : 'Creer la demande'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mes demandes</CardTitle>
              <CardDescription>Demandes triees de la plus recente a la plus ancienne</CardDescription>
            </CardHeader>
            <CardContent>
              {refundsQuery.isLoading && <p className="text-sm text-muted-foreground">Chargement...</p>}
              {refundsQuery.isError && (
                <p className="text-sm text-destructive">
                  {errorMessage(refundsQuery.error, 'Impossible de charger les remboursements.')}
                </p>
              )}
              {refundsQuery.data?.length === 0 && (
                <p className="text-sm text-muted-foreground">Aucune demande pour le moment.</p>
              )}
              <div className="flex flex-col gap-3">
                {refundsQuery.data?.map((refund) => (
                  <RefundCard key={refund.refundId} refund={refund} />
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}

const RefundCard = ({ refund }: { refund: Refund }) => (
  <div className="rounded-lg border p-3">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p className="font-medium">Demande #{refund.refundId}</p>
        <p className="text-xs text-muted-foreground">{formatDate(refund.createdAt)}</p>
      </div>
      <div className="text-right">
        <p className="font-heading text-lg font-semibold">{formatCurrency(refund.amountRequested)}</p>
        <p className="text-xs text-muted-foreground">{refund.status}</p>
      </div>
    </div>
    <div className="mt-3 flex flex-col gap-2">
      {refund.details.map((detail) => (
        <div
          className="grid gap-2 rounded-md bg-muted/60 p-2 text-sm sm:grid-cols-[1fr_auto_auto]"
          key={detail.id}
        >
          <span>{detail.typeSoinName}</span>
          <span className="text-muted-foreground">{formatCurrency(detail.totalAmount)}</span>
          <span className="font-medium">Rembourse {formatCurrency(detail.refundAmount)}</span>
        </div>
      ))}
    </div>
  </div>
)
