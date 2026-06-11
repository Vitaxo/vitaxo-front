export const queryKeys = {
  auth: {
    session: () => ['auth', 'session'] as const,
  },
  user: {
    profile: () => ['user', 'profile'] as const,
  },
} as const
