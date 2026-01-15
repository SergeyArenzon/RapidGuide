import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/traveller/tours/$tourId/schedule/',
)({
  component: RouteComponent,
  staticData: {
    label: 'Schedule Tour',
    description: 'Schedule a tour.',
    showBreadcrumb: true,
  },
})

function RouteComponent() {
  return <div>Hello "/_authenticated/traveller/tours/$tourId/schedule/"!</div>
}
