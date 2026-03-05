import { sessionSchema, userSchema } from '@rapid-guide-io/contracts'
import type { GuideDto, SessionDto, TravellerDto, UserDto } from '@rapid-guide-io/contracts'
import type { QueryClient } from '@tanstack/react-query'
import type { AuthContext } from '@/context/auth-context'
import { getSessionQuery } from './auth.server'
import { userQueries } from './query'

/**
 * Loads and validates session data, including user, session, guide, and traveller profiles
 * 
 * @param queryClient - TanStack Query client instance
 * @param existingSession - Optional existing session to skip loading if already present
 * @returns Auth context data with jwt, user, session, guide, and traveller
 */
export async function loadAuthContext(
  queryClient: QueryClient,
  existingSession?: SessionDto | null
): Promise<AuthContext> {
  // If session already exists, return early to keep existing context
  if (existingSession) {
    return {
      jwt: null,
      user: null,
      session: null,
      guide: null,
      traveller: null,
    }
  }

  // Fetch session data
  const result = await queryClient.ensureQueryData(getSessionQuery)

  // If no session data, return empty context
  if (!result?.data) {
    return {
      jwt: null,
      user: null,
      session: null,
      guide: null,
      traveller: null,
    }
  }

  try {
    // Parse and validate user and session
    const user = userSchema.parse(result.data.user)
    const session = sessionSchema.parse(result.data.session)

    // Fetch guide and traveller profiles if JWT is available
    let guide: GuideDto | null = null
    let traveller: TravellerDto | null = null

    if (result.jwt) {
      try {
        const meData = await queryClient.ensureQueryData(
          userQueries.me(result.jwt)
        )
        guide = (meData.guide as GuideDto) || null
        traveller = (meData.traveller as TravellerDto) || null
      } catch (error) {
        console.error('Failed to fetch guide/traveller data:', error)
        // Continue without guide/traveller data
      }
    }

    return {
      jwt: result.jwt,
      user,
      session,
      guide,
      traveller,
    }
  } catch (error) {
    console.error('Failed to parse session data:', error)
    // Return empty context on parse error
    return {
      jwt: null,
      user: null,
      session: null,
      guide: null,
      traveller: null,
    }
  }
}

