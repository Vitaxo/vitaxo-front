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
