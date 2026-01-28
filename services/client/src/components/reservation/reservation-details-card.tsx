import dayjs from 'dayjs'
import { CalendarDays, ClipboardClock, Clock, DollarSign, MapPin, UserPlus, Users } from 'lucide-react'
import type { ReservationDto, TourDto } from '@rapid-guide-io/contracts'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
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

const MODE_CONFIG = {
  create: {
    title: 'Create New Reservation',
    description: 'Review your reservation before finalizing',
    idleLabel: 'Create reservation',
    loadingLabel: 'Creating reservation...',
    Icon: ClipboardClock,
    showSpotsBadge: false as const,
  },
  join: {
    title: 'Join Existing Reservation',
    description: 'Join this existing reservation to share the tour with other travellers',
    idleLabel: 'Join reservation',
    loadingLabel: 'Joining reservation...',
    Icon: UserPlus,
    showSpotsBadge: true as const,
  },
} satisfies Record<
  NonNullable<ReservationDetailsCardProps['mode']>,
  {
    title: string
    description: string
    idleLabel: string
    loadingLabel: string
    Icon: typeof ClipboardClock
    showSpotsBadge: boolean
  }
>

export function ReservationDetailsCard({
  tour,
  reservation,
  onFinalize,
  isLoading = false,
  disabled = false,
  mode = 'create',
  availableSpots,
}: ReservationDetailsCardProps) {
  const config = MODE_CONFIG[mode]
  const isJoinMode = mode === 'join'
  const hasAvailableSpots = availableSpots !== undefined && availableSpots > 0
  const buttonLabel = isLoading ? config.loadingLabel : config.idleLabel

  return (
    <Card
      className={cn(
        "w-full",
        isJoinMode && "border-primary/50 bg-primary/5",
        disabled && "opacity-60",
      )}
    >
      <CardHeader className="space-y-2">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <span>{config.title}</span>
        </CardTitle>
        <CardAction>
          {config.showSpotsBadge && hasAvailableSpots && (
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {availableSpots} spot{availableSpots !== 1 ? 's' : ''} available
            </Badge>
          )}
        </CardAction>
        <CardDescription className="text-base">
          {config.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
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
                ? `${dayjs(reservation.datetime).format('HH:mm')} - ${dayjs(reservation.datetime)
                    .add(tour.duration_minutes, 'minute')
                    .format('HH:mm')}`
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
            <p className="text-lg font-semibold">€{tour.price}</p>
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
          variant="default"
        >
          {!isLoading && (
            <config.Icon className="h-4 w-4" />
          )}
          {buttonLabel}
        </Button>
      </CardFooter>
    </Card>
  )
}

