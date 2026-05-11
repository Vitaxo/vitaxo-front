import { useMutation } from '@tanstack/react-query'
import { loginUser, registerUser, useUserStore } from '@/entities/user'
import type { LoginFormValues } from '../model/auth-schema'
import type { RegisterFormValues } from '../model/auth-schema'

export const useLogin = () => {
  const { setUser, setToken } = useUserStore()
  return useMutation({
    mutationFn: (values: LoginFormValues) => loginUser(values),
    onSuccess: (data) => {
      setToken(data.token)
      setUser(data.user)
    },
  })
}

export const useRegister = () => {
  const { setUser, setToken } = useUserStore()
  return useMutation({
    mutationFn: (values: Omit<RegisterFormValues, 'confirmPassword'>) => registerUser(values),
    onSuccess: (data) => {
      setToken(data.token)
      setUser(data.user)
    },
  })
}
