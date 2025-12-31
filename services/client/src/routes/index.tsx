import { createFileRoute, redirect } from '@tanstack/react-router'
import { useRoleStore } from '@/store/useRole'

export const Route = createFileRoute('/')({
  component: RouteComponent,
  staticData: {
    label: 'Home',
  },
  beforeLoad: ({ context }) => {
    const { session, traveller, guide } = context
    const { role } = useRoleStore.getState()
    
    if (!session) {
      throw redirect({
        to: '/signin',
      })
    }

    if (guide || traveller) {
      
      throw redirect({
        to: `/${guide ? 'guide' : 'traveller'}`,
      })
    }
  },
})
function RouteComponent() {
  return <div>Hello "/"!</div>
}

