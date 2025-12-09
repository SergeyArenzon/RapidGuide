import type { GuideDto, SessionDto, UserDto } from '@rapid-guide-io/contracts'
import { useSessionStore } from '@/store/useSession'
import useUserStore from '@/store/useUser'
import { useGuideStore } from '@/store/useGuide'

export interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  user: UserDto | null
  session: SessionDto | null
  guide: GuideDto | null
}

/**
 * Helper to get current auth state from Zustand stores
 * This is used by the router context to provide auth state to routes
 */
export const getAuthState = (): AuthState => {
  const { session, isLoading } = useSessionStore.getState()
  const { user } = useUserStore.getState()
  const { guide } = useGuideStore.getState()

  return {
    isAuthenticated: !!session,
    isLoading,
    user,
    session,
    guide,
  }
}

