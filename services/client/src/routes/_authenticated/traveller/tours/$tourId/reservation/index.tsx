import { Suspense } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
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
    joinableReservations,
  } = useReservation({
    tourId,
    tour,
    guideAvailabilities,
    travellerId: traveller?.id,
  })


  return (
    <div className="space-y-6 grid grid-cols-[min-content_1fr] gap-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        month={currentMonth}
        onMonthChange={setCurrentMonth}
        modifiers={modifiers}
        disabled={isDateDisabled}
        className="rounded-md border self-start"
      />
      <div className="space-y-6">
        {selectedDate && (
          <>
            {/* Create New Reservation Section */}
            <div className="space-y-3">
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
                  traveller_ids: [],
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
                    tour.max_travellers - joinableReservations[0].traveller_ids.length
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
  )
}
