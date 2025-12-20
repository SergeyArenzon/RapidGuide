import { createFileRoute, redirect } from '@tanstack/react-router'
import { useRoleStore } from '@/store/useRole'

export const Route = createFileRoute('/')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    const { auth } = context
    const { role } = useRoleStore.getState()
    
    if (auth.isLoading) {
      return
    }
    if (!auth.isAuthenticated) {
      throw redirect({
        to: '/signin',
      })
    }
    if ((auth.guide || auth.traveller) && role) {
      throw redirect({
        to: `/${role}`,
      })
    }
  },
})
function RouteComponent() {
  return <div>Hello "/"!</div>
}

