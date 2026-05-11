export type ApiError = {
  message: string
  statusCode: number
}

export type Pagination = {
  page: number
  limit: number
  total: number
}
