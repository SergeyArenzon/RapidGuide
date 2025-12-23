import * as React from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { CirclePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Api from '@/lib/api'

export const Route = createFileRoute('/_authenticated/guide/tours/')({
  component: RouteComponent,
  staticData: {
    label: 'Tours',
  },
})

function RouteComponent() {
  const api = React.useMemo(() => new Api(), [])

  const {
    data: tours = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['tours'],
    queryFn: () => api.tour.getTours(),
    retry: false,
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Button asChild>
            <Link to="/guide/tours/new">
              <CirclePlus className="mr-2 h-4 w-4" />
              Create New Tour
            </Link>
          </Button>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          Loading your tours...
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Button asChild>
            <Link to="/guide/tours/new">
              <CirclePlus className="mr-2 h-4 w-4" />
              Create New Tour
            </Link>
          </Button>
        </div>
        <div className="text-center py-8 text-destructive">
          {error instanceof Error ? error.message : 'Failed to load tours.'}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button asChild>
          <Link to="/guide/tours/new">
            <CirclePlus className="mr-2 h-4 w-4" />
            Create New Tour
          </Link>
        </Button>
      </div>

      {tours.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No tours yet. Create your first tour!
        </div>
      ) : (
        <div className="space-y-3">
          {tours.map((tour) => (
            <div
              key={tour.id}
              className="border rounded-lg p-4 flex flex-col gap-1"
            >
              <div className="flex justify-between items-center">
                <h2 className="font-semibold">{tour.name}</h2>
                <span className="text-sm text-muted-foreground">
                  {tour.duration_minutes} min • ${tour.price}
                </span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {tour.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
