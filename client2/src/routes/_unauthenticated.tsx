import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_unauthenticated')({
  beforeLoad: ({ context }) => {
    const auth = context.auth
    console.log("unauwth");

    // Only make redirect decisions after auth has finished loading
    if (!auth.isLoading && auth.isAuthenticated && auth.guide) {
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

