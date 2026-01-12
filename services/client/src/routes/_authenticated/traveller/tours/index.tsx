import { Suspense } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ToursListSkeleton } from './-skeleton'
import { useTours } from './-hooks'
import type { ColumnDef } from '@tanstack/react-table'
import type { TourDto } from '@rapid-guide-io/contracts'
import { TourTable } from '@/components/TourTable'

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

  const { tours, countries, cities } = useTours()

  const columns: Array<ColumnDef<TourDto>> = [
    {
      accessorKey: 'name',
      header: 'Tour Name',
      cell: (info) => {
        const tour = info.row.original
        return (
          <Link
            to="/traveller/tours/$tourId"
            params={{ tourId: tour.id }}
            className="font-medium text-foreground hover:text-primary hover:underline cursor-pointer text-left"
          >
            {info.getValue<string>()}
          </Link>
        )
      },
    },
    {
      accessorKey: 'country_code',
      header: 'Country',
      cell: (info) => {
        const countryCode = info.getValue<string>()
        const country = countries.find(c => c.code === countryCode)
        return (
          <span className="text-sm text-muted-foreground">
            {country?.name || countryCode}
          </span>
        )
      },
    },
    {
      accessorKey: 'city_id',
      header: 'City',
      cell: (info) => {
        const cityId = info.getValue<number>()
        const city = cities.find(c => c.id === cityId)
        return (
          <span className="text-sm text-muted-foreground">
            {city?.name || cityId}
          </span>
        )
      },
    },
    {
      accessorKey: 'duration_minutes',
      header: 'Duration',
      cell: (info) => (
        <span className="text-sm text-muted-foreground">
          {info.getValue<number>()} min
        </span>
      ),
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: (info) => (
        <span className="text-sm font-medium text-foreground">
          ${info.getValue<number>().toFixed(2)}
        </span>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: (info) => (
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {info.getValue<string>()}
        </p>
      ),
    },
  ]

  return (
    <div>
      <TourTable
        columns={columns}
        data={tours}
        emptyMessage="No tours available at the moment."
        filterColumnId="name"
        filterPlaceholder="Search tours..."
        name="Tour"
      />
    </div>
  )
}

