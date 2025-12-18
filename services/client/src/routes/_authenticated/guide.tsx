import { createFileRoute } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/layouts/AuthenticatedLayout'

export const Route = createFileRoute('/_authenticated/guide')({
  component: GuideLayout,
})

function GuideLayout() {
  return <AuthenticatedLayout />
}

