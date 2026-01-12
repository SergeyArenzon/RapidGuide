import dayjs from 'dayjs'
import { useCalendarContext } from '../../calendar-context'
import CalendarBodyHeader from '../calendar-body-header'
import CalendarEvent from '../../calendar-event'
import { hours } from './calendar-body-margin-day-margin'
import { useState } from 'react'
import { Trash2 } from 'lucide-react'

export default function CalendarBodyDayContent({ date }: { date: Date }) {
  const { events, editAvailabilityMode, availabilityChanges = [], setAvailabilityChanges, availabilityDeletions = [], setAvailabilityDeletions, availabilities = [] } = useCalendarContext()
  const [hoveredAvailabilityId, setHoveredAvailabilityId] = useState<string | null>(null)

  const handleMarkForDeletion = (e: React.MouseEvent, availabilityId: string) => {
    e.stopPropagation()
    if (setAvailabilityDeletions) {
      if (availabilityDeletions.includes(availabilityId)) {
        // Remove from deletions if already marked
        setAvailabilityDeletions(availabilityDeletions.filter(id => id !== availabilityId))
      } else {
        // Add to deletions
        setAvailabilityDeletions([...availabilityDeletions, availabilityId])
      }
    }
  }

  const dayEvents = events.filter((event) => dayjs(event.start).isSame(dayjs(date), 'day'))
  
  // Get availability changes for this specific day
  const dayAvailabilityChanges = availabilityChanges.filter((change) =>
    dayjs(change.start_date).isSame(dayjs(date), 'day')
  )
  
  // Helper function to check if an hour slot falls within any availability range
  const isHourAvailable = (hourDate: Date, endDate: Date): boolean => {
    if (availabilities.length === 0) return false
    
    return availabilities.some((availability) => {
      const availStart = dayjs(availability.start_date)
      const availEnd = dayjs(availability.end_date)
      const hourStart = dayjs(hourDate)
      const hourEnd = dayjs(endDate)
      
      // Check if the hour slot overlaps with the availability range
      // Two intervals [a, b] and [c, d] overlap if: a < d && b > c
      return hourStart.isBefore(availEnd) && hourEnd.isAfter(availStart)
    })
  }

  // Helper function to get the availability ID for an hour slot
  const getAvailabilityIdForHour = (hourDate: Date, endDate: Date): string | null => {
    if (availabilities.length === 0) return null
    
    const matchingAvailability = availabilities.find((availability) => {
      const availStart = dayjs(availability.start_date)
      const availEnd = dayjs(availability.end_date)
      const hourStart = dayjs(hourDate)
      const hourEnd = dayjs(endDate)
      
      return hourStart.isBefore(availEnd) && hourEnd.isAfter(availStart)
    })
    
    return matchingAvailability?.id || null
  }
  
  const toggleHourSelection = (hourDate: Date, endDate: Date) => {
    if (!editAvailabilityMode || !setAvailabilityChanges) return
    
    // Check if this hour slot already exists
    const existingIndex = availabilityChanges.findIndex((change) => {
      const isSameDay = dayjs(change.start_date).isSame(dayjs(hourDate), 'day')
      const isSameHour = dayjs(change.start_date).hour() === dayjs(hourDate).hour()
      return isSameDay && isSameHour
    })
    
    if (existingIndex >= 0) {
      // Remove if already exists (toggle behavior)
      const updatedChanges = availabilityChanges.filter((_, index) => index !== existingIndex)
      setAvailabilityChanges(updatedChanges)
    } else {
      // Add new change
      setAvailabilityChanges([...availabilityChanges, { start_date: hourDate, end_date: endDate }])
    }
  }
  
  return (
    <div className="flex flex-col grow">
      <CalendarBodyHeader date={date} />

      <div className="flex-1 relative">
        {hours.map((hour) => {
          const hourDate = dayjs(date).hour(hour).minute(0).second(0).millisecond(0).toDate()
          const endDate = dayjs(hourDate).add(1, 'hour').toDate()
          const isSelected = dayAvailabilityChanges.some((h) => 
            dayjs(h.start_date).hour() === hour
          )
          const isAvailable = isHourAvailable(hourDate, endDate)
          const availabilityId = getAvailabilityIdForHour(hourDate, endDate)
          const isHovered = hoveredAvailabilityId === availabilityId
          const isMarkedForDeletion = availabilityId ? availabilityDeletions.includes(availabilityId) : false
          
          // Determine background class - prioritize selected, then marked for deletion, then available, then default
          let bgClass = 'bg-secondary/30'
          if (isSelected) {
            bgClass = 'bg-primary/20 border-l-2 border-l-primary'
          } else if (isMarkedForDeletion) {
            bgClass = 'bg-destructive/20 dark:bg-destructive/30 border-l-2 border-l-destructive'
          } else if (isAvailable && editAvailabilityMode) {
            bgClass = 'bg-primary/50 dark:bg-primary/40 border-l-2 border-l-primary'
          } else if (isAvailable) {
            bgClass = 'bg-primary/25 dark:bg-primary/35 border-l-2 border-l-primary'
          }
          
          const hoverClass = editAvailabilityMode
            ? 'hover:bg-primary/25 transition-colors duration-150' 
            : isAvailable
            ? 'hover:bg-primary/35 dark:hover:bg-primary/45 transition-colors duration-150'
            : ''
          
          return (
            <div 
              key={hour}
              className={`h-32 border-b border-border/50 group relative ${bgClass} ${hoverClass} ${editAvailabilityMode ? 'cursor-pointer select-none' : isAvailable ? 'cursor-pointer' : ''}`}
              onClick={(e) => {
                if (editAvailabilityMode) {
                  if (isAvailable && availabilityId) {
                    handleMarkForDeletion(e, availabilityId)
                  } else {
                    toggleHourSelection(hourDate, endDate)
                  }
                }
              }}
              onMouseEnter={() => {
                if (editAvailabilityMode && availabilityId) {
                  setHoveredAvailabilityId(availabilityId)
                }
              }}
              onMouseLeave={() => {
                if (editAvailabilityMode) {
                  setHoveredAvailabilityId(null)
                }
              }}
            >
              {editAvailabilityMode && isSelected && (
                <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-primary" />
              )}
              {editAvailabilityMode && isAvailable && isHovered && availabilityId && !isMarkedForDeletion && (
                <div className="absolute top-1 right-1 p-1 bg-destructive rounded hover:bg-destructive/90 transition-colors">
                  <Trash2 className="w-3 h-3 text-white" />
                </div>
              )}
              {editAvailabilityMode && isMarkedForDeletion && availabilityId && (
                <div className="absolute top-1 right-1 p-1 bg-destructive rounded">
                  <Trash2 className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          )
        })}

        {dayEvents.map((event) => (
          <CalendarEvent key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}
