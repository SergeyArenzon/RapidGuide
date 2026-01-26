import { Suspense } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { AvailabilitiesList } from './-availabilities-list'
import { ReservationSkeleton } from './-skeleton'
import { ReservationDetailsCard } from '@/components/reservation/reservation-details-card'
import { Route as RootRoute } from '@/routes/__root'
import { Calendar } from '@/components/ui/calendar'
import { profileQueries, tourQueries } from '@/lib/query'
import { useReservation } from './useReservation'

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
    setSelectedDate,
    setCurrentMonth,
    handleAvailabilityClick,
    handleFinalizeReservation,
    modifiers,
    isDateDisabled,
    isCreatingReservation,
  } = useReservation({
    tourId,
    tour,
    guideAvailabilities,
    travellerId: traveller?.id,
  })

  return (
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

      <div className="space-y-4">
        {selectedDate && (
          <AvailabilitiesList
            selectedDate={selectedDate}
            availabilities={guideAvailabilities}
            tourDurationMinutes={tour.duration_minutes}
            selectedAvailabilityId={selectedAvailabilityId}
            onAvailabilityClick={handleAvailabilityClick}
          />
        )}

        {selectedDate && selectedSlotDetails && reservationDatetime && (
          <ReservationDetailsCard
            tour={tour}
            reservation={{
              id: selectedSlotDetails.id,
              datetime: reservationDatetime,
              number_of_travellers: 0
            }}
            onFinalize={handleFinalizeReservation}
            isLoading={isCreatingReservation}
          />
        )}

        {selectedDate && existingReservations.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">
              Existing reservations for this tour on{' '}
              {dayjs(selectedDate).format('MMMM D, YYYY')}
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {existingReservations.map((reservation) => 
                (<ReservationDetailsCard
                    key={reservation.id}
                    tour={tour}
                    reservation={reservation}
                    onFinalize={() => {}}
                  />)
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
