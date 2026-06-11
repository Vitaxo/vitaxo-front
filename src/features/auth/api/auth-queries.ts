import { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchUserProfile, useUserStore } from '@/entities/user'
import { queryKeys } from '@/shared/api/query-keys'
import { setAccessToken } from '@/shared/lib/access-token'
import { getKeycloakClient } from './auth-client'

const getAppRedirectUri = () => `${window.location.origin}/`

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
  await getKeycloakClient().login({ redirectUri: getAppRedirectUri() })
}

export const registerWithKeycloak = async () => {
  await getKeycloakClient().register({ redirectUri: getAppRedirectUri() })
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
        pkceMethod: 'S256',
        redirectUri: getAppRedirectUri(),
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

      return fetchUserProfile()
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
