import dayjs from 'dayjs'
import { useState } from 'react'
import { useCalendarContext } from '../../calendar-context'
import CalendarBodyHeader from '../calendar-body-header'
import CalendarEvent from '../../calendar-event'
import { hours } from './calendar-body-margin-day-margin'

export default function CalendarBodyDayContent({ date }: { date: Date }) {
  const { events } = useCalendarContext()

  const dayEvents = events.filter((event) => dayjs(event.start).isSame(dayjs(date), 'day'))

  const [startHour, setStartHour] = useState<Array<{start_date: Date, end_date: Date}>>([])
  console.log({startHour});
  
  
  return (
    <div className="flex flex-col grow">
      <CalendarBodyHeader date={date} />

      <div className="flex-1 relative">
        {hours.map((hour) => {
          const hourDate = dayjs(date).hour(hour).minute(0).second(0).millisecond(0).toDate()
          const endDate = dayjs(hourDate).add(1, 'hour').toDate()
          const isSelected = startHour.some((h) => 
            dayjs(h.start_date).isSame(dayjs(date), 'day') && dayjs(h.start_date).hour() === hour
          )
          
          return (
            <div 
              key={hour} 
              className={`h-32 border-b border-border/50 group 
                ${isSelected ? '' : 'bg-secondary'}`} 
              onClick={() => setStartHour([...startHour, { start_date: hourDate, end_date: endDate }])} 
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
