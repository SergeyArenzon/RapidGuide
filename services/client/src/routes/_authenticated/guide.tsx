import { createFileRoute } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/AuthenticatedLayout'

export const Route = createFileRoute('/_authenticated/guide')({
  component: GuideLayout,
})

function GuideLayout() {
  return <AuthenticatedLayout />
}

