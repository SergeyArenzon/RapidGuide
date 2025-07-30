import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import type { Provider } from "next-auth/providers";
import { cookies } from "next/headers";
import qs from "querystring";

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
        const userData = await response.json();
        user.tokenData = userData;
        const setCookie = qs.decode(
          response.headers.get("set-cookie") as string,
          "; ",
          "="
      );
      
          // Extract the cookie name and the value from the first entry in the 
          // setCookie object
          const [cookieName, cookieValue] = Object.entries(setCookie)[0] as [
            string,
            string
        ];
        
        (await cookies()).set({
          name: cookieName,
          value: cookieValue,
          httpOnly: true, // the parsing of httpOnly returns an empty string, so either have some logic to set it to boolean, or set it manually
          maxAge: setCookie["Max-Age"] ? parseInt(setCookie["Max-Age"] as string) : undefined,
          path: Array.isArray(setCookie.Path) ? setCookie.Path[0] : setCookie.Path,
          sameSite: "strict",
          expires: setCookie.Expires ? new Date(setCookie.Expires as string) : undefined,
          secure: true,
        })
      } else {
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
