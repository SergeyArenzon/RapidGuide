import React from 'react'
import dayjs from 'dayjs'
import { useCalendarContext } from '../../calendar-context'
import CalendarBodyHeader from '../calendar-body-header'
import CalendarEvent from '../../calendar-event'
import { hours } from './calendar-body-margin-day-margin'

export default function CalendarBodyDayContent({ date }: { date: Date }) {
  const { events, editAvailabilityMode, availabilityChanges = [], setAvailabilityChanges, availabilities = [] } = useCalendarContext()

  // Debug: log availabilities for this component
  React.useEffect(() => {
    if (availabilities.length > 0) {
      console.log('CalendarBodyDayContent - availabilities:', availabilities)
      console.log('CalendarBodyDayContent - date:', date)
    }
  }, [availabilities, date])

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
  
  const onEditAvailabilityClick = (hourDate: Date, endDate: Date) => {
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
          
          // Determine background class - prioritize selected, then available, then default
          let bgClass = 'bg-secondary'
          if (isSelected) {
            bgClass = ''
          } else if (isAvailable) {
            bgClass = 'bg-green-50 dark:bg-green-950/20'
          }
          
          return (
            <div 
              key={hour} 
              className={`h-32 border-b border-border/50 group ${bgClass} ${editAvailabilityMode ? 'cursor-pointer' : ''}`} 
              onClick={() => onEditAvailabilityClick( hourDate, endDate )} 
            />
          )
        })}

        {dayEvents.map((event) => (
          <CalendarEvent key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}
