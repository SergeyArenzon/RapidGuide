import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/guide/tours')({
  component: RouteComponent,
  staticData: {
    label: 'Tours',
    description: 'View all your tours and manage them.',
    showBreadcrumb: true,
  },
})

function RouteComponent() {
  return <Outlet />
}

