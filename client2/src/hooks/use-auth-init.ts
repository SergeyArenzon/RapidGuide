import { useEffect } from 'react'

import { authClient } from '@/lib/auth-client'
import useUserStore from '@/store/useUser'
import { userSchema } from '@/schema/user.schema'
import useJwtToken from '@/store/useJwtToken'
import { useSessionStore } from '@/store/useSession'


export const useAuthInit = () => {
  const { setUser, clearUser } = useUserStore((state) => state)
  const { setToken, clearToken } = useJwtToken((state) => state)
  const { setSession, clearSession } = useSessionStore((state) => state)

  useEffect(() => {
    let cancelled = false

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
          },
        })

        if (cancelled) {
          return
        }

        if (!('data' in result)) {
          clearUser()
          return
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
}


