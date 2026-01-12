import dayjs from 'dayjs'
import { useCalendarContext } from '../../calendar-context'
import CalendarBodyHeader from '../calendar-body-header'
import CalendarEvent from '../../calendar-event'
import { hours } from './calendar-body-margin-day-margin'

export default function CalendarBodyDayContent({ date }: { date: Date }) {
  const { events, availabilities = [] } = useCalendarContext()

  const dayEvents = events.filter((event) => dayjs(event.start).isSame(dayjs(date), 'day'))
  
  // Helper function to check if an hour slot overlaps with any availability
  const isHourAvailable = (hourDate: Date, endDate: Date): boolean => {
    if (availabilities.length === 0) return false
    
    const hourStart = dayjs(hourDate)
    const hourEnd = dayjs(endDate)
    
    return availabilities.some((availability) => {
      const availStart = dayjs(availability.start_date)
      const availEnd = dayjs(availability.end_date)
      // Two intervals [a, b] and [c, d] overlap if: a < d && b > c
      return hourStart.isBefore(availEnd) && hourEnd.isAfter(availStart)
    })
  }
  
  return (
    <div className="flex flex-col grow">
      <CalendarBodyHeader date={date} />

      <div className="flex-1 relative">
        {hours.map((hour) => {
          const hourDate = dayjs(date).hour(hour).minute(0).second(0).millisecond(0).toDate()
          const endDate = dayjs(hourDate).add(1, 'hour').toDate()
          const isAvailable = isHourAvailable(hourDate, endDate)
          
          const bgClass = isAvailable
            ? 'bg-primary/30 dark:bg-primary/25 border-l-2 border-l-primary'
            : 'bg-secondary/30'
          
          return (
            <div 
              key={hour}
              className={`h-32 border-b border-border/50 group relative ${bgClass}`}
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
