import { useRoleStore } from '@/store/useRole'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    const { auth } = context
    const { role } = useRoleStore.getState()
    console.log({auth});
    
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

