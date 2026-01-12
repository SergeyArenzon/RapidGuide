import dayjs from 'dayjs'
import { useCalendarContext } from '../../calendar-context'
export default function CalendarHeaderDateIcon() {
  const { calendarIconIsToday, date: calendarDate } = useCalendarContext()
  const date = calendarIconIsToday ? new Date() : calendarDate
  return (
    <div className="flex size-14 flex-col items-start overflow-hidden rounded-lg border">
      <p className="flex h-6 w-full items-center justify-center bg-primary text-center text-xs font-semibold text-background uppercase">
        {dayjs(date).format('MMM')}
      </p>
      <p className="flex w-full items-center justify-center text-lg font-bold">
        {dayjs(date).format('DD')}
      </p>
    </div>
  )
}
