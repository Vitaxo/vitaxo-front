import { api } from '@/shared/api/axios-instance'

export const fetchHealthInsuranceCard = () =>
  api
    .get<Blob>('/cards/health-insurance/me', { responseType: 'blob' })
    .then((response) => response.data)

export const fetchInsuranceCertificate = () =>
  api
    .get<Blob>('/attestations/insurance/me', { responseType: 'blob' })
    .then((response) => response.data)
