import dayjs from 'dayjs'
import { Availability } from './-availability'
import type { GuideAvailabilityDto } from '@rapid-guide-io/contracts'

interface TimeSlot {
  id: string
  startTime: string
  endTime: string
  availability: GuideAvailabilityDto
}

interface SlotData {
  id: string
  start: dayjs.Dayjs
  end: dayjs.Dayjs
  startTime: string
  endTime: string
  availability: GuideAvailabilityDto
}

/**
 * Calculate valid time slots for a given date considering tour duration
 */
export function calculateValidTimeSlots(
  selectedDate: Date,
  availabilities: Array<GuideAvailabilityDto>,
  tourDurationMinutes?: number
): Array<TimeSlot> {
  const selectedDay = dayjs(selectedDate).startOf('day')

  // Find availabilities that include the selected date
  const matchingAvailabilities = availabilities.filter((availability) => {
    const availStart = dayjs(availability.start_date).startOf('day')
    const availEnd = dayjs(availability.end_date).startOf('day')

    return (
      (selectedDay.isAfter(availStart) || selectedDay.isSame(availStart)) &&
      (selectedDay.isBefore(availEnd) || selectedDay.isSame(availEnd))
    )
  })

  // Extract time slots from availabilities and sort by start time
  const allSlots: Array<SlotData> = matchingAvailabilities
    .map((availability, index) => {
      const availabilityStart = dayjs(availability.start_date)
      const availabilityEnd = dayjs(availability.end_date)

      return {
        id: availability.id || `slot-${index}`,
        start: availabilityStart,
        end: availabilityEnd,
        startTime: availabilityStart.format('HH:mm'),
        endTime: availabilityEnd.format('HH:mm'),
        availability,
      }
    })
    .sort((a, b) => a.start.valueOf() - b.start.valueOf())

  if (!tourDurationMinutes || allSlots.length === 0) {
    // If no tour duration specified, return all slots
    return allSlots.map((slot) => ({
      id: slot.id,
      startTime: slot.startTime,
      endTime: slot.endTime,
      availability: slot.availability,
    }))
  }

  const validSlots: Array<TimeSlot> = []

  // For each slot, check if we can start the tour at its start time
  for (let i = 0; i < allSlots.length; i++) {
    const startSlot = allSlots[i]
    const tourStart = startSlot.start
    const tourEnd = tourStart.add(tourDurationMinutes, 'minute')

    // Check if the tour can fit by looking at consecutive slots
    let currentEnd = startSlot.end
    let slotIndex = i

    // Look ahead to see if consecutive slots can accommodate the tour
    while (slotIndex < allSlots.length && tourEnd.isAfter(currentEnd)) {
      const currentSlot = allSlots[slotIndex]

      // Check if there's a next slot and if slots are consecutive
      if (slotIndex < allSlots.length - 1) {
        const nextSlot = allSlots[slotIndex + 1]
        // Slots are consecutive if current ends at or after next starts (touching or overlapping)
        if (currentSlot.end.isSame(nextSlot.start) || currentSlot.end.isAfter(nextSlot.start)) {
          // Consecutive or overlapping - extend the available time
          currentEnd = nextSlot.end
          slotIndex++
        } else {
          // Gap between slots, tour cannot span
          break
        }
      } else {
        // Last slot, cannot extend further
        break
      }
    }

    // If tour end time fits within the available consecutive slots
    if (tourEnd.isBefore(currentEnd) || tourEnd.isSame(currentEnd)) {
      validSlots.push({
        id: startSlot.id,
        startTime: startSlot.startTime,
        endTime: tourEnd.format('HH:mm'),
        availability: startSlot.availability,
      })
    }
  }

  return validSlots
}

interface AvailabilitiesListProps {
  selectedDate: Date
  availabilities: Array<GuideAvailabilityDto>
  tourDurationMinutes?: number
  selectedAvailabilityId?: string
  reservedAvailabilityIds?: Set<string>
  onAvailabilityClick?: (availability: GuideAvailabilityDto) => void
}

export function AvailabilitiesList({
  selectedDate,
  availabilities,
  tourDurationMinutes,
  selectedAvailabilityId,
  reservedAvailabilityIds = new Set(),
  onAvailabilityClick,
}: AvailabilitiesListProps) {
  const availableTimeSlots = calculateValidTimeSlots(selectedDate, availabilities, tourDurationMinutes)
    
  

  if (availableTimeSlots.length === 0) {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">
            Available time slots for {dayjs(selectedDate).format('MMMM D, YYYY')}
          </h3>
          <p className="text-muted-foreground">No time slots available for this date.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">
          Available time slots for {dayjs(selectedDate).format('MMMM D, YYYY')}
        </h3>
        {/* <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2"> */}
        <ul className="flex flex-wrap gap-2">
          {availableTimeSlots.map((slot) => {
            const isReserved = reservedAvailabilityIds.has(slot.id)
            return (
              <Availability
                key={slot.id}
                id={slot.id}
                startTime={slot.startTime}
                endTime={slot.endTime}
                isActive={selectedAvailabilityId === slot.id}
                isReserved={isReserved}
                onClick={() => onAvailabilityClick?.(slot.availability)}
              />
            )
          })}
        </ul>
      </div>
    </div>
  )
}

