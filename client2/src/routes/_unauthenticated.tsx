import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_unauthenticated')({
  beforeLoad: ({ context }) => {
    const auth = context.auth

    // If authenticated with a guide profile, redirect to dashboard
    if (auth.isAuthenticated && auth.guide) {
      throw redirect({
        to: '/dashboard',
      })
    }
  },
  component: UnauthenticatedLayout,
})

function UnauthenticatedLayout() {
  return <Outlet />
}

