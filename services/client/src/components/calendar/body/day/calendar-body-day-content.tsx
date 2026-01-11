import dayjs from 'dayjs'
import { useCalendarContext } from '../../calendar-context'
import CalendarBodyHeader from '../calendar-body-header'
import CalendarEvent from '../../calendar-event'
import { hours } from './calendar-body-margin-day-margin'

export default function CalendarBodyDayContent({ date }: { date: Date }) {
  const { events, editAvailabilityMode, availabilityChanges = [], setAvailabilityChanges } = useCalendarContext()

  const dayEvents = events.filter((event) => dayjs(event.start).isSame(dayjs(date), 'day'))
  
  // Get availability changes for this specific day
  const dayAvailabilityChanges = availabilityChanges.filter((change) =>
    dayjs(change.start_date).isSame(dayjs(date), 'day')
  )
  
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
          
          return (
            <div 
              key={hour} 
              className={`h-32 border-b border-border/50 group 
                ${isSelected ? '' : 'bg-secondary'}
                ${editAvailabilityMode ? 'cursor-pointer' : ''}`} 
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
