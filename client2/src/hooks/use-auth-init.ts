import { useEffect } from 'react'

import { useNavigate } from '@tanstack/react-router'
import { userSchema } from '@rapid-guide-io/contracts';
import type { GetProfilesMeResponseDto, GuideDto, UserDto} from '@rapid-guide-io/contracts';
import type { AuthUser } from '@/store/useUser'
import type { SessionData } from '@/store/useSession'


import { authClient } from '@/lib/auth-client'
import useJwtToken from '@/store/useJwtToken'
import useUserStore from '@/store/useUser'
import { useSessionStore } from '@/store/useSession'
import useGuideStore from '@/store/useGuide'




const fetchMeHandler = async (
  jwt: string, 
  setGudeCB: (guide: GuideDto) => void, 
  clearguideCB: () => void) => {
  const me = await fetch(`http://localhost/api/v1/profile/me`, {
    headers: {
      'Authorization': `Bearer ${jwt}`
    }
  });

  if (me.ok) {
    const meData: GetProfilesMeResponseDto = await me.json();
    
    if (meData.guide) {
      setGudeCB(meData.guide);
    } else {
      clearguideCB();
    }
  } else {
    clearguideCB();
  }
}



const sessionUserHandler = (
  sessionUser: any, 
  setUserCB: (user: UserDto) => void, 
  clearUserCB: () => void) => {
  
  if (sessionUser) {
    console.log({sessionUser});
    
    const parsed = userSchema.safeParse(sessionUser)

    if (parsed.success) {
      setUserCB(parsed.data)
    } else {
      console.error('Failed to parse session user', parsed.error)
      clearUserCB()
    }
  } else {
    clearUserCB()
  }
}



export const useAuthInit = (): {
  session: SessionData
  user: AuthUser | null
  token: string | null
} => {
  const { user, clearUser, setUser } = useUserStore((state) => state)
  const { token, clearToken, setToken } = useJwtToken((state) => state)
  const { session, clearSession, setSession } = useSessionStore((state) => state)
  const { guide, clearGuide, setGuide } = useGuideStore((state) => state)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchAuthInit = async () => {
      try {
        const result = await authClient.getSession({
          fetchOptions: {
            onSuccess: async(ctx) => {
              const jwt = ctx.response.headers.get('set-auth-jwt')   
              if (jwt) {
                await fetchMeHandler(jwt, setGuide, clearGuide)   
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

        const { user, session } = result.data

        if (user) {
          await sessionUserHandler(user, setUser, clearUser)
        } 

        if (session) {
          setSession(session)
        } else {
          clearSession()
        }


      } catch (error) {
        console.error('Failed to fetch session', error)
        clearUser()
        clearToken()
        clearSession()
        clearGuide()
        navigate({ to: '/auth' })
      }
    }

    fetchAuthInit()
  }, [])

  return { session, user, token }
}


