import dayjs from 'dayjs'
import { cn } from '../../../lib/utils'
import { useCalendarContext } from '../calendar-context'

export default function CalendarBodyHeader({
  date,
  onlyDay = false,
}: {
  date: Date
  onlyDay?: boolean
}) {
  const { availabilities = [] } = useCalendarContext()
  const isToday = dayjs(date).isSame(dayjs(), 'day')
  
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
        {dayjs(date).format('ddd')}
      </span>
      {!onlyDay && (
        <span
          className={cn(
            'text-xs font-medium',
            isToday ? 'text-primary font-bold' : 'text-foreground'
          )}
        >
          {dayjs(date).format('DD')}
        </span>
      )}
    </div>
  )
}
