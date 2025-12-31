import { createFileRoute } from '@tanstack/react-router'
import { useState } from "react"
import { AlertCircle, Plus, Save, X, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

interface TimeSlot {
  id: string
  dayOfWeek: number
  startTime: string
  endTime: string
}

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export const Route = createFileRoute('/_authenticated/guide/preferences/time-slots/')({
  component: TimeSlotsPage,
  staticData: {
    label: 'Time Slots',
    description: 'Manage your available time slots.',
    showBreadcrumb: true,
  },
})

function TimeSlotsPage() {

    const [timeSlots, setTimeSlots] = useState<Array<TimeSlot>>([
        {
          id: "1",
          dayOfWeek: 1,
          startTime: "09:00",
          endTime: "13:00",
        },
      ])
    
      const [collisionError, setCollisionError] = useState<string | null>(null)
    
      const [quickFromDay, setQuickFromDay] = useState(0)
      const [quickToDay, setQuickToDay] = useState(5)
      const [quickStartTime, setQuickStartTime] = useState("09:00")
      const [quickEndTime, setQuickEndTime] = useState("12:00")

    const hasTimeCollision = (
        newSlots: Array<Omit<TimeSlot, "id">>,
        existingSlots: Array<TimeSlot> = timeSlots,
      ): { hasCollision: boolean; message: string } => {
        const timeToMinutes = (time: string) => {
          const [hours, minutes] = time.split(":").map(Number)
          return hours * 60 + minutes
        }
    
        for (const newSlot of newSlots) {
          const newStart = timeToMinutes(newSlot.startTime)
          const newEnd = timeToMinutes(newSlot.endTime)
    
          if (newStart >= newEnd) {
            return {
              hasCollision: true,
              message: "Start time must be before end time",
            }
          }
    
          for (const existingSlot of existingSlots) {
            if (existingSlot.dayOfWeek === newSlot.dayOfWeek) {
              const existingStart = timeToMinutes(existingSlot.startTime)
              const existingEnd = timeToMinutes(existingSlot.endTime)
    
              const hasOverlap =
                (newStart >= existingStart && newStart < existingEnd) ||
                (newEnd > existingStart && newEnd <= existingEnd) ||
                (newStart <= existingStart && newEnd >= existingEnd)
    
              if (hasOverlap) {
                return {
                  hasCollision: true,
                  message: `Time collision detected on ${DAYS_OF_WEEK[newSlot.dayOfWeek]}`,
                }
              }
            }
          }
        }
    
        return { hasCollision: false, message: "" }
      }

    const addTimeSlot = () => {
        const newSlot: TimeSlot = {
          id: Date.now().toString(),
          dayOfWeek: 1,
          startTime: "09:00",
          endTime: "17:00",
        }
    
        const collision = hasTimeCollision([newSlot])
        if (collision.hasCollision) {
          setCollisionError(collision.message)
          setTimeout(() => setCollisionError(null), 4000)
          return
        }
    
        setCollisionError(null)
        setTimeSlots([...timeSlots, newSlot])
      }

    const applyQuickSetup = () => {
        const fromDay = Math.min(quickFromDay, quickToDay)
        const toDay = Math.max(quickFromDay, quickToDay)
    
        const newSlots: Array<Omit<TimeSlot, "id">> = []
        for (let day = fromDay; day <= toDay; day++) {
          newSlots.push({
            dayOfWeek: day,
            startTime: quickStartTime,
            endTime: quickEndTime,
          })
        }
    
        const collision = hasTimeCollision(newSlots)
        if (collision.hasCollision) {
          setCollisionError(collision.message)
          setTimeout(() => setCollisionError(null), 4000)
          return
        }
    
        setCollisionError(null)
        const newSlotsWithIds = newSlots.map((slot, index) => ({
          ...slot,
          id: `${Date.now()}-${index}`,
        }))
        setTimeSlots([...timeSlots, ...newSlotsWithIds])
      }
    
      const removeTimeSlot = (id: string) => {
        setTimeSlots(timeSlots.filter((slot) => slot.id !== id))
        setCollisionError(null)
      }
    
      const updateTimeSlot = (id: string, field: keyof TimeSlot, value: string | number) => {
        const updatedSlots = timeSlots.map((slot) => (slot.id === id ? { ...slot, [field]: value } : slot))
    
        const updatedSlot = updatedSlots.find((slot) => slot.id === id)!
        const otherSlots = timeSlots.filter((slot) => slot.id !== id)
    
        const collision = hasTimeCollision([updatedSlot], otherSlots)
        if (collision.hasCollision) {
          setCollisionError(collision.message)
          setTimeout(() => setCollisionError(null), 4000)
          return
        }
    
        setCollisionError(null)
        setTimeSlots(updatedSlots)
      }

    const handleSave = () => {
        const formattedSlots = timeSlots.map(({ id, ...slot }) => slot)
        console.log("Saved time slots:", JSON.stringify(formattedSlots, null, 2))
        alert("Time slots saved! Check console for data.")
      }

  return (
    <div>
      {collisionError && (
        <Card className="p-4 mb-6 bg-destructive/10 border-destructive/50">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm font-medium">{collisionError}</p>
          </div>
        </Card>
      )}

      <Card className="p-6 mb-6 bg-accent/50">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-medium">Quick Setup</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">Set the same hours for multiple days at once</p>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from-day">From Day</Label>
              <select
                id="from-day"
                value={quickFromDay}
                onChange={(e) => setQuickFromDay(Number.parseInt(e.target.value))}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {DAYS_OF_WEEK.map((day, index) => (
                  <option key={index} value={index}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="to-day">To Day</Label>
              <select
                id="to-day"
                value={quickToDay}
                onChange={(e) => setQuickToDay(Number.parseInt(e.target.value))}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {DAYS_OF_WEEK.map((day, index) => (
                  <option key={index} value={index}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quick-start">Start Time</Label>
              <input
                id="quick-start"
                type="time"
                value={quickStartTime}
                onChange={(e) => setQuickStartTime(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quick-end">End Time</Label>
              <input
                id="quick-end"
                type="time"
                value={quickEndTime}
                onChange={(e) => setQuickEndTime(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>

          <Button onClick={applyQuickSetup} className="w-full" variant="default">
            Apply to Schedule
          </Button>
        </div>
      </Card>

      <Separator className="my-6" />

      <div className="mb-4">
        <h2 className="text-lg font-medium mb-1">Weekly Schedule</h2>
        <p className="text-sm text-muted-foreground">Click on a time slot to add availability</p>
      </div>

      <Card className="mb-6 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header row with day names */}
            <div className="grid grid-cols-8 border-b bg-muted/50 sticky top-0 z-10">
              <div className="p-3 border-r font-medium text-sm"></div>
              {DAYS_OF_WEEK.map((day, index) => (
                <div key={index} className="p-3 border-r last:border-r-0 text-center font-medium text-sm">
                  <div className="text-xs text-muted-foreground mb-1">
                    {day.substring(0, 3).toUpperCase()}
                  </div>
                  <div className="text-base">{day}</div>
                </div>
              ))}
            </div>

            {/* Time grid */}
            <div className="relative">
              {Array.from({ length: 24 }, (_, hour) => {
                const timeLabel = `${hour.toString().padStart(2, "0")}:00`
                const timeToMinutes = (time: string) => {
                  const [hours, minutes] = time.split(":").map(Number)
                  return hours * 60 + minutes
                }

                return (
                  <div key={hour} className="grid grid-cols-8 border-b last:border-b-0 relative">
                    {/* Time label column */}
                    <div className="p-2 border-r text-xs text-muted-foreground text-right pr-3 sticky left-0 bg-background z-10">
                      {timeLabel}
                    </div>

                    {/* Day columns */}
                    {DAYS_OF_WEEK.map((_day, dayIndex) => {
                      const daySlots = timeSlots.filter((slot) => slot.dayOfWeek === dayIndex)

                      return (
                        <div
                          key={dayIndex}
                          className="border-r last:border-r-0 relative min-h-[60px] hover:bg-muted/30 transition-colors cursor-pointer"
                          onClick={(e) => {
                            if (e.target === e.currentTarget) {
                              const newSlot: TimeSlot = {
                                id: Date.now().toString(),
                                dayOfWeek: dayIndex,
                                startTime: timeLabel,
                                endTime: `${(hour + 1).toString().padStart(2, "0")}:00`,
                              }
                              const collision = hasTimeCollision([newSlot])
                              if (!collision.hasCollision) {
                                setTimeSlots([...timeSlots, newSlot])
                              }
                            }
                          }}
                        >
                          {daySlots
                            .filter((slot) => {
                              const slotStart = timeToMinutes(slot.startTime)
                              const slotEnd = timeToMinutes(slot.endTime)
                              const hourStart = hour * 60
                              const hourEnd = (hour + 1) * 60
                              return (
                                (slotStart >= hourStart && slotStart < hourEnd) ||
                                (slotEnd > hourStart && slotEnd <= hourEnd) ||
                                (slotStart <= hourStart && slotEnd >= hourEnd)
                              )
                            })
                            .map((slot) => {
                              const slotStart = timeToMinutes(slot.startTime)
                              const slotEnd = timeToMinutes(slot.endTime)
                              const hourStart = hour * 60
                              const hourEnd = (hour + 1) * 60

                              // Calculate position within this hour row
                              const slotStartInHour = Math.max(0, slotStart - hourStart)
                              const slotEndInHour = Math.min(60, slotEnd - hourStart)
                              const topPercent = (slotStartInHour / 60) * 100
                              const heightPercent = ((slotEndInHour - slotStartInHour) / 60) * 100

                              // If slot spans multiple hours, adjust height
                              const spansMultipleHours = slotEnd > hourEnd
                              const actualHeight = spansMultipleHours ? 100 - topPercent : heightPercent

                              return (
                                <div
                                  key={slot.id}
                                  className="absolute left-0 right-0 bg-primary/20 border border-primary/40 rounded px-2 py-1 text-xs cursor-pointer hover:bg-primary/30 transition-colors group z-20"
                                  style={{
                                    top: `${topPercent}%`,
                                    height: `${actualHeight}%`,
                                    minHeight: "20px",
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                  }}
                                >
                                  <div className="flex items-center justify-between h-full">
                                    <div className="text-primary font-medium truncate">
                                      {slot.startTime} - {slot.endTime}
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        removeTimeSlot(slot.id)
                                      }}
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              )
                            })}
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={addTimeSlot} type="button" variant="outline" className="flex-1 sm:flex-none bg-transparent">
          <Plus className="h-4 w-4 mr-2" />
          Add Time Slot
        </Button>

        <Button onClick={handleSave} type="button" className="flex-1 sm:flex-none">
          <Save className="h-4 w-4 mr-2" />
          Save Schedule
        </Button>
      </div>

      {/* <div className="mt-8 p-4 rounded-lg bg-muted">
        <h2 className="text-sm font-medium mb-2">Current Schedule Data:</h2>
        <pre className="text-xs overflow-auto">
          {JSON.stringify(
            timeSlots.map(({ id, ...slot }) => slot),
            null,
            2,
          )}
        </pre>
      </div> */}
    </div>
  )
}

