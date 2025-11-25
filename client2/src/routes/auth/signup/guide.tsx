import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/signup/guide')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/auth/signup/guide"!</div>
}
