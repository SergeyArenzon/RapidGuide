import { createFileRoute } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/AuthenticatedLayout'

export const Route = createFileRoute('/_authenticated/traveller')({
  component: TravellerLayout,
})

function TravellerLayout() {
  return <AuthenticatedLayout />
}

