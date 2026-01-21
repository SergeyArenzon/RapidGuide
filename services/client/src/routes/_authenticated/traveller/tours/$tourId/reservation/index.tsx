import { Suspense, useState } from 'react'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { AvailabilitiesList, calculateValidTimeSlots } from './-availabilities-list'
import { ReservationDetailsCard } from './-reservation-details-card'
import { ReservationSkeleton } from './-skeleton'
import { useCreateReservationMutation } from './useCreateReservationMutation'
import { Route as RootRoute } from '@/routes/__root'
import { Calendar } from '@/components/ui/calendar'
import { bookingQueries, profileQueries, tourQueries } from '@/lib/query'

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
    
    const [selectedDate, setSelectedDate] = useState<Date | undefined>()
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
    const [selectedAvailabilityId, setSelectedAvailabilityId] = useState<string | undefined>()

    const createReservationMutation = useCreateReservationMutation()

    const { data: existingReservations = [] } = useQuery({
      ...bookingQueries.all({
        tour_id: tourId,
        // Value is ignored when query is disabled, but needed for stable key shape
        date: selectedDate ?? new Date(0),
      }),
      enabled: !!selectedDate,
    })
    console.log({selectedDate});
    

  // Check if a date is available (has valid time slots considering tour duration)
  const isDateAvailable = (date: Date): boolean => {
    if (guideAvailabilities.length === 0) return false

    // Check if there are any valid time slots for this date
    const validSlots = calculateValidTimeSlots(
      date,
      guideAvailabilities,
      tour.duration_minutes
    )
    return validSlots.length > 0
  }

  // Custom modifiers for react-day-picker
  const modifiers = {
    available: (date: Date) => isDateAvailable(date),
  }

  // Get the selected time slot details
  const getSelectedTimeSlotDetails = () => {
    if (!selectedDate || !selectedAvailabilityId) return undefined
    
    const validSlots = calculateValidTimeSlots(
      selectedDate,
      guideAvailabilities,
      tour.duration_minutes
    )
    
    return validSlots.find(slot => slot.id === selectedAvailabilityId)
  }

  const selectedSlotDetails = getSelectedTimeSlotDetails()

  const handleFinalizeReservation = () => {
    if (!selectedDate || !selectedSlotDetails || !traveller?.id) {
      console.error('Missing required data for reservation')
      return
    }

    // Combine selectedDate with startTime to create scheduled_datetime
    const [hours, minutes] = selectedSlotDetails.startTime.split(':').map(Number)
    const datetime = dayjs(selectedDate)
      .hour(hours)
      .minute(minutes)
      .second(0)
      .millisecond(0)
      .toDate()

    createReservationMutation.mutate({
      tour_id: tourId,
      availability_ids: [selectedAvailabilityId!], // Use the selected availability ID
      datetime,
      traveller_id: traveller.id,
      price_per_traveller: tour.price,
    })
  }

  return (
    <div className="grid grid-cols-[min-content_1fr] gap-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => {
          setSelectedDate(date)
          setSelectedAvailabilityId(undefined) // Reset selection when date changes
        }}
        month={currentMonth}
        onMonthChange={setCurrentMonth}
        modifiers={modifiers}
        disabled={(date) => {
          // Disable dates in the past
          const isPast = dayjs(date).isBefore(dayjs(), 'day')
          // Disable dates that are not available
          const isNotAvailable = !isDateAvailable(date)
          return isPast || isNotAvailable
        }}
        className="rounded-md border"
      />

      <div className="space-y-4">
        {selectedDate && (
          <AvailabilitiesList
            selectedDate={selectedDate}
            availabilities={guideAvailabilities}
            tourDurationMinutes={tour.duration_minutes}
            selectedAvailabilityId={selectedAvailabilityId}
            onAvailabilityClick={(availability) => {
              setSelectedAvailabilityId(availability.id)
            }}
          />
        )}

        {selectedDate && selectedSlotDetails && (
          <ReservationDetailsCard
            tour={tour}
            selectedDate={selectedDate}
            selectedTimeSlot={selectedSlotDetails}
            onFinalize={handleFinalizeReservation}
            isLoading={createReservationMutation.isPending}
          />
        )}

        {selectedDate && existingReservations.length > 0 && (
          <div className="space-y-2 rounded-md border border-muted p-4">
            <h3 className="text-sm font-medium">
              Existing reservations for this tour on{' '}
              {dayjs(selectedDate).format('MMMM D, YYYY')}
            </h3>
            <ul className="space-y-1 text-sm">
              {existingReservations.map((reservation) => (
                <li
                  key={reservation.id}
                  className="flex items-center justify-between rounded bg-muted/40 px-3 py-2"
                >
                  <span className="font-medium">
                    {dayjs((reservation as any).datetime).format('HH:mm')}
                  </span>
                  <span className="text-muted-foreground">
                    {reservation.status} · {reservation.number_of_travellers} traveller
                    {reservation.number_of_travellers !== 1 ? 's' : ''}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
