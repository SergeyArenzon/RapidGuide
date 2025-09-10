import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import type { Provider } from "next-auth/providers";
import { cookies } from "next/headers";

// Extend NextAuth types
declare module "next-auth" {
  interface User {
    tokenData?: any;
    accessToken?: string;
  }
  interface Session {
    accessToken?: string;
  }
}

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
        credentials: 'include', // Include cookies in the request
        body: JSON.stringify({
          jwt: account?.id_token, // Send the Google JWT to verify
          provider: account?.provider
        }),
      });  

      if (response.ok) {
        const authResponse = await response.json();
        
        user.tokenData = authResponse.user;
        user.accessToken = authResponse.accessToken;
        
        // Extract refreshToken from Set-Cookie headers and set it manually
        const cookieStore = await cookies();
        const setCookieHeader = response.headers.get('set-cookie');
        
        if (setCookieHeader) {
          // Parse Set-Cookie header to extract refreshToken
          const cookies = setCookieHeader.split(',').map(cookie => cookie.trim());
          
          cookies.forEach(cookieString => {
            if (cookieString.startsWith('refreshToken=')) {
              // Extract cookie value and attributes
              const parts = cookieString.split(';').map(part => part.trim());
              const [name, value] = parts[0].split('=');
              
              // Parse cookie attributes
              const attributes: any = {};
              parts.slice(1).forEach(attr => {
                
                if (attr.toLowerCase().startsWith('max-age=')) {
                  const maxAge = parseInt(attr.split('=')[1]);
                  if (!isNaN(maxAge)) {
                    attributes.maxAge = maxAge;
                  }
                } 
      
              });
              attributes.httpOnly = true;
              attributes.sameSite = 'lax';
              // attributes.secure = true; // TODO: Change to true on production
              
              console.log('Setting refreshToken cookie:', { name, value, attributes });
              cookieStore.set(name, value, attributes);
            }
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
        token.providerAccessToken = account.access_token; // Save the Google access token
        token.tokenId = account.id_token; // Save the Google access token
      }
      if (user?.tokenData) {
        token.user = user.tokenData; // Store user data from sign-in response in the token
      }
      if (user?.accessToken) {
        token.accessToken = user.accessToken; // Store access token in JWT token
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
      if (token?.accessToken) {
        session.accessToken = token.accessToken; // Include access token in session
      }
      
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to the homepage if signing in
      return baseUrl + "/dashboard";
    },
  }
})
