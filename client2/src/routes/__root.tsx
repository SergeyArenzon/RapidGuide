import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import { Error } from '@/components/Error'
import { Sidebar } from '@/components/Sidebar'
import { useSessionUser } from '@/hooks/use-session-user'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
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

  notFoundComponent: () => <Error 
  statusCode={404}
  title="Page not found"
  description="The page you're looking for doesn't exist."/>,
  shellComponent: RootDocument,
})



function RootDocument({ children }: { children: React.ReactNode }) {
  useSessionUser()

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="m-0 h-screen overflow-hidden">
        <div className="grid grid-cols-[1fr_200px] grid-rows-[50px_1fr] h-full w-full">
          <nav>
            DASHBOARD
          </nav>
          <aside>
            <Sidebar />
          </aside>
          <main>
            {children}
          </main>
        </div>

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
