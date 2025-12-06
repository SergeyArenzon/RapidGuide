import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { getAuthState } from '@/router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ location, context }) => {
    const auth = context.auth
    
    // If still loading, wait for auth to resolve
    if (auth.isLoading) {
      // The root component shows loading state, so this shouldn't happen often
      // but we handle it just in case
      return
    }

    // If not authenticated, redirect to sign in
    if (!auth.isAuthenticated) {
      throw redirect({
        to: '/auth/signin',
        search: {
          redirect: location.href,
        },
      })
    }

    // If authenticated but no guide profile, redirect to signup to complete profile
    if (!auth.guide) {
      throw redirect({
        to: '/auth/signup',
      })
    }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return <Outlet />
}

