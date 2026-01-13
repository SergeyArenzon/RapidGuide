import { Suspense } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ToursListSkeleton } from './-skeleton'
import { useTours } from './-hooks'
import type { ColumnDef } from '@tanstack/react-table'
import type { TourDto } from '@rapid-guide-io/contracts'
import { TourTable } from '@/components/tour-table/TourTable'

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

  const { tours } = useTours()

  return (
    <div>
      <TourTable
        data={tours}
        name="Tour"
      />
    </div>
  )
}

