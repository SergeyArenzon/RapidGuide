import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { TourDetailSkeleton } from './-skeleton'
import { GuideCard } from '@/components/GuideCard'
import { TourCard } from '@/components/TourCard'
import { tourQueries } from '@/lib/query'

export const Route = createFileRoute(
  '/_authenticated/traveller/tours/$tourId/',
)({
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
  const { data: tour } = useSuspenseQuery(tourQueries.detail(tourId))
  console.log({tour});
  
  return (
    <div className="space-y-6">
      <TourCard tourId={tourId} />
      <GuideCard guideId={tour.guide_id} />
    </div>
  )
}
