import { format, isSameDay } from 'date-fns'
import { cn } from '../../../lib/utils'
import { useCalendarContext } from '../calendar-context'
import dayjs from 'dayjs'

export default function CalendarBodyHeader({
  date,
  onlyDay = false,
}: {
  date: Date
  onlyDay?: boolean
}) {
  const { availabilities = [] } = useCalendarContext()
  const isToday = isSameDay(date, new Date())
  
  // Check if this day has any availabilities
  const hasAvailability = availabilities.some((availability) => {
    const availStart = dayjs(availability.start_date).startOf('day')
    const availEnd = dayjs(availability.end_date).startOf('day')
    const dayStart = dayjs(date).startOf('day')
    
    return (dayStart.isAfter(availStart) || dayStart.isSame(availStart)) &&
           (dayStart.isBefore(availEnd) || dayStart.isSame(availEnd))
  })

  return (
    <div className="flex items-center justify-center gap-1 py-2 w-full sticky top-0 bg-background z-10 border-b">
      <span
        className={cn(
          'text-xs font-medium',
          isToday ? 'text-primary' : 'text-muted-foreground'
        )}
      >
        {format(date, 'EEE')}
      </span>
      {!onlyDay && (
        <span
          className={cn(
            'text-xs font-medium',
            isToday ? 'text-primary font-bold' : 'text-foreground'
          )}
        >
          {format(date, 'dd')}
        </span>
      )}
    </div>
  )
}
