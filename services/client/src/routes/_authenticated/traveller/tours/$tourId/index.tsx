import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Suspense } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { TourDetailSkeleton } from './-skeleton'
import { GuideCard } from '@/components/GuideCard'
import { TourCard } from '@/components/TourCard'
import { tourQueries } from '@/lib/query'
import { Button } from '@/components/ui/button'
import { Calendar } from 'lucide-react'

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
  const navigate = useNavigate()
  
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="row-span-2 row-start-1">
        <TourCard tourId={tourId} />
      </div>
      <div className="col-start-2 row-start-1 h-full">
        <Button onClick={() => navigate({ to: `/traveller/tours/${tourId}/reservation` })} size="lg" className="w-full">
          <Calendar className="mr-2 h-4 w-4" />
          Reserve a Tour
        </Button>
      </div>
      <div className="col-start-2 row-start-2">
        <GuideCard guideId={tour.guide_id} />
      </div>
    </div>
  )
}
