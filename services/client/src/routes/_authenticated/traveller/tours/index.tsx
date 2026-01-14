import { Suspense } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ToursListSkeleton } from './-skeleton'
import { useTours, useTravellerTours } from './-hooks'
import type { ColumnDef } from '@tanstack/react-table'
import type { TourDto } from '@rapid-guide-io/contracts'
import { TravellerTourTable } from './-traveller-tour-table/-index'


export const Route = createFileRoute('/_authenticated/traveller/tours/')({
  component: RouteComponent,
  staticData: {
    label: 'Find Tours',
    description: 'Discover and browse available tours.',
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

  return (
    <div>
      <TravellerTourTable />
    </div>
  )
}

