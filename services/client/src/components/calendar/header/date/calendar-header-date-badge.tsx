import { useCalendarContext } from '../../calendar-context'
import dayjs from 'dayjs'

export default function CalendarHeaderDateBadge() {
  const { events, date } = useCalendarContext()
  const monthEvents = events.filter((event) => dayjs(event.start).isSame(date, 'month'))

  if (!monthEvents.length) return null
  return (
    <div className="whitespace-nowrap rounded-sm border px-1.5 py-0.5 text-xs">
      {monthEvents.length} events
    </div>
  )
}
