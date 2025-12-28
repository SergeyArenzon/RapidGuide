import * as React from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { CirclePlus, MapPin } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import type { TourDto } from '@rapid-guide-io/contracts'
import { Button } from '@/components/ui/button'
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

  const isFirstTour = tours.length === 0;

  const columns = React.useMemo<Array<ColumnDef<TourDto>>>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: (info) => (
          <span className="font-medium text-foreground">
            {info.getValue<string>()}
          </span>
        ),
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
    [],
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
          onCreate={() => {
            alert()
          }}
        />
      )}
    </div>
  )
}
