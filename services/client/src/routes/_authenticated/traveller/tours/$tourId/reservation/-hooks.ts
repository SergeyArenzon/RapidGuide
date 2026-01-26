import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import dayjs from 'dayjs'
import { calculateValidTimeSlots } from './-availabilities-list'
import type { CreateReservationDto, GuideAvailabilityDto, TourDto } from '@rapid-guide-io/contracts'
import { bookingQueries } from '@/lib/query'
import Api from '@/lib/api'

export function useCreateReservationMutation() {
  const navigate = useNavigate()
  const api = new Api()

  return useMutation({
    mutationFn: (reservation: CreateReservationDto) => api.booking.createReservation(reservation),
    onSuccess: () => {
      toast.success('Reservation created successfully!')
      // Optionally invalidate queries if needed
      // queryClient.invalidateQueries({ queryKey: ['reservations'] })
      // Navigate to reservation details or back to tours
      navigate({ to: '/traveller/tours' })
    },
    onError: (error: Error) => {
      console.error('Error creating reservation:', error)
      toast.error(error.message || 'Failed to create reservation')
    },
  })
}

interface UseReservationParams {
  tourId: string
  tour: TourDto
  guideAvailabilities: Array<GuideAvailabilityDto>
  travellerId?: string
}

interface TimeSlot {
  id: string
  startTime: string
  endTime: string
  availability: GuideAvailabilityDto
}

export function useReservation({
  tourId,
  tour,
  guideAvailabilities,
  travellerId,
}: UseReservationParams) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [selectedAvailabilityId, setSelectedAvailabilityId] = useState<string | undefined>()

  const createReservationMutation = useCreateReservationMutation()

  // Check if a date is available (has valid time slots considering tour duration)
  const isDateAvailable = (date: Date): boolean => {
    if (guideAvailabilities.length === 0) return false

    // Check if there are any valid time slots for this date
    const validSlots = calculateValidTimeSlots(
      date,
      guideAvailabilities,
      tour.duration_minutes
    )
    return validSlots.length > 0
  }

  // Custom modifiers for react-day-picker
  const modifiers = {
    available: (date: Date) => isDateAvailable(date),
  }

  // Get the selected time slot details
  const selectedSlotDetails: TimeSlot | undefined =
    !selectedDate || !selectedAvailabilityId
      ? undefined
      : calculateValidTimeSlots(
          selectedDate,
          guideAvailabilities,
          tour.duration_minutes
        ).find((slot) => slot.id === selectedAvailabilityId)

  // Calculate datetime from availability's start time for display
  const reservationDatetime: Date | undefined = (() => {
    if (!selectedDate || !selectedSlotDetails) return undefined

    const [hours, minutes] = selectedSlotDetails.startTime.split(':').map(Number)
    return dayjs(selectedDate)
      .hour(hours)
      .minute(minutes)
      .second(0)
      .millisecond(0)
      .toDate()
  })()


  // Fetch existing reservations for the selected date
  const { data: existingReservations = [] } = useQuery({
    ...bookingQueries.all({
      tour_id: tourId,
      // Value is ignored when query is disabled, but needed for stable key shape
      date: selectedDate ?? new Date(0),
    }),
    enabled: !!selectedDate,
  })

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    setSelectedAvailabilityId(undefined) // Reset selection when date changes
  }

  // Handle availability selection
  const handleAvailabilityClick = (availability: GuideAvailabilityDto) => {
    setSelectedAvailabilityId(availability.id)
  }

  // Handle finalizing the reservation
  const handleFinalizeReservation = () => {
    if (!selectedDate || !selectedSlotDetails || !travellerId) {
      console.error('Missing required data for reservation')
      return
    }

    // Combine selectedDate with startTime to create scheduled_datetime
    const [hours, minutes] = selectedSlotDetails.startTime.split(':').map(Number)
    const datetime = dayjs(selectedDate)
      .hour(hours)
      .minute(minutes)
      .second(0)
      .millisecond(0)
      .toDate()

    createReservationMutation.mutate({
      tour_id: tourId,
      availability_ids: [selectedAvailabilityId!], // Use the selected availability ID
      datetime: datetime,
      traveller_id: travellerId,
      price_per_traveller: tour.price,
    })
  }

  // Check if a date should be disabled (past dates or unavailable dates)
  const isDateDisabled = (date: Date): boolean => {
    // Disable dates in the past
    const isPast = dayjs(date).isBefore(dayjs(), 'day')
    // Disable dates that are not available
    const isNotAvailable = !isDateAvailable(date)
    return isPast || isNotAvailable
  }

  return {
    // State
    selectedDate,
    currentMonth,
    selectedAvailabilityId,
    selectedSlotDetails,
    reservationDatetime,
    existingReservations,

    // Actions
    setSelectedDate: handleDateSelect,
    setCurrentMonth,
    handleAvailabilityClick,
    handleFinalizeReservation,

    // Computed values
    modifiers,
    isDateAvailable,
    isDateDisabled,

    // Mutation state
    isCreatingReservation: createReservationMutation.isPending,
  }
}
