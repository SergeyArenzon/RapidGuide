import type { SessionDto, UserDto, GuideDto } from '@rapid-guide-io/contracts'

export interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  user: UserDto | null
  session: SessionDto | null
  guide: GuideDto | null
}

export interface AuthContext {
  auth: AuthState
}

