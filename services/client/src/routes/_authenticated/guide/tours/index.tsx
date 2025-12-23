import { Link, createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { CirclePlus, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FirstTimeCreation } from '@/components/FirstTimeCreation'
import Api from '@/lib/api'
import Loading from '@/components/Loading'
import { Error } from '@/components/Error'

export const Route = createFileRoute('/_authenticated/guide/tours/')({
  component: RouteComponent,
  staticData: {
    label: 'Tours',
  },
})

function RouteComponent() {
  const api = new Api()

  const {
    data: tours = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['tours'],
    queryFn: () => api.tour.getTours(),
    retry: false,
  })
  const isFirstTour = tours.length === 0;

  if (isLoading) return <Loading />
  if (isError) return <Error
    title="Failed to load tours"
    description="Please try again later"
    retryAction={() => refetch()}
  />

  return (
    <div>
      {!isFirstTour && <div className="flex justify-between items-center">
        <Button asChild>
          <Link to="/guide/tours/new">
            <CirclePlus className="mr-2 h-4 w-4" />
            Create New Tour
          </Link>
        </Button>
      </div>}

      {isFirstTour ? (
        <FirstTimeCreation
          title="Create Your First Tour"
          description="Get started by creating your first tour. Share your expertise and help travelers discover amazing experiences."
          icon={MapPin}
          buttonText="Create Your First Tour"
          buttonLink="/guide/tours/new"
        />
      ) : (
        <div className="space-y-3">
          {tours.map((tour) => (
            <Card key={tour.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{tour.name}</CardTitle>
                  <span className="text-sm text-muted-foreground">
                    {tour.duration_minutes} min • ${tour.price}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="line-clamp-2">
                  {tour.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
