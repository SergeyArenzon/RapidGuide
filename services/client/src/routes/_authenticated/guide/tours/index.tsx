import { useMemo } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { MapPin } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import type { TourDto } from '@rapid-guide-io/contracts'
import { FirstTimeCreation } from '@/components/FirstTimeCreation'
import Api from '@/lib/api'
import Loading from '@/components/Loading'
import { Error } from '@/components/Error'
import { DataTable } from '@/components/DataTable'

export const Route = createFileRoute('/_authenticated/guide/tours/')({
  component: RouteComponent,
  staticData: {
    label: 'Tours index',
    description: 'View all your tours and manage them.',
  },
})

function RouteComponent() {
  const navigate = useNavigate()
  const api = new Api()

  const {
    data: tours = [] as Array<TourDto>,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['tours'],
    queryFn: () => api.tour.getTours(),
    retry: false,
  });

  const {
    data: countries = [],
  } = useQuery({
    queryKey: ['countries'],
    queryFn: () => api.profile.getCountries(),
    retry: false,
  });

  const {
    data: cities = [],
  } = useQuery({
    queryKey: ['cities'],
    queryFn: () => api.profile.getCities(),
    retry: false,
  });

  const isFirstTour = tours.length === 0;

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
    [countries, cities, navigate],
  )

  if (isLoading) return <Loading />
  if (isError) return <Error
    title="Failed to load tours"
    description="Please try again later"
    retryAction={() => refetch()}
  />

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
