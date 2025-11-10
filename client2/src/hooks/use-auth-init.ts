import { useEffect } from 'react'

import { useNavigate } from '@tanstack/react-router'
import type { AuthUser } from '@/store/useUser'
import type { SessionData } from '@/store/useSession'

import { authClient } from '@/lib/auth-client'
import { userSchema } from '@/schema/user.schema'
import useJwtToken from '@/store/useJwtToken'
import useUserStore from '@/store/useUser'
import { useSessionStore } from '@/store/useSession'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Api from '@/lib/api'

export const useAuthInit = (): {
  session: SessionData
  user: AuthUser | null
  token: string | null
} => {
  const setUser = useUserStore((state) => state.setUser)
  const clearUser = useUserStore((state) => state.clearUser)
  const user = useUserStore((state) => state.user)
  const setToken = useJwtToken((state) => state.setToken)
  const clearToken = useJwtToken((state) => state.clearToken)
  const token = useJwtToken((state) => state.token)
  const setSession = useSessionStore((state) => state.setSession)
  const clearSession = useSessionStore((state) => state.clearSession)
  const session = useSessionStore((state) => state.session)

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
    } catch (error) {
      console.error('Failed to fetch session', error)
      clearUser()
      clearToken()
      clearSession()
      navigate({ to: '/auth' })
    }
  }
  const navigate = useNavigate()

  useEffect(() => {
    fetchAuthInit()
  }, [])

  const queryClient = useQueryClient()
  const Api = new Api(token);
  // Queries
  const query = useQuery({ queryKey: ['profile'], queryFn:  })


  return { session, user, token }
}


