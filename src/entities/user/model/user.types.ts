export type User = {
  id: string
  email: string
  firstName?: string | null
  lastName?: string | null
  fullName?: string | null
  createdAt?: string
  [key: string]: unknown
}
