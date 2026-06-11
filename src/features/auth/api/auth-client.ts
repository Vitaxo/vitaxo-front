import Keycloak from 'keycloak-js'
import { env } from '@/shared/config/env'

let keycloakClient: Keycloak | null = null

export const getKeycloakClient = () => {
  if (!keycloakClient) {
    keycloakClient = new Keycloak({
      clientId: env.VITE_KEYCLOAK_CLIENT_ID,
      realm: env.VITE_KEYCLOAK_REALM,
      url: env.VITE_KEYCLOAK_URL,
    })
  }

  return keycloakClient
}
