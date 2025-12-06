import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ location, context }) => {
    const { auth } = context
    if (auth.isLoading) {
        return
    }
    if (!auth.isAuthenticated) {
        throw redirect({
            to: '/signin',
        })
    } 
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

