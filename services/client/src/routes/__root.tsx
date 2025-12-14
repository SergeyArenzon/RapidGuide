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
import { useAuth } from '@/hooks/use-auth'

interface RouterContext {
  auth: AuthContext
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
  beforeLoad: () => {
    console.log("root");
  },
  
})




function RootComponent() {
  const { isLoading: isSessionLoading } = useAuth()
  
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="m-0 h-screen overflow-hidden">
        {isSessionLoading ? <Loading /> : <Outlet />}
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
