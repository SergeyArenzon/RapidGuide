import { useState } from 'react'
import { CalendarContext } from './calendar-context'
import CalendarNewEventDialog from './dialog/calendar-new-event-dialog'
import CalendarManageEventDialog from './dialog/calendar-manage-event-dialog'
import type { CalendarEvent, Mode, AvailabilityChange } from './calendar-types'

export default function CalendarProvider({
  events,
  setEvents,
  mode,
  setMode,
  date,
  setDate,
  calendarIconIsToday = true,
  editAvailabilityMode: initialEditAvailabilityMode = false,
  availabilities,
  children,
}: {
  events: Array<CalendarEvent>
  setEvents: (events: Array<CalendarEvent>) => void
  mode: Mode
  setMode: (mode: Mode) => void
  date: Date
  setDate: (date: Date) => void
  calendarIconIsToday: boolean
  editAvailabilityMode: boolean
  availabilities?: Array<{ start_date: Date; end_date: Date }>
  children: React.ReactNode
}) {
  const [newEventDialogOpen, setNewEventDialogOpen] = useState(false)
  const [manageEventDialogOpen, setManageEventDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [editAvailabilityMode, setEditAvailabilityMode] = useState(initialEditAvailabilityMode)
  const [availabilityChanges, setAvailabilityChanges] = useState<AvailabilityChange[]>([])

  // Reset availability changes when exiting edit mode
  const handleSetEditAvailabilityMode = (value: boolean) => {
    setEditAvailabilityMode(value)
    if (!value) {
      setAvailabilityChanges([])
    }
  }

  const hasAvailabilityChanges = availabilityChanges.length > 0

  return (
    <CalendarContext.Provider
      value={{
        events,
        setEvents,
        mode,
        setMode,
        date,
        setDate,
        calendarIconIsToday,
        editAvailabilityMode,
        setEditAvailabilityMode: handleSetEditAvailabilityMode,
        newEventDialogOpen,
        setNewEventDialogOpen,
        manageEventDialogOpen,
        setManageEventDialogOpen,
        selectedEvent,
        setSelectedEvent,
        availabilityChanges,
        setAvailabilityChanges,
        hasAvailabilityChanges,
        availabilities,
      }}
    >
      <CalendarNewEventDialog />
      <CalendarManageEventDialog />
      {children}
    </CalendarContext.Provider>
  )
}
