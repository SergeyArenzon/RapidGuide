export type CalendarProps = {
  events: Array<CalendarEvent>
  setEvents: (events: Array<CalendarEvent>) => void
  mode: Mode
  setMode: (mode: Mode) => void
  date: Date
  setDate: (date: Date) => void
  calendarIconIsToday?: boolean,
  editAvailabilityMode?: boolean
  availabilities?: Array<{ id: string; start_date: Date; end_date: Date }>
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
  availabilityChanges?: Array<AvailabilityChange>
  setAvailabilityChanges?: (changes: Array<AvailabilityChange>) => void
  availabilityDeletions?: Array<string>
  setAvailabilityDeletions?: (deletions: Array<string>) => void
  hasAvailabilityChanges?: boolean
  availabilities?: Array<{ id: string; start_date: Date; end_date: Date }>
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
