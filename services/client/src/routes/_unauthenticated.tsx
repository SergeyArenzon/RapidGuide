import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { useRoleStore } from '@/store/useRole'

export const Route = createFileRoute('/_unauthenticated')({
  beforeLoad: ({ context, location }) => {
    const { auth } = context
    const { role } = useRoleStore.getState()

    if (auth.isLoading) {
      return
    }
    // Only make redirect decisions after auth has finished loading
    // Users with both guide and traveller should be redirected based on their selected role
    if (auth.isAuthenticated && auth.guide && auth.traveller) {
      if (role) {
        throw redirect({
          to: `/${role}`,
        })
      }
      // If no role is set, redirect to root which will handle role selection
      throw redirect({
        to: '/',
      })
    }

    // Redirect authenticated guides away from signin page
    if (auth.isAuthenticated && auth.guide && !auth.traveller) {
      throw redirect({
        to: '/guide',
      })
    }

    // Redirect authenticated travellers away from signin page
    if (auth.isAuthenticated && auth.traveller && !auth.guide) {
      throw redirect({
        to: '/traveller',
      })
    }

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

