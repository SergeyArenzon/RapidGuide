import { Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { MapPin } from 'lucide-react'
import { ToursListSkeleton } from './-skeleton'
import { useGuideTours } from './-hooks'
import { FirstTimeCreation } from '@/components/FirstTimeCreation'
import { GuideTourTable } from '@/routes/_authenticated/guide/tours/-guide-tour-table/-index'

export const Route = createFileRoute('/_authenticated/guide/tours/')({
  component: RouteComponent,
  staticData: {
    label: 'Tours',
    description: 'View all your tours and manage them.',
    showBreadcrumb: false,
  },
})

function RouteComponent() {
  return (
    <Suspense fallback={<ToursListSkeleton />}>
      <ToursListContent />
    </Suspense>
  )
}

function ToursListContent() {
  const { guide } = Route.useRouteContext()
  const { tours } = useGuideTours({ guideId: guide?.id ?? '' })
  const isFirstTour = tours.length === 0

  return (
    <div>
      {isFirstTour ? (
        <FirstTimeCreation
          title="Create Your First Tour"
          description="Get started by creating your first tour. Share your expertise and help travelers discover amazing experiences."
          icon={MapPin}
          buttonText="Create Your First Tour"
          buttonLink="/guide/tours/new"
        />
      ) : (
        <>
          {guide && <GuideTourTable guideId={guide.id} />}
        </>
      )}
    </div>
  )
}
