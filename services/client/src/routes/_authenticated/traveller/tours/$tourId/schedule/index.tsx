import { profileQueries, tourQueries } from '@/lib/query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Suspense, useState } from 'react'
import { ScheduleSkeleton } from './-skeleton'
import dayjs from 'dayjs'
import { Calendar } from '@/components/ui/calendar'

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

  // Check if a date is available (falls within any availability range)
  const isDateAvailable = (date: Date): boolean => {
    if (!guideAvailabilities || guideAvailabilities.length === 0) return false

    const dayStart = dayjs(date).startOf('day')
    
    return guideAvailabilities.some((availability) => {
      const availStart = dayjs(availability.start_date).startOf('day')
      const availEnd = dayjs(availability.end_date).startOf('day')
      
      return (dayStart.isAfter(availStart) || dayStart.isSame(availStart)) &&
             (dayStart.isBefore(availEnd) || dayStart.isSame(availEnd))
    })
  }

  // Custom modifiers for react-day-picker
  const modifiers = {
    available: (date: Date) => isDateAvailable(date),
  }

  const modifiersClassNames = {
    available: 'bg-primary/20 border-primary border-2',
  }

  return (
    <div className="container mx-auto py-6">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        month={currentMonth}
        onMonthChange={setCurrentMonth}
        modifiers={modifiers}
        modifiersClassNames={modifiersClassNames}
        disabled={(date) => {
          // Disable dates in the past
          const isPast = dayjs(date).isBefore(dayjs(), 'day')
          // Disable dates that are not available
          const isNotAvailable = !isDateAvailable(date)
          return isPast || isNotAvailable
        }}
        className="rounded-md border"
      />
    </div>
  )
}
