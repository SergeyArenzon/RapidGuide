import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import * as TanstackQuery from './integrations/tanstack-query/root-provider'
import { routeTree } from './routeTree.gen'

// Create a new router instance
export const getRouter = () => {
  const rqContext = TanstackQuery.getContext()


  const router = createRouter({
    routeTree,
    context: {
      ...rqContext,
      jwt: undefined!,
      user: undefined!,
      session: undefined!,
      guide: undefined!,
      traveller: undefined!,
    },
    defaultPreload: 'intent',
    Wrap: (props: { children: React.ReactNode }) => {
      return (
        <TanstackQuery.Provider {...rqContext}>
          {props.children}
        </TanstackQuery.Provider>
      )
    },
  })


  setupRouterSsrQueryIntegration({ router, queryClient: rqContext.queryClient })

  return router
}
