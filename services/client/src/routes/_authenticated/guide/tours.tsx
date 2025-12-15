import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/guide/tours')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/guide/tours"!</div>
}
