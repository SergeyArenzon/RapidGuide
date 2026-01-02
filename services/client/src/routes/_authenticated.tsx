import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ location, context }) => {
    const { session, guide, traveller } = context
    
    if (!session) {
        throw redirect({
            to: '/signin',
        })
    } 

    if ((!guide && location.pathname === '/guide') || (!traveller && location.pathname === '/traveller')) {
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

