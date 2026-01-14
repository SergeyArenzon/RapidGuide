import { Suspense, useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { MapPin } from 'lucide-react'
import { ToursListSkeleton } from './-skeleton'
import { useGuideTours, useTours } from './-hooks'
import type { TourDto } from '@rapid-guide-io/contracts'
import { useDeleteTourMutation } from '@/components/TourCard/useDeleteTourMutation'
import { FirstTimeCreation } from '@/components/FirstTimeCreation'
import { TourTable } from '@/components/tour-table/TourTable'
import { AlertDialog } from '@/components/AlertDialog'
import { GuideTourTable } from '@/components/tour-table/GuideTourTable'

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
          <GuideTourTable guideId={guide.id ?? ''} />
        </>
      )}
    </div>
  )
}
