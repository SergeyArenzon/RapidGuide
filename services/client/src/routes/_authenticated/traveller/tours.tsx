import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/traveller/tours')({
  component: RouteComponent,
  staticData: {
    label: 'Find Tours',
    description: 'Discover and browse available tours.',
    showBreadcrumb: true,
  },
})

function RouteComponent() {
  return <Outlet />
}

