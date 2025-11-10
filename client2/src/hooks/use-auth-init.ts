import { useEffect, useState } from 'react'

import { authClient } from '@/lib/auth-client'
import useUserStore from '@/store/useUser'
import { userSchema } from '@/schema/user.schema'
import useJwtToken from '@/store/useJwtToken'
import { useSessionStore } from '@/store/useSession'
import { useNavigate } from '@tanstack/react-router'

export const useAuthInit = (): { isLoading: boolean } => {
  const { setUser, clearUser } = useUserStore((state) => state)
  const { setToken, clearToken } = useJwtToken((state) => state)
  const { setSession, clearSession } = useSessionStore((state) => state)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchAuthInit = async () => {
      try {
        const result = await authClient.getSession({
          fetchOptions: {
            onSuccess: (ctx) => {
              const jwt = ctx.response.headers.get('set-auth-jwt')
              if (jwt) {
                setToken(jwt)
              } else {
                clearToken()
              }
            },
            onError: (error) => {
              console.error('Failed to fetch session', error)
              // router.push(ROUTES.SIGNIN)
            },
          },
        })
        
        
        if (!result.data) {
          clearUser()
          clearToken()
          clearSession()
          navigate({ to: '/auth' })
        }
        

        const sessionUser = result.data?.user

        if (sessionUser) {
          const parsed = userSchema.safeParse(sessionUser)

          if (parsed.success) {
            setUser(parsed.data)
          } else {
            console.error('Failed to parse session user', parsed.error)
            clearUser()
          }
        } else {
          clearUser()
        }

        if (result.data?.session) {
          setSession(result.data.session)
        } else {
          clearSession()
        }
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to fetch session', error)

        if (!cancelled) {
          clearUser()
        }
      }
    }

    fetchAuthInit()

    return () => {
      cancelled = true
    }
  }, [clearUser, setUser])

  return { isLoading }
}


