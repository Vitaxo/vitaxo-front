const readEnv = (value: string | undefined, fallback: string) => value?.trim() || fallback

export const env = {
  VITE_API_URL: readEnv(import.meta.env.VITE_API_URL as string | undefined, 'http://localhost:8080'),
  VITE_KEYCLOAK_URL: readEnv(
    import.meta.env.VITE_KEYCLOAK_URL as string | undefined,
    'http://localhost:8081',
  ).replace(/\/+$/, ''),
  VITE_KEYCLOAK_REALM: readEnv(
    import.meta.env.VITE_KEYCLOAK_REALM as string | undefined,
    'mutuelle',
  ),
  VITE_KEYCLOAK_CLIENT_ID: readEnv(
    import.meta.env.VITE_KEYCLOAK_CLIENT_ID as string | undefined,
    'mutuelle-front',
  ),
} as const
