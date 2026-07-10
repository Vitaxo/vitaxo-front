export const queryKeys = {
  auth: {
    session: () => ['auth', 'session'] as const,
  },
  user: {
    profile: () => ['user', 'profile'] as const,
  },
  refunds: {
    me: () => ['refunds', 'me'] as const,
  },
  contracts: {
    me: () => ['contracts', 'me'] as const,
  },
} as const
