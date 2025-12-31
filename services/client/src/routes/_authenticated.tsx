import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ location, context }) => {
    const { session, guide } = context

    if (!session) {
        throw redirect({
            to: '/signin',
        })
    } 
    if (!guide) {
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

