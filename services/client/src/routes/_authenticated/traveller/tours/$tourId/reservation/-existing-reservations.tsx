import type { ReservationDto, TourDto } from '@rapid-guide-io/contracts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ReservationDetailsCard } from '@/components/reservation/reservation-details-card'

interface ExistingReservationsProps {
  joinableReservations: Array<ReservationDto>
  tour: TourDto
  onJoin: (reservationId: string) => void
  isLoading: boolean
}

export function ExistingReservations({
  joinableReservations,
  tour,
  onJoin,
  isLoading,
}: ExistingReservationsProps) {
  if (joinableReservations.length === 0) return null

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">Join Existing Reservation</CardTitle>
        <CardDescription>
          These reservations have available spots. Join to share the tour with other travellers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {joinableReservations.map((reservation) => (
            <ReservationDetailsCard
              key={reservation.id}
              tour={tour}
              reservation={reservation}
              onFinalize={() => onJoin(reservation.id)}
              isLoading={isLoading}
              mode="join"
              availableSpots={tour.max_travellers - reservation.number_of_travellers}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

