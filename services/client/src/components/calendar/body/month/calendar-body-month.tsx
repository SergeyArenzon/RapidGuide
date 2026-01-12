import dayjs from 'dayjs'
import { AnimatePresence, motion } from 'framer-motion'
import { useCalendarContext } from '../../calendar-context'
import CalendarEvent from '../../calendar-event'
import { cn } from '@/lib/utils'

export default function CalendarBodyMonth() {
  const { date, events, setDate, setMode } = useCalendarContext()

  // Get the first day of the month
  const monthStart = dayjs(date).startOf('month').toDate()
  // Get the last day of the month
  const monthEnd = dayjs(date).endOf('month').toDate()

  // Get the first Monday of the first week (may be in previous month)
  // dayjs week starts on Sunday (0), so we need to adjust for Monday (1)
  const getMonday = (date: Date) => {
    const d = dayjs(date)
    const day = d.day() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    return d.subtract((day || 7) - 1, 'day').startOf('day')
  }
  const calendarStart = getMonday(monthStart).toDate()
  // Get the last Sunday of the last week (may be in next month)
  const calendarEnd = getMonday(monthEnd).add(6, 'day').toDate()

  // Get all days between start and end
  const calendarDays: Date[] = []
  let currentDay = dayjs(calendarStart)
  const endDay = dayjs(calendarEnd)
  while (currentDay.isBefore(endDay) || currentDay.isSame(endDay, 'day')) {
    calendarDays.push(currentDay.toDate())
    currentDay = currentDay.add(1, 'day')
  }

  const today = new Date()

  // Filter events to only show those within the current month view
  const visibleEvents = events.filter(
    (event) => {
      const eventStart = dayjs(event.start)
      const eventEnd = dayjs(event.end)
      const start = dayjs(calendarStart)
      const end = dayjs(calendarEnd)
      return (
        (eventStart.isAfter(start) || eventStart.isSame(start, 'day')) &&
        (eventStart.isBefore(end) || eventStart.isSame(end, 'day'))
      ) || (
        (eventEnd.isAfter(start) || eventEnd.isSame(start, 'day')) &&
        (eventEnd.isBefore(end) || eventEnd.isSame(end, 'day'))
      )
    }
  )

  return (
    <div className="flex flex-col grow overflow-hidden">
      <div className="hidden md:grid grid-cols-7 border-border divide-x divide-border">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <div
            key={day}
            className="py-2 text-center text-sm font-medium text-muted-foreground border-b border-border"
          >
            {day}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={monthStart.toISOString()}
          className="grid md:grid-cols-7 grow overflow-y-auto relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.2,
            ease: 'easeInOut',
          }}
        >
          {calendarDays.map((day) => {
            const dayEvents = visibleEvents.filter((event) =>
              dayjs(event.start).isSame(dayjs(day), 'day')
            )
            const isToday = dayjs(day).isSame(dayjs(today), 'day')
            const isCurrentMonth = dayjs(day).isSame(dayjs(date), 'month')

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  'relative flex flex-col border-b border-r p-2 aspect-square cursor-pointer',
                  !isCurrentMonth && 'bg-muted/50 hidden md:flex'
                )}
                onClick={(e) => {
                  e.stopPropagation()
                  setDate(day)
                  setMode('day')
                }}
              >
                <div
                  className={cn(
                    'text-sm font-medium w-fit p-1 flex flex-col items-center justify-center rounded-full aspect-square',
                    isToday && 'bg-primary text-background'
                  )}
                >
                  {dayjs(day).format('D')}
                </div>
                <AnimatePresence mode="wait">
                  <div className="flex flex-col gap-1 mt-1">
                    {/* Show events */}
                    {dayEvents.slice(0, 3).map((event) => (
                      <CalendarEvent
                        key={event.id}
                        event={event}
                        className="relative h-auto"
                        month
                      />
                    ))}
                    {dayEvents.length > 3 && (
                      <motion.div
                        key={`more-${day.toISOString()}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: 0.2,
                        }}
                        className="text-xs text-muted-foreground"
                        onClick={(e) => {
                          e.stopPropagation()
                          setDate(day)
                          setMode('day')
                        }}
                      >
                        +{dayEvents.length - 3} more
                      </motion.div>
                    )}
                  </div>
                </AnimatePresence>
              </div>
            )
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
