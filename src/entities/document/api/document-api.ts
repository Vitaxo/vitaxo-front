import { api } from '@/shared/api/axios-instance'

/**
 * Fetches the authenticated member's third party payment (health insurance) card
 * as a PDF blob. The access token is attached by the axios request interceptor,
 * so this must go through `api` rather than a raw browser navigation.
 */
export const fetchHealthInsuranceCard = () =>
  api
    .get<Blob>('/cards/health-insurance/me', { responseType: 'blob' })
    .then((response) => response.data)
