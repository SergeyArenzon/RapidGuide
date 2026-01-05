import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import type { CalendarEvent } from '@/components/calendar/calendar-types'
import Calendar from '@/components/calendar/calendar'


export const Route = createFileRoute(
  '/_authenticated/guide/calendar/',
)({
  component: RouteComponent,
  staticData: {
    label: 'Calendar',
    description: 'Manage your calendar',
    showBreadcrumb: true,
  },
})



// Generate demo calendar events
const generateDemoEvents = (): Array<CalendarEvent> => {
    const today = new Date()
    const events: Array<CalendarEvent> = []
    
    // Helper to create a date with specific time
    const createDate = (daysOffset: number, hours: number, minutes: number = 0) => {
      const date = new Date(today)
      date.setDate(date.getDate() + daysOffset)
      date.setHours(hours, minutes, 0, 0)
      return date
    }
  
    // Helper to create an end date (defaults to 1 hour after start)
    const createEndDate = (startDate: Date, hours: number = 1, minutes: number = 0) => {
      const endDate = new Date(startDate)
      endDate.setHours(endDate.getHours() + hours, endDate.getMinutes() + minutes)
      return endDate
    }
  
    // // Today's events
    // events.push({
    //   id: '1',
    //   title: 'Morning Tour',
    //   color: '#3b82f6', // blue
    //   start: createDate(0, 9, 0),
    //   end: createEndDate(createDate(0, 9, 0), 2),
    // })
    // events.push({
    //   id: '2',
    //   title: 'Afternoon Session',
    //   color: 'black', // green
    //   start: createDate(0, 14, 0),
    //   end: createEndDate(createDate(0, 14, 0), 3),
    // })
  
    // // Tomorrow's events
    // events.push({
    //   id: '3',
    //   title: 'City Walk Tour',
    //   color: 'yellow', // purple
    //   start: createDate(1, 10, 30),
    //   end: createEndDate(createDate(1, 10, 30), 2, 30),
    // })
    // events.push({
    //   id: '4',
    //   title: 'Evening Group',
    //   color: 'red', // amber
    //   start: createDate(1, 17, 0),
    //   end: createEndDate(createDate(1, 17, 0), 2),
    // })
  
    // // Day after tomorrow
    // events.push({
    //   id: '5',
    //   title: 'Full Day Experience',
    //   color: '#ef4444', // red
    //   start: createDate(2, 8, 0),
    //   end: createEndDate(createDate(2, 8, 0), 8),
    // })
  
    // // 3 days from now
    // events.push({
    //   id: '6',
    //   title: 'Morning Hike',
    //   color: '#06b6d4', // cyan
    //   start: createDate(3, 7, 0),
    //   end: createEndDate(createDate(3, 7, 0), 4),
    // })
    // events.push({
    //   id: '7',
    //   title: 'Sunset Tour',
    //   color: '#ec4899', // pink
    //   start: createDate(3, 18, 0),
    //   end: createEndDate(createDate(3, 18, 0), 2),
    // })
  
    // // 5 days from now
    // events.push({
    //   id: '8',
    //   title: 'Weekend Special',
    //   color: '#14b8a6', // teal
    //   start: createDate(5, 11, 0),
    //   end: createEndDate(createDate(5, 11, 0), 5),
    // })
  
    // // 7 days from now (next week)
    // events.push({
    //   id: '9',
    //   title: 'Early Bird Tour',
    //   color: '#6366f1', // indigo
    //   start: createDate(7, 6, 30),
    //   end: createEndDate(createDate(7, 6, 30), 3),
    // })
    // events.push({
    //   id: '10',
    //   title: 'Lunch Break Session',
    //   color: '#f97316', // orange
    //   start: createDate(7, 12, 0),
    //   end: createEndDate(createDate(7, 12, 0), 1, 30),
    // })
  
    // // 10 days from now
    // events.push({
    //   id: '11',
    //   title: 'Multi-Day Event',
    //   color: '#84cc16', // lime
    //   start: createDate(10, 9, 0),
    //   end: createEndDate(createDate(10, 9, 0), 6),
    // })
  
    // // 14 days from now
    // events.push({
    //   id: '12',
    //   title: 'Special Event',
    //   color: '#a855f7', // violet
    //   start: createDate(14, 15, 0),
    //   end: createEndDate(createDate(14, 15, 0), 4),
    // })
  
    return events
  }

  

function RouteComponent() {
    // Calendar state
  const [calendarEvents, setCalendarEvents] = useState<Array<CalendarEvent>>(generateDemoEvents())
  const [calendarMode, setCalendarMode] = useState<'day' | 'week' | 'month'>('month')
  const [calendarDate, setCalendarDate] = useState<Date>(new Date())

  return (
      <Calendar
        events={calendarEvents}
        setEvents={setCalendarEvents}
        mode={calendarMode}
        setMode={setCalendarMode}
        date={calendarDate}
        setDate={setCalendarDate}
      />
  )
}
