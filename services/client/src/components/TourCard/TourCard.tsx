import { Clock, DollarSign, MapPin, Users } from 'lucide-react'
import { useTourCard } from './useTourCard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface TourCardProps {
  tourId: string
}

export function TourCard({ tourId }: TourCardProps) {
  const { tour, country, city } = useTourCard(tourId)

  return (
    <Card>
      <CardHeader>
        <div className="space-y-1">
          <CardTitle className="text-2xl">{tour.name}</CardTitle>
          <CardDescription className="text-base">{tour.description}</CardDescription>
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
  )
}

