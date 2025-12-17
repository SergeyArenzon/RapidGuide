import { createFileRoute } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/routes/_authenticated/Layout'

export const Route = createFileRoute('/_authenticated/traveller')({
  component: TravellerLayout,
})

function TravellerLayout() {
  return <AuthenticatedLayout />
}

