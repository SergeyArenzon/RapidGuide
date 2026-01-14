export type CalendarProps = {
  events: CalendarEvent[]
  setEvents: (events: CalendarEvent[]) => void
  mode: Mode
  setMode: (mode: Mode) => void
  date: Date
  setDate: (date: Date) => void
  calendarIconIsToday?: boolean,
  editAvailabilityMode?: boolean
}

export type AvailabilityChange = {
  start_date: Date
  end_date: Date
}

export type CalendarContextType = CalendarProps & {
  newEventDialogOpen: boolean
  setNewEventDialogOpen: (open: boolean) => void
  manageEventDialogOpen: boolean
  setManageEventDialogOpen: (open: boolean) => void
  selectedEvent: CalendarEvent | null
  setSelectedEvent: (event: CalendarEvent | null) => void
  editAvailabilityMode?: boolean
  setEditAvailabilityMode?: (editAvailabilityMode: boolean) => void
  availabilityChanges?: AvailabilityChange[]
  setAvailabilityChanges?: (changes: AvailabilityChange[]) => void
  hasAvailabilityChanges?: boolean
}
export type CalendarEvent = {
  id: string
  title: string
  color: string
  start: Date
  end: Date
}

export const calendarModes = ['day', 'week', 'month'] as const
export type Mode = (typeof calendarModes)[number]
