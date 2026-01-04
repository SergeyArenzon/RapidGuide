import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { TourDetailSkeleton } from './-skeleton'
import { TourCard } from '@/components/TourCard'

export const Route = createFileRoute('/_authenticated/guide/tours/$tourId/')({
  staticData: {
    label: 'Tour Details',
    description: 'View tour details.',
    showBreadcrumb: false,
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Suspense fallback={<TourDetailSkeleton />}>
      <TourDetailContent />
    </Suspense>
  )
}

function TourDetailContent() {
  const { tourId } = Route.useParams()

  return <TourCard tourId={tourId} showActions/>
}

