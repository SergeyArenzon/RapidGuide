import { getSessionFn } from '@/lib/auth.server';

/**
 * Query keys for auth-related queries
 */
export const authQueryKeys = {
  session: () => ['session'] as const,
} as const;

/**
 * Query options factories for auth-related queries
 */
export const authQueries = {
  /**
   * Get current session
   */
  session: () => ({
    queryKey: authQueryKeys.session(),
    queryFn: async () => {
      return getSessionFn();
    },
  }),
} as const;

