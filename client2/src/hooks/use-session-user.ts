import { useEffect } from 'react'

import { authClient } from '@/lib/auth-client'
import useUserStore from '@/store/useUser'
import { userSchema } from '@/schema/user.schema'

export const useSessionUser = () => {
  const { setUser, clearUser } = useUserStore((state) => state)

  useEffect(() => {
    let cancelled = false

    const fetchSession = async () => {
      try {
        const result = await authClient.getSession({
          fetchOptions: {
            onSuccess: (ctx) => {
              const jwt = ctx.response.headers.get('set-auth-jwt')
              console.log(jwt)
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
      } catch (error) {
        console.error('Failed to fetch session', error)

        if (!cancelled) {
          clearUser()
        }
      }
    }

    fetchSession()

    return () => {
      cancelled = true
    }
  }, [clearUser, setUser])
}


