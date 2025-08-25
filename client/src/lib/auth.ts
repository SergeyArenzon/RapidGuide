import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import type { Provider } from "next-auth/providers";
import { cookies } from "next/headers";

const providers: Provider[] = [Google];
 
export const providerMap = providers
  .map((provider) => {
    if (typeof provider === "function") {
      const providerData = provider()
      return { id: providerData.id, name: providerData.name }
    } else {
      return { id: provider.id, name: provider.name }
    }
  })
  .filter((provider) => provider.id !== "credentials")
 
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    signIn: async ({ account, user }) => {
      const response = await fetch(`http://huddlehub.io/api/v1/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jwt: account?.id_token, // Send the Google JWT to verify
          provider: account?.provider
        }),
      });  

      if (response.ok) {
        const authResponse = await response.json();
        user.tokenData = authResponse.user;
        if (authResponse.cookies && authResponse.cookies.length > 0) {
          const cookieStore = await cookies();
          authResponse.cookies.forEach((cookie: any) => {
            console.log('Raw cookie from backend:', cookie);
            console.log('maxAge value:', cookie.maxAge);
            console.log('maxAge type:', typeof cookie.maxAge);
            console.log('maxAge as number:', Number(cookie.maxAge));
            console.log('maxAge is NaN:', isNaN(Number(cookie.maxAge)));
            
            // Ensure maxAge is a valid number
            const maxAge = Number(cookie.maxAge);
            if (isNaN(maxAge)) {
              console.error('Invalid maxAge value:', cookie.maxAge);
              return; // Skip this cookie if maxAge is invalid
            }
            
            const cookieOptions: any = {
              httpOnly: cookie.httpOnly,
              maxAge: maxAge / 1000,
            };
            
            console.log('Setting cookie with options:', cookieOptions);
            cookieStore.set(cookie.name, cookie.value, cookieOptions);
          });
        }
      } else {
        console.log("FAILED SETTING accessToken");
        
        return false; // If the request fails, sign-in is rejected
      }
      return true;
    },
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token; // Save the Google access token
        token.tokenId = account.id_token; // Save the Google access token
      }
      if (user?.tokenData) {
        token.user = user.tokenData; // Store user data from sign-in response in the token
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.user) {
        session.user = {
          ...session.user,
          ...token.user, // Include the custom user data
        };
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to the homepage if signing in
      return baseUrl + "/dashboard";
    },
  }
})
