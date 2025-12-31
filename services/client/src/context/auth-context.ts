import type { GuideDto, SessionDto, TravellerDto, UserDto } from '@rapid-guide-io/contracts'

export interface AuthContext {
  jwt: string | null
  user: UserDto | null
  session: SessionDto | null
  guide: GuideDto | null
  traveller: TravellerDto | null
}

