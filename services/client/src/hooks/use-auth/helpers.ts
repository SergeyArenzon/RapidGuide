import { sessionSchema, userSchema } from "@rapid-guide-io/contracts";
import type { UserDto } from "@rapid-guide-io/contracts";
import Api from "@/lib/api/index";
import { authClient } from '@/lib/auth-client';
import useUserStore from '@/store/useUser';
import { useSessionStore } from '@/store/useSession';
import { useJwtTokenStore } from '@/store/useJwtToken';
import { useGuideStore } from '@/store/useGuide';
import { useTravellerStore } from "@/store/useTraveller";

export const fetchMeHandler = async () => {
  const { clearTraveller, setTraveller } = useTravellerStore.getState();
  const { clearGuide, setGuide } = useGuideStore.getState();
  try {

      const api = new Api();
      const meData = await api.profile.getMe();
      
      if (meData.guide) {
        setGuide(meData.guide);
      } else {
        clearGuide();
      }
      if (meData.traveller) {
        setTraveller(meData.traveller);
      } else {
        clearTraveller();
      }
    } catch (error) {
      console.error('Failed to fetch profile/me:', error);
      clearGuide();
      clearTraveller();
    }
  }
  
  
  
export const sessionUserHandler = (sessionUser: UserDto) => {
  const { clearUser, setUser } = useUserStore.getState();
  const parsed = userSchema.safeParse(sessionUser)

  if (parsed.success) {
    setUser(parsed.data)
  } else {
    console.error('Failed to parse session user', parsed.error)
    clearUser();
  }
}

/**
 * Refresh session using Better Auth's getSession
 * Can be called from anywhere (hooks, interceptors, etc.)
 * Better Auth uses HTTP-only cookies, so this will automatically
 * get a new JWT if the session is still valid
 * 
 * @returns The new JWT token if successful, null if session expired
 */
export const refreshSession = async (): Promise<string | null> => {
  const { clearUser } = useUserStore.getState();
  const { clearSession, setSession } = useSessionStore.getState();
  const { setToken, clearToken } = useJwtTokenStore.getState();
  const { clearGuide } = useGuideStore.getState();

  try {
    const result = await authClient.getSession({
      fetchOptions: {
        onSuccess: async (ctx) => {
          const jwt = ctx.response.headers.get('set-auth-jwt');
          if (jwt) {
            setToken(jwt);
            await fetchMeHandler();
          } else {
            clearToken();
          }
        },
        onError: (error) => {
          console.error('Failed to refresh session', error);
        },
      },
    });

    if (!result.data) {
      // Session expired or invalid
      clearUser();
      clearToken();
      clearSession();
      clearGuide();
      return null;
    }

    // Update user and session stores
    const user = userSchema.parse(result.data.user);
    const session = sessionSchema.parse(result.data.session);
    await sessionUserHandler(user);
    setSession(session);

    // Return the new token
    return useJwtTokenStore.getState().token;
  } catch (error) {
    console.error('Failed to refresh session', error);
    clearUser();
    clearToken();
    clearSession();
    clearGuide();
    return null;
  }
}
  
  