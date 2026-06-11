import { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchUserProfile, useUserStore } from '@/entities/user'
import type { User } from '@/entities/user'
import { queryKeys } from '@/shared/api/query-keys'
import { setAccessToken } from '@/shared/lib/access-token'
import { getKeycloakClient } from './auth-client'

const getDashboardRedirectUri = () => `${window.location.origin}/dashboard`
const getAppRedirectUri = () => `${window.location.origin}/`

const buildFallbackUser = (): User => {
  const keycloak = getKeycloakClient()
  const tokenClaims = keycloak.tokenParsed as
    | {
        email?: string
        family_name?: string
        given_name?: string
        name?: string
        sub?: string
      }
    | undefined

  const identifier = tokenClaims?.sub ?? 'keycloak-user'
  const email = tokenClaims?.email ?? identifier

  return {
    email,
    firstName: tokenClaims?.given_name ?? null,
    fullName: tokenClaims?.name ?? null,
    id: identifier,
    lastName: tokenClaims?.family_name ?? null,
  }
}

const syncAccessToken = async () => {
  const keycloak = getKeycloakClient()

  if (!keycloak.authenticated) {
    setAccessToken(null)
    return null
  }

  await keycloak.updateToken(30)
  setAccessToken(keycloak.token ?? null)

  return keycloak.token ?? null
}

export const loginWithKeycloak = async () => {
  await getKeycloakClient().login({ redirectUri: getDashboardRedirectUri() })
}

export const registerWithKeycloak = async () => {
  await getKeycloakClient().register({ redirectUri: getDashboardRedirectUri() })
}

export const logoutFromKeycloak = async () => {
  setAccessToken(null)
  await getKeycloakClient().logout({ redirectUri: getAppRedirectUri() })
}

export const useAuthBootstrap = () => {
  const queryClient = useQueryClient()
  const { clearAuth, initializeAuth } = useUserStore()

  const sessionQuery = useQuery({
    queryKey: queryKeys.auth.session(),
    queryFn: async () => {
      const keycloak = getKeycloakClient()

      const isAuthenticated = await keycloak.init({
        checkLoginIframe: false,
        onLoad: 'check-sso',
        pkceMethod: 'S256',
        redirectUri: getDashboardRedirectUri(),
      })

      if (!isAuthenticated) {
        setAccessToken(null)
        return null
      }

      await syncAccessToken()

      keycloak.onAuthLogout = () => {
        setAccessToken(null)
        clearAuth()
        queryClient.removeQueries({ queryKey: queryKeys.user.profile() })
      }

      keycloak.onTokenExpired = async () => {
        try {
          await syncAccessToken()
        } catch {
          setAccessToken(null)
          clearAuth()
        }
      }

      const fallbackUser = buildFallbackUser()

      try {
        const profile = await fetchUserProfile()
        queryClient.setQueryData(queryKeys.user.profile(), profile)
        return profile
      } catch {
        queryClient.setQueryData(queryKeys.user.profile(), fallbackUser)
        return fallbackUser
      }
    },
    retry: false,
  })

  useEffect(() => {
    if (sessionQuery.isSuccess) {
      initializeAuth({
        isAuthenticated: !!sessionQuery.data,
        user: sessionQuery.data ?? null,
      })
    }
  }, [initializeAuth, sessionQuery.data, sessionQuery.isSuccess])

  useEffect(() => {
    if (sessionQuery.isError) {
      setAccessToken(null)
      clearAuth()
    }
  }, [clearAuth, sessionQuery.isError])

  return sessionQuery
}
