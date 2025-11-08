import { useEffect } from 'react'

import { authClient } from '@/lib/auth-client'
import useUserStore from '@/store/useUser'
import { userSchema } from '@/schema/user.schema'

export const useSessionUser = () => {
  const { setUser, clearUser } = useUserStore((state) => state)

  const sessionQuery = authClient.useSession()
  const { data } = sessionQuery

  useEffect(() => {
    const sessionUser = data?.user

    if (sessionUser) {
      const result = userSchema.safeParse(sessionUser)

      if (result.success) {
        setUser(result.data)
      } else {
        console.error('Failed to parse session user', result.error)
        clearUser()
      }
    } else {
      clearUser()
    }
  }, [data])

  return sessionQuery
}


