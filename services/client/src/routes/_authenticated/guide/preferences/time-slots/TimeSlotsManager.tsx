import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TimeSlotCard } from '@/components/TimeSlotCard'
import Api from '@/lib/api'

interface TimeSlot {
  id: string
  dayOfWeek: number
  startTime: string
  endTime: string
}

export function TimeSlotsManager() {
  const api = new Api()
  const queryClient = useQueryClient()
  const [timeSlots, setTimeSlots] = useState<Array<TimeSlot>>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch existing time slots
  const { data: schedules, isLoading: isLoadingSchedules } = useQuery({
    queryKey: ['guide', 'schedules'],
    queryFn: async () => {
      try {
        return await api.profile.getGuideSchedules()
      } catch (error) {
        // If endpoint doesn't exist yet, return empty array
        console.warn('Guide schedules endpoint not available:', error)
        return []
      }
    },
  })

  useEffect(() => {
    if (schedules) {
      // Transform backend format to frontend format
      const transformed = schedules.map((s: any) => ({
        id: s.id,
        dayOfWeek: s.day_of_week,
        startTime: s.start_time.slice(0, 5), // Convert "HH:mm:ss" to "HH:mm"
        endTime: s.end_time.slice(0, 5),
      }))
      setTimeSlots(transformed)
      setIsLoading(false)
    } else if (!isLoadingSchedules) {
      setIsLoading(false)
    }
  }, [schedules, isLoadingSchedules])

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (slot: Omit<TimeSlot, 'id'>) => {
      const created = await api.profile.createGuideSchedule({
        day_of_week: slot.dayOfWeek,
        start_time: slot.startTime + ':00', // Convert "HH:mm" to "HH:mm:ss"
        end_time: slot.endTime + ':00',
      })
      return {
        id: created.id,
        dayOfWeek: created.day_of_week,
        startTime: created.start_time.slice(0, 5),
        endTime: created.end_time.slice(0, 5),
      }
    },
    onSuccess: (newSlot) => {
      setTimeSlots((prev) => [...prev, newSlot])
      queryClient.invalidateQueries({ queryKey: ['guide', 'schedules'] })
      toast.success('Time slot added successfully')
    },
    onError: (error: Error) => {
      console.error('Error creating time slot:', error)
      toast.error(error.message || 'Failed to add time slot')
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, slot }: { id: string; slot: Omit<TimeSlot, 'id'> }) => {
      const updated = await api.profile.updateGuideSchedule(id, {
        day_of_week: slot.dayOfWeek,
        start_time: slot.startTime + ':00',
        end_time: slot.endTime + ':00',
      })
      return {
        id: updated.id,
        dayOfWeek: updated.day_of_week,
        startTime: updated.start_time.slice(0, 5),
        endTime: updated.end_time.slice(0, 5),
      }
    },
    onSuccess: (updatedSlot) => {
      setTimeSlots((prev) => prev.map((s) => (s.id === updatedSlot.id ? updatedSlot : s)))
      queryClient.invalidateQueries({ queryKey: ['guide', 'schedules'] })
      toast.success('Time slot updated successfully')
    },
    onError: (error: Error) => {
      console.error('Error updating time slot:', error)
      toast.error(error.message || 'Failed to update time slot')
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.profile.deleteGuideSchedule(id)
      return id
    },
    onSuccess: (id) => {
      setTimeSlots((prev) => prev.filter((s) => s.id !== id))
      queryClient.invalidateQueries({ queryKey: ['guide', 'schedules'] })
      toast.success('Time slot removed successfully')
    },
    onError: (error: Error) => {
      console.error('Error deleting time slot:', error)
      toast.error(error.message || 'Failed to remove time slot')
    },
  })

  const handleAdd = () => {
    const newSlot: TimeSlot = {
      id: `temp-${Date.now()}`, // Temporary ID for new slots
      dayOfWeek: 0,
      startTime: '09:00',
      endTime: '17:00',
    }
    setTimeSlots((prev) => [...prev, newSlot])
  }

  const handleRemove = (id: string) => {
    if (id.startsWith('temp-')) {
      // Remove temporary slot (not yet saved)
      setTimeSlots((prev) => prev.filter((s) => s.id !== id))
    } else {
      // Delete from backend
      deleteMutation.mutate(id)
    }
  }

  const handleUpdate = (id: string, field: keyof TimeSlot, value: string | number) => {
    const slot = timeSlots.find((s) => s.id === id)
    if (!slot) return

    const updatedSlot = { ...slot, [field]: value }

    if (id.startsWith('temp-')) {
      // Update temporary slot
      setTimeSlots((prev) => prev.map((s) => (s.id === id ? updatedSlot : s)))
      
      // Auto-save after a brief delay when all fields are valid
      const isValid = updatedSlot.startTime < updatedSlot.endTime
      if (isValid) {
        // Create the slot
        createMutation.mutate({
          dayOfWeek: updatedSlot.dayOfWeek,
          startTime: updatedSlot.startTime,
          endTime: updatedSlot.endTime,
        })
        // Remove temporary slot
        setTimeSlots((prev) => prev.filter((s) => s.id !== id))
      }
    } else {
      // Update existing slot
      updateMutation.mutate({
        id,
        slot: {
          dayOfWeek: updatedSlot.dayOfWeek,
          startTime: updatedSlot.startTime,
          endTime: updatedSlot.endTime,
        },
      })
    }
  }

  if (isLoading) {
    return <div className="text-muted-foreground">Loading time slots...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your Time Slots</h2>
        <Button onClick={handleAdd} disabled={createMutation.isPending}>
          <Plus className="h-4 w-4 mr-2" />
          Add Time Slot
        </Button>
      </div>

      {timeSlots.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">No time slots configured yet.</p>
          <Button onClick={handleAdd} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Time Slot
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {timeSlots.map((slot) => (
            <TimeSlotCard
              key={slot.id}
              slot={slot}
              onRemove={handleRemove}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}
    </div>
  )
}

