import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
  beforeLoad: () => {
   
    throw redirect({
      to: '/dashboard',
    })
  },
})
function RouteComponent() {
  return <div>Hello "/"!</div>
}

