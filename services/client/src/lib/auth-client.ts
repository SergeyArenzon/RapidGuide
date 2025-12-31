import { createAuthClient } from "better-auth/react" 
import { jwtClient } from "better-auth/client/plugins"
import { sessionSchema, userSchema } from "@rapid-guide-io/contracts";
import { useJwtTokenStore } from '@/store/useJwtToken';

export const authClient = await  createAuthClient({
    fetchOptions: {
        credentials: 'include',
    },
    plugins: [
        jwtClient() 
    ],
    baseURL: "http://localhost:80/api/v1/auth/auth",  // The base URL of your auth server
})

/**
 * Refresh session using Better Auth's getSession
 * Can be called from anywhere (hooks, interceptors, etc.)
 * Better Auth uses HTTP-only cookies, so this will automatically
 * get a new JWT if the session is still valid
 * 
 * @returns The new JWT token if successful, null if session expired
 */
export const refreshSession = async (): Promise<string | null> => {
  const { setToken, clearToken } = useJwtTokenStore.getState();

  try {
    const result = await authClient.getSession({
      fetchOptions: {
        onSuccess: async (ctx) => {
          const jwt = ctx.response.headers.get('set-auth-jwt');
          if (jwt) {
            setToken(jwt);
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
      clearToken();
      return null;
    }

    // Parse to validate the data
    userSchema.parse(result.data.user);
    sessionSchema.parse(result.data.session);

    // Return the new token
    return useJwtTokenStore.getState().token;
  } catch (error) {
    console.error('Failed to refresh session', error);
    clearToken();
    return null;
  }
}