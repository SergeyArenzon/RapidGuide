import { Suspense, useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { ScheduleSkeleton } from './-skeleton'
import { AvailabilitiesList, calculateValidTimeSlots } from './-availabilities-list'
import { Calendar } from '@/components/ui/calendar'
import { profileQueries, tourQueries } from '@/lib/query'

export const Route = createFileRoute(
  '/_authenticated/traveller/tours/$tourId/schedule/',
)({
  component: RouteComponent,
  staticData: {
    label: 'Schedule Tour',
    description: 'Schedule a tour.',
    showBreadcrumb: true,
  },
})

function RouteComponent() {
    return (
      <Suspense fallback={<ScheduleSkeleton />}>
        <ScheduleTourContent />
      </Suspense>
    )
  }

function ScheduleTourContent() {
    const { tourId } = Route.useParams()
    const { data: tour } = useSuspenseQuery(tourQueries.detail(tourId))
    
    const { data: guideAvailabilities } = useSuspenseQuery(profileQueries.guideAvailabilities())
    
    const [selectedDate, setSelectedDate] = useState<Date | undefined>()
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
    const [selectedAvailabilityId, setSelectedAvailabilityId] = useState<string | undefined>()

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

  console.log({selectedAvailabilityId});
  return (
    <div className="grid grid-cols-[min-content_1fr] grid-rows-1 gap-2">
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
        className="rounded-md border "
      />

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
    </div>
  )
}
