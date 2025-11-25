import { useEffect } from 'react'

import { sessionSchema, userSchema } from '@rapid-guide-io/contracts';
import { fetchMeHandler, sessionUserHandler } from './helpers';
import type { UserDto} from '@rapid-guide-io/contracts';
import { authClient } from '@/lib/auth-client'
import useUserStore from '@/store/useUser'
import { useSessionStore } from '@/store/useSession'
import { useJwtTokenStore } from '@/store/useJwtToken'
import { useGuideStore } from '@/store/useGuide'


export const useAuth = (): { isLoading: boolean } => {
  const { user, clearUser, setUser } = useUserStore((state) => state)
  const { session, clearSession, setSession, setLoading, isLoading } = useSessionStore((state) => state)
  const { clearGuide, setGuide } = useGuideStore((state) => state)
  const { setToken, clearToken } = useJwtTokenStore((state) => state)


  useEffect(() => {
    const fetchAuthInit = async () => {
      setLoading(true)
      try {
        const result = await authClient.getSession({
          fetchOptions: {
            onSuccess: async(ctx) => {
              const jwt = ctx.response.headers.get('set-auth-jwt') 
              if (jwt) {
                setToken(jwt)
                await fetchMeHandler(jwt, setGuide, clearGuide)   
              } else {
                clearToken()
              }
            },
            onError: (error) => {
              console.error('Failed to fetch session', error)
            },
          },
        })
        
        if (!result.data) {
          clearUser()
          clearToken()
          clearSession()
          clearGuide()
        }
        
       const user = userSchema.parse(result.data?.user)
       const session = sessionSchema.parse(result.data?.session)
       await sessionUserHandler(user, setUser, clearUser)

      setSession(session)

      } catch (error) {
        console.error('Failed to fetch session', error)
        clearUser()
        clearToken()
        clearSession()
        clearGuide()
      } finally {
        setLoading(false)
      }
    }

    fetchAuthInit()
  }, [])
  return { isLoading }
}


