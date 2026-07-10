export type User = {
  id: string
  email: string
  firstName?: string | null
  lastName?: string | null
  fullName?: string | null
  createdAt?: string
  [key: string]: unknown
}

export type UpdateUserProfilePayload = {
  firstName?: string
  lastName?: string
  phone?: string
  streetNumber?: string
  streetName?: string
  complement?: string
  zipCode?: string
  city?: string
  country?: string
  iban?: string
}

export type RefundDetail = {
  id: number
  typeSoinId: number
  typeSoinName: string
  totalAmount: number
  refundAmount: number
}

export type Refund = {
  refundId: number
  contractId: number
  amountRequested: number
  status: string
  createdAt: string
  details: RefundDetail[]
}

export type CreateRefundPayload = {
  amountRequested: number
  details: Array<{
    typeSoinId: number
    totalAmount: number
  }>
}

export type ContractGuarantee = {
  typeSoin: string
  refundRate: number
  maxAmount: number
}

export type MyContract = {
  contractId: number
  planId: number
  planName: string
  planDescription: string
  price: number
  contractStatus: string
  startDate: string
  endDate: string | null
  createdAt: string
  garanties: ContractGuarantee[]
}
