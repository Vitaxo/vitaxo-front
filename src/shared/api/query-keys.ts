export const queryKeys = {
  auth: {
    session: () => ['auth', 'session'] as const,
  },
  user: {
    me: () => ['user', 'me'] as const,
  },
} as const
