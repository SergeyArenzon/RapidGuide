import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/guide/tours')({
  component: RouteComponent,
  staticData: {
    label: 'Tours',
  },
})

function RouteComponent() {
  return <Outlet />
}
