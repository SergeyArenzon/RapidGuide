import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import React, { useEffect } from 'react'
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import appCss from '../styles.css?url'
import type { QueryClient } from '@tanstack/react-query'
import type { AuthContext } from '@/context/auth-context'
import { Error } from '@/components/Error'
import Loading from '@/components/Loading'
import { Toaster } from '@/components/ui/sonner'
import { useJwtTokenStore } from '@/store/useJwtToken'
import { loadAuthContext } from '@/lib/auth-loader'


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
  errorComponent: ({ error }: { error?: Error }) => (
    <RootDocument>
      <Error 
        statusCode={500}
        title="Something went wrong"
        description={error?.message || "An unexpected error occurred. Please try again later."}
      />
    </RootDocument>
  ),
  notFoundComponent: () => (
    <RootDocument>
      <Error 
        statusCode={404}
        title="Page not found"
        description="The page you're looking for doesn't exist."
      />
    </RootDocument>
  ),
  component: RootComponent,
  beforeLoad: async ({ context }) => {
    return await loadAuthContext(context.queryClient, context.session)
  },
  
})

/**
 * Root Document Wrapper
 * Provides the HTML structure (html, head, body) that includes CSS
 * Used by both RootComponent and error/notFound components to ensure CSS is always loaded
 */
function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="m-0 h-screen overflow-hidden">
        {children}
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
    <RootDocument>
      <Toaster />
      <Outlet />
    </RootDocument>
  )
}
