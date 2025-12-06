import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import * as TanstackQuery from './integrations/tanstack-query/root-provider'
import { routeTree } from './routeTree.gen'
import { useSessionStore } from './store/useSession'
import useUserStore from './store/useUser'
import { useGuideStore } from './store/useGuide'
import { getAuthState } from './lib/auth-state'

// Create a new router instance
export const getRouter = () => {
  const rqContext = TanstackQuery.getContext()


  const router = createRouter({
    routeTree,
    context: {
      ...rqContext,
      get auth() {
        return getAuthState()
      },
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


  useSessionStore.subscribe(() => router.invalidate())
  useUserStore.subscribe(() => router.invalidate())
  useGuideStore.subscribe(() => router.invalidate())

  setupRouterSsrQueryIntegration({ router, queryClient: rqContext.queryClient })

  return router
}
