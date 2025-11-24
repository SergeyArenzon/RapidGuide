import { useEffect } from 'react'

import { useNavigate } from '@tanstack/react-router'
import { sessionSchema, userSchema } from '@rapid-guide-io/contracts';
import type { GuideDto, UserDto} from '@rapid-guide-io/contracts';

import { authClient } from '@/lib/auth-client'
import Api from '@/lib/api'
import useUserStore from '@/store/useUser'
import { useSessionStore } from '@/store/useSession'
import { useJwtTokenStore } from '@/store/useJwtToken'
import useGuideStore from '@/store/useGuide'



const fetchMeHandler = async (
  jwt: string, 
  setGudeCB: (guide: GuideDto) => void, 
  clearguideCB: () => void) => {
  try {
    const api = new Api(jwt);
    const meData = await api.getMe();
    
    if (meData.guide) {
      setGudeCB(meData.guide);
    } else {
      clearguideCB();
    }
  } catch (error) {
    console.error('Failed to fetch profile/me:', error);
    clearguideCB();
  }
}



const sessionUserHandler = (
  sessionUser: UserDto, 
  setUserCB: (user: UserDto) => void, 
  clearUserCB: () => void) => {

    const parsed = userSchema.safeParse(sessionUser)

    if (parsed.success) {
      setUserCB(parsed.data)
    } else {
      console.error('Failed to parse session user', parsed.error)
      clearUserCB()
    }
}



export const useAuth = () => {
  const { clearUser, setUser } = useUserStore((state) => state)
  const { clearSession, setSession } = useSessionStore((state) => state)
  const { clearGuide, setGuide } = useGuideStore((state) => state)
  const { setToken, clearToken } = useJwtTokenStore((state) => state)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchAuthInit = async () => {
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
      }
    }

    fetchAuthInit()
  }, [])
}


