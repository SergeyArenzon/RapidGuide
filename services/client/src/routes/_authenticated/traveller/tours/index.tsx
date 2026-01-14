import { Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ToursListSkeleton } from './-skeleton'
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

