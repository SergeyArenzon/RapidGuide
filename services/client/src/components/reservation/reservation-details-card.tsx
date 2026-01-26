import dayjs from 'dayjs'
import { CalendarDays, Clock, DollarSign, MapPin, Users, UserPlus } from 'lucide-react'
import type { ReservationDto, TourDto } from '@rapid-guide-io/contracts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'



interface ReservationDetailsCardProps {
  reservation: Partial<ReservationDto>
  tour: TourDto
  onFinalize: () => void
  isLoading?: boolean
  disabled?: boolean
  mode?: 'create' | 'join'
  availableSpots?: number
}

export function ReservationDetailsCard({
  tour,
  reservation,
  onFinalize,
  isLoading = false,
  disabled = false,
  mode = 'create',
  availableSpots,
}: ReservationDetailsCardProps) {
  const isJoinMode = mode === 'join'
  const hasAvailableSpots = availableSpots !== undefined && availableSpots > 0

  return (
    <Card className={cn(
      isJoinMode && "border-primary/50 bg-primary/5",
      disabled && "opacity-60"
    )}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-2xl">
                {isJoinMode ? 'Join Reservation' : 'Reservation Details'}
              </CardTitle>
              {isJoinMode && hasAvailableSpots && (
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {availableSpots} spot{availableSpots !== 1 ? 's' : ''} available
                </Badge>
              )}
            </div>
            <CardDescription className="text-base">
              {isJoinMode 
                ? 'Join this existing reservation to share the tour with other travellers'
                : 'Review your reservation before finalizing'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Tour name */}
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-muted p-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Tour</p>
              <p className="text-sm font-semibold">{tour.name}</p>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-muted p-2">
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Date</p>
              <p className="text-sm">
                {dayjs(reservation.datetime).format('MMMM D, YYYY')}
              </p>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-muted p-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Time</p>
              <p className="text-sm">
                {reservation.datetime
                  ? `${dayjs(reservation.datetime).format('HH:mm')} - ${dayjs(reservation.datetime).add(tour.duration_minutes, 'minute').format('HH:mm')}`
                  : '—'}
              </p>
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-muted p-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Duration</p>
              <p className="text-sm">{tour.duration_minutes} minutes</p>
            </div>
          </div>

          {/* Travellers */}
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-muted p-2">
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Travellers</p>
              <p className="text-sm">
                {reservation.number_of_travellers !== undefined
                  ? `${reservation.number_of_travellers} / ${tour.max_travellers} (min: ${tour.min_travellers})`
                  : `${tour.min_travellers} - ${tour.max_travellers}`}
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
              <p className="text-lg font-semibold">
                €{tour.price}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        {disabled && !isJoinMode && (
          <div className="w-full p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive font-medium">
              This time slot is already reserved. Please select a different time slot.
            </p>
          </div>
        )}
        {isJoinMode && !hasAvailableSpots && (
          <div className="w-full p-3 bg-muted border rounded-md">
            <p className="text-sm text-muted-foreground font-medium">
              This reservation is full. Please create a new reservation or join another one.
            </p>
          </div>
        )}
        <Button 
          onClick={onFinalize} 
          className="w-full" 
          size="lg"
          disabled={isLoading || disabled || (isJoinMode && !hasAvailableSpots)}
          variant={isJoinMode ? "default" : "default"}
        >
          {isLoading ? (
            isJoinMode ? 'Joining Reservation...' : 'Creating Reservation...'
          ) : (
            isJoinMode ? (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Join Reservation
              </>
            ) : (
              'Create Reservation'
            )
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

