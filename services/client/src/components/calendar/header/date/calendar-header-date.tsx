import { useCalendarContext } from '../../calendar-context'
import dayjs from 'dayjs'
import CalendarHeaderDateIcon from './calendar-header-date-icon'
import CalendarHeaderDateChevrons from './calendar-header-date-chevrons'
import CalendarHeaderDateBadge from './calendar-header-date-badge'
import CalendarHeaderDateEditModeBadge from './calendar-header-date-edit-mode-badge'

export default function CalendarHeaderDate() {
  const { date } = useCalendarContext()
  return (
    <div className="flex items-center gap-2">
      <CalendarHeaderDateIcon />
      <div>
        <div className="flex items-center gap-1 flex-wrap">
          <p className="text-lg font-semibold">{dayjs(date).format('MMMM YYYY')}</p>
          <CalendarHeaderDateBadge />
          <CalendarHeaderDateEditModeBadge />
        </div>
        <CalendarHeaderDateChevrons />
      </div>
    </div>
  )
}
