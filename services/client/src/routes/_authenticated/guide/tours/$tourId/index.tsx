import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Clock, DollarSign, Edit, MapPin, MoreHorizontal, Trash2, Users } from 'lucide-react'
import { useTourDetail } from './-hooks'
import Loading from '@/components/Loading'
import { Error } from '@/components/Error'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export const Route = createFileRoute('/_authenticated/guide/tours/$tourId/')({
  component: RouteComponent,
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
      {/* Header with back button */}

      {/* Tour Information Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl">{tour.name}</CardTitle>
              <CardDescription className="text-base">{tour.description}</CardDescription>
            </div>
            <CardAction>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => navigate({ to: `/guide/tours/${tourId}/edit` })}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Tour
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="danger"
                    onClick={() => {
                      // TODO: Implement delete functionality
                      console.log('Delete tour', tourId)
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Tour
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardAction>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Location */}
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-muted p-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Location</p>
                <p className="text-sm">
                  {city?.name && country?.name ? `${city.name}, ${country.name}` : tour.country_code}
                </p>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-muted p-2">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Price</p>
                <p className="text-lg font-semibold">${tour.price.toFixed(2)} per person</p>
              </div>
            </div>

            {/* Duration */}
            {tour.duration_minutes && (
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-muted p-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Duration</p>
                  <p className="text-sm">{tour.duration_minutes} minutes</p>
                </div>
              </div>
            )}

            {/* Group Size */}
            {(tour.min_travellers || tour.max_travellers) && (
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-muted p-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Group Size</p>
                  <p className="text-sm">
                    {tour.min_travellers && `Min: ${tour.min_travellers}`}
                    {tour.min_travellers && tour.max_travellers && ' • '}
                    {tour.max_travellers && `Max: ${tour.max_travellers}`}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

