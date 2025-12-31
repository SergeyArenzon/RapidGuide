import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/guide/preferences')({
  component: RouteComponent,
  staticData: {
    label: 'Preferences',
    description: 'Manage your preferences and settings.',
    showBreadcrumb: true,
  },
})

function RouteComponent() {
  return <Outlet />
}


