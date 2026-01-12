import { Button } from '@/components/ui/button'
import { useCalendarContext } from '../../calendar-context'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import dayjs from 'dayjs'

export default function CalendarHeaderDateChevrons() {
  const { mode, date, setDate } = useCalendarContext()

  function handleDateBackward() {
    switch (mode) {
      case 'month':
        setDate(dayjs(date).subtract(1, 'month').toDate())
        break
      case 'week':
        setDate(dayjs(date).subtract(1, 'week').toDate())
        break
      case 'day':
        setDate(dayjs(date).subtract(1, 'day').toDate())
        break
    }
  }

  function handleDateForward() {
    switch (mode) {
      case 'month':
        setDate(dayjs(date).add(1, 'month').toDate())
        break
      case 'week':
        setDate(dayjs(date).add(1, 'week').toDate())
        break
      case 'day':
        setDate(dayjs(date).add(1, 'day').toDate())
        break
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        className="h-7 w-7 p-1"
        onClick={handleDateBackward}
      >
        <ChevronLeft className="min-w-5 min-h-5" />
      </Button>

      <span className="min-w-[140px] text-center font-medium">
        {dayjs(date).format('MMMM D, YYYY')}
      </span>

      <Button
        variant="outline"
        className="h-7 w-7 p-1"
        onClick={handleDateForward}
      >
        <ChevronRight className="min-w-5 min-h-5" />
      </Button>
    </div>
  )
}
