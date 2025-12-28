import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/guide/tours/$tourId')({
  staticData: {
    label: 'Tour Details',
    description: 'View tour details.',
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />
}

