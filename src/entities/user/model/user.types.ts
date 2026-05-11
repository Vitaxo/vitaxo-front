export type User = {
  id: string
  email: string
  name: string
  createdAt: string
}

export type AuthResponse = {
  user: User
  token: string
}
