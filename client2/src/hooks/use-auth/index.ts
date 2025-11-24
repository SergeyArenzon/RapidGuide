import { useEffect } from 'react'

import { useNavigate } from '@tanstack/react-router'
import { sessionSchema, userSchema } from '@rapid-guide-io/contracts';
import { fetchMeHandler, sessionUserHandler } from './helpers';
import { authClient } from '@/lib/auth-client'
import useUserStore from '@/store/useUser'
import { useSessionStore } from '@/store/useSession'
import { useJwtTokenStore } from '@/store/useJwtToken'
import useGuideStore from '@/store/useGuide'


export const useAuth = () => {
  const { clearUser, setUser } = useUserStore((state) => state)
  const { clearSession, setSession, setLoading, isLoading } = useSessionStore((state) => state)
  const { clearGuide, setGuide } = useGuideStore((state) => state)
  const { setToken, clearToken } = useJwtTokenStore((state) => state)

  const navigate = useNavigate()

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
          navigate({ to: '/auth' })
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
        navigate({ to: '/auth' })
      } finally {
        setLoading(false)
      }
    }

    fetchAuthInit()
  }, [])
  return { isLoading }
}


