import { Suspense } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { AvailabilitiesList } from './-availabilities-list'
import { ReservationSkeleton } from './-skeleton'
import { useReservation } from './-hooks'
import { ReservationDetailsCard } from '@/components/reservation/reservation-details-card'
import { Route as RootRoute } from '@/routes/__root'
import { Calendar } from '@/components/ui/calendar'
import { profileQueries, tourQueries } from '@/lib/query'

export const Route = createFileRoute(
  '/_authenticated/traveller/tours/$tourId/reservation/',
)({
  component: RouteComponent,
  staticData: {
    label: 'Reserve a Tour',
    description: 'Find a suitable time for your tour.',
    showBreadcrumb: true,
  },
})

function RouteComponent() {
    return (
      <Suspense fallback={<ReservationSkeleton />}>
        <ScheduleTourContent />
      </Suspense>
    )
  }

function ScheduleTourContent() {
  const { tourId } = Route.useParams()
  const { traveller } = RootRoute.useRouteContext()
  const { data: tour } = useSuspenseQuery(tourQueries.detail(tourId))

  const { data: guideAvailabilities } = useSuspenseQuery(
    profileQueries.guideAvailabilitiesByGuideId(tour.guide_id)
  )

  const {
    selectedDate,
    currentMonth,
    selectedAvailabilityId,
    selectedSlotDetails,
    reservationDatetime,
    existingReservations,
    reservedAvailabilityIds,
    setSelectedDate,
    setCurrentMonth,
    handleAvailabilityClick,
    handleFinalizeReservation,
    handleJoinReservation,
    modifiers,
    isDateDisabled,
    isSelectedSlotReserved,
    isCreatingReservation,
  } = useReservation({
    tourId,
    tour,
    guideAvailabilities,
    travellerId: traveller?.id,
  })

  // Filter joinable reservations (pending/confirmed with available spots)
  const allJoinableReservations = existingReservations.filter(
    (reservation) =>
      (reservation.status === 'pending' || reservation.status === 'confirmed') &&
      reservation.number_of_travellers < tour.max_travellers
  )

  // If a specific availability is selected, only show reservations for that slot
  const joinableReservations = selectedAvailabilityId
    ? allJoinableReservations.filter((reservation) =>
        reservation.reservation_availabilities.some(
          (ra) => ra.availability_id === selectedAvailabilityId
        )
      )
    : allJoinableReservations

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-[min-content_1fr] gap-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          modifiers={modifiers}
          disabled={isDateDisabled}
          className="rounded-md border"
        />

        <div className="space-y-6">
          {selectedDate && (
            <>
              {/* Create New Reservation Section */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <h2 className="text-lg font-semibold">Create New Reservation</h2>
                  </div>
                  <p className="text-sm text-muted-foreground ml-4">
                    Select an available time slot to create a new reservation.
                  </p>
                </div>
                <AvailabilitiesList
                  selectedDate={selectedDate}
                  availabilities={guideAvailabilities}
                  tourDurationMinutes={tour.duration_minutes}
                  selectedAvailabilityId={selectedAvailabilityId}
                  reservedAvailabilityIds={reservedAvailabilityIds}
                  onAvailabilityClick={handleAvailabilityClick}
                />
              </div>

              {/* New Reservation Details (only when slot is free) */}
              {selectedSlotDetails && reservationDatetime && !isSelectedSlotReserved && (
                <ReservationDetailsCard
                  tour={tour}
                  reservation={{
                    id: selectedSlotDetails.id,
                    datetime: reservationDatetime,
                    number_of_travellers: 0
                  }}
                  onFinalize={handleFinalizeReservation}
                  isLoading={isCreatingReservation}
                  disabled={isSelectedSlotReserved}
                  mode="create"
                />
              )}

              {/* Join Existing Reservation (for selected slot) */}
              {joinableReservations.length > 0 && (
                  <ReservationDetailsCard
                    tour={tour}
                    reservation={joinableReservations[0]}
                    onFinalize={() => handleJoinReservation(joinableReservations[0].id)}
                    isLoading={isCreatingReservation}
                    mode="join"
                    availableSpots={
                      tour.max_travellers - joinableReservations[0].number_of_travellers
                    }
                  />
              )}
            </>
          )}

          {!selectedDate && (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <p>Select a date to see available reservations</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
