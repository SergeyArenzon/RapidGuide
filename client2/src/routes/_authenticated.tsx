import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ location, context }) => {
    const auth = context.auth

    // If not authenticated, redirect to sign in
    if (!auth.isAuthenticated) {
      throw redirect({
        to: '/signin',
        search: {
          redirect: location.href,
        },
      })
    }

    // If authenticated but no guide profile, redirect to signup to complete profile
    if (!auth.guide) {
      throw redirect({
        to: '/signup',
      })
    }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return <Outlet />
}

