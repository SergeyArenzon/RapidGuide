import { createFileRoute } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/layouts/AuthenticatedLayout'

export const Route = createFileRoute('/_authenticated/guide')({
  component: GuideLayout,
  staticData: {
    label: 'Guide Dashboard',
    showBreadcrumb: true,
  },
})

function GuideLayout() {
  return <AuthenticatedLayout />
}

