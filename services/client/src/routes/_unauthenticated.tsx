import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { useRoleStore } from '@/store/useRole'

export const Route = createFileRoute('/_unauthenticated')({
  beforeLoad: ({ context, location }) => {
    const { session, traveller, guide } = context
    const { role } = useRoleStore.getState()
    
    // Only make redirect decisions after auth has finished loading
    // Users with both guide and traveller should be redirected based on their selected role
    if (!!session && guide && traveller) {
      // Allow access to signup pages even if they have both profiles
      if (location.pathname.startsWith('/signup')) {
        return
      }
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

    // Allow authenticated users to access signup pages if they're missing a profile
    if (!!session && location.pathname.startsWith('/signup')) {
      return
    }

    // Redirect authenticated guides away from signin page (but allow signup)
    if (!!session && guide && !traveller && location.pathname === '/signin') {
      throw redirect({
        to: '/guide',
      })
    }

    // Redirect authenticated travellers away from signin page (but allow signup)
    if (!!session && traveller && !guide && location.pathname === '/signin') {
      throw redirect({
        to: '/traveller',
      })
    }

    // Redirect unauthenticated users to signin if they're trying to access other routes
    if (!session && location.pathname !== '/signin') {
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

