import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useTourDetail } from './-hooks'
import Loading from '@/components/Loading'
import { Error } from '@/components/Error'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_authenticated/guide/tours/$tourId/')({
  component: RouteComponent,
  staticData: {
    label: 'Tour Details',
    description: 'View tour details.'
  },
})

function RouteComponent() {
  const navigate = useNavigate()
  const { tourId } = Route.useParams()
  const { tour, isLoading, isError, refetch, country, city } = useTourDetail(tourId)

  if (isLoading) return <Loading />
  if (isError) return (
    <Error
      title="Failed to load tour"
      description="Please try again later"
      retryAction={() => refetch()}
    />
  )
  if (!tour) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: '/guide/tours' })}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">{tour.name}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-medium text-muted-foreground">Location</h2>
            <p className="mt-1 text-sm">
              {city?.name && country?.name ? `${city.name}, ${country.name}` : tour.country_code}
            </p>
          </div>

          <div>
            <h2 className="text-sm font-medium text-muted-foreground">Description</h2>
            <p className="mt-1 text-sm">{tour.description}</p>
          </div>

          <div>
            <h2 className="text-sm font-medium text-muted-foreground">Price</h2>
            <p className="mt-1 text-lg font-semibold">${tour.price.toFixed(2)} per person</p>
          </div>

          {tour.duration_minutes && (
            <div>
              <h2 className="text-sm font-medium text-muted-foreground">Duration</h2>
              <p className="mt-1 text-sm">{tour.duration_minutes} minutes</p>
            </div>
          )}

          {(tour.min_travellers || tour.max_travellers) && (
            <div>
              <h2 className="text-sm font-medium text-muted-foreground">Group Size</h2>
              <p className="mt-1 text-sm">
                {tour.min_travellers && `Min: ${tour.min_travellers}`}
                {tour.min_travellers && tour.max_travellers && ' • '}
                {tour.max_travellers && `Max: ${tour.max_travellers}`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

