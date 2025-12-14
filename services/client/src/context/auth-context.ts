import type { GuideDto, SessionDto, TravellerDto, UserDto } from '@rapid-guide-io/contracts'
import { useSessionStore } from '@/store/useSession'
import useUserStore from '@/store/useUser'
import { useGuideStore } from '@/store/useGuide'
import { useTravellerStore } from '@/store/useTraveller'

export interface AuthContext {
  isAuthenticated: boolean
  isLoading: boolean
  user: UserDto | null
  session: SessionDto | null
  guide: GuideDto | null
  traveller: TravellerDto | null
}

/**
 * Helper to get current auth context from Zustand stores
 * This is used by the router context to provide auth context to routes
 */
export const getAuthContext = (): AuthContext => {
  const { session, isLoading } = useSessionStore.getState()
  const { user } = useUserStore.getState()
  const { guide } = useGuideStore.getState()
  const { traveller } = useTravellerStore.getState()

  return {
    isAuthenticated: !!session,
    isLoading,
    user,
    session,
    guide,
    traveller,
  }
}

