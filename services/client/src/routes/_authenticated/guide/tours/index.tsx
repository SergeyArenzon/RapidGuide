import { Suspense, useMemo } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { MapPin } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import type { TourDto } from '@rapid-guide-io/contracts'
import { FirstTimeCreation } from '@/components/FirstTimeCreation'
import { DataTable } from '@/components/DataTable'
import { ToursListSkeleton } from './-skeleton'
import { useTours } from './-hooks'

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
  const navigate = useNavigate()
  const { tours, countries, cities } = useTours()

  const isFirstTour = tours.length === 0

  const columns = useMemo<Array<ColumnDef<TourDto>>>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: (info) => {
          const tour = info.row.original
          return (
            <Link
              to="/guide/tours/$tourId"
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
          <span className="text-sm text-muted-foreground">
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
    ],
    [countries, cities],
  )

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
        <DataTable
          columns={columns}
          data={tours}
          emptyMessage="No tours found."
          filterColumnId="name"
          filterPlaceholder="Filter tours..."
          name="Tour"
          onCreate={() => navigate({ to: '/guide/tours/new' })}
        />
      )}
    </div>
  )
}
