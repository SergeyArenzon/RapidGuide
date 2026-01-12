import { useCalendarContext } from '../../calendar-context'
import dayjs from 'dayjs'
import CalendarBodyMarginDayMargin from '../day/calendar-body-margin-day-margin'
import CalendarBodyDayContent from '../day/calendar-body-day-content'
export default function CalendarBodyWeek() {
  const { date } = useCalendarContext()

  // dayjs week starts on Sunday (0), so we need to adjust for Monday (1)
  const getMonday = (date: Date) => {
    const d = dayjs(date)
    const day = d.day() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    return d.subtract((day || 7) - 1, 'day').startOf('day')
  }
  const weekStart = getMonday(date).toDate()
  const weekDays = Array.from({ length: 7 }, (_, i) => dayjs(weekStart).add(i, 'day').toDate())

  return (
    <div className="flex divide-x flex-grow overflow-hidden">
      <div className="flex flex-col flex-grow divide-y overflow-hidden">
        <div className="flex flex-col flex-1 overflow-y-auto">
          <div className="relative flex flex-1 divide-x flex-col md:flex-row">
            <CalendarBodyMarginDayMargin className="hidden md:block" />
            {weekDays.map((day) => (
              <div
                key={day.toISOString()}
                className="flex flex-1 divide-x md:divide-x-0"
              >
                <CalendarBodyMarginDayMargin className="block md:hidden" />
                <CalendarBodyDayContent date={day} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
