import CalendarHeader from './header/calendar-header'
import CalendarBody from './body/calendar-body'
import CalendarHeaderActions from './header/actions/calendar-header-actions'
import CalendarHeaderDate from './header/date/calendar-header-date'
import CalendarHeaderActionsMode from './header/actions/calendar-header-actions-mode'
import CalendarHeaderActionsAdd from './header/actions/calendar-header-actions-add'
import CalendarProvider from './calendar-provider'
import type { CalendarProps } from './calendar-types'
import CalendarHeaderActionsEditAvailability from './header/actions/calendar-header-actions-edit-availability'
import CalendarHeaderActionsSaveAvailability from './header/actions/calendar-header-actions-save-availability'
import { useCalendarContext } from './calendar-context'

function CalendarHeaderContent() {
  const { editAvailabilityMode } = useCalendarContext()
  
  return (
    <CalendarHeader>
      <CalendarHeaderDate />
      <CalendarHeaderActions>
        {!editAvailabilityMode && <CalendarHeaderActionsMode />}
        {/* <CalendarHeaderActionsAdd /> */}
        <CalendarHeaderActionsEditAvailability />
        <CalendarHeaderActionsSaveAvailability />
      </CalendarHeaderActions>
    </CalendarHeader>
  )
}

export default function hoCalendar({
  events,
  setEvents,
  mode,
  setMode,
  date,
  setDate,
  editAvailabilityMode = false,
  calendarIconIsToday = true,
  availabilities,
}: CalendarProps) {
  return (
    <CalendarProvider
      events={events}
      setEvents={setEvents}
      mode={mode}
      editAvailabilityMode={editAvailabilityMode}
      setMode={setMode}
      date={date}
      setDate={setDate}
      calendarIconIsToday={calendarIconIsToday}
      availabilities={availabilities}
    >
      <CalendarHeaderContent />
      <CalendarBody />
    </CalendarProvider>
  )
}
