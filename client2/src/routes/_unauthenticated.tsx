import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_unauthenticated')({
  beforeLoad: ({ context, location }) => {
    const { auth } = context

    if (auth.isLoading) {
      return
    }
    // // Only make redirect decisions after auth has finished loading
    // if (auth.isAuthenticated && auth.guide) {
    //   throw redirect({
    //     to: '/dashboard',
    //   })
    // }

    // Redirect unauthenticated users to signin if they're trying to access other routes
    if (!auth.isAuthenticated && location.pathname !== '/signin') {
      throw redirect({
        to: '/signin',
      })
    }
  },
  component: UnauthenticatedLayout,
})

function UnauthenticatedLayout() {
  return <Outlet />
}

