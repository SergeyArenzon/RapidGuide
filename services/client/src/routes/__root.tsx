import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import appCss from '../styles.css?url'
import type { QueryClient } from '@tanstack/react-query'
import type { AuthContext } from '@/context/auth-context'
import { Error } from '@/components/Error'
import Loading from '@/components/Loading'
import { Toaster } from '@/components/ui/sonner'
import { getSessionFn } from '@/lib/auth.server'
import { userSchema, sessionSchema } from '@rapid-guide-io/contracts'
import { ProfileApi } from '@/lib/api/profile'
import { useEffect } from 'react'
import { useJwtTokenStore } from '@/store/useJwtToken'


interface RouterContext extends AuthContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'RapidGuide',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  pendingComponent: () => <Loading />,
  notFoundComponent: () => <Error 
    statusCode={404}
    title="Page not found"
    description="The page you're looking for doesn't exist."/>,
  component: RootComponent,
  beforeLoad: async () => {
    const result = await getSessionFn();

    if (!result?.data) {
      return {
        jwt: null,
        user: null,
        session: null,
        guide: null,
        traveller: null,
      };
    }

    try {
      // Parse user and session
      const user = userSchema.parse(result.data.user);
      const session = sessionSchema.parse(result.data.session);

      // Fetch guide and traveller data using the JWT token directly
      let guide = null;
      let traveller = null;
      
      if (result.jwt) {
        try {
          // Create ProfileApi instance with the JWT token directly
          
          const profileApi = new ProfileApi(result.jwt);
          const meData = await profileApi.getMe();
          guide = meData.guide || null;
          traveller = meData.traveller || null;
        } catch (error) {
          console.error('Failed to fetch guide/traveller data:', error);
        }
      }

      return {
        jwt: result.jwt,
        user,
        session,
        guide,
        traveller,
      };
    } catch (error) {
      console.error('Failed to parse session data:', error);
      return {
        jwt: null,
        user: null,
        session: null,
        guide: null,
        traveller: null,
      };
    }
  },
  
})




function RootComponent() {
  // Get data from beforeLoad - useLoaderData() for beforeLoad return values
  const { jwt } = Route.useRouteContext();
  
  // Get Zustand store setters
  const { setToken } = useJwtTokenStore((state) => state)
  
  // Hydrate Zustand stores from loader data on client side
  useEffect(() => {
    setToken(jwt!);
  }, []);
  

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="m-0 h-screen overflow-hidden">
        <Toaster />
        <Outlet />
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
