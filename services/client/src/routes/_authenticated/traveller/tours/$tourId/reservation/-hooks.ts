import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import dayjs from 'dayjs'
import { calculateValidTimeSlots } from './-availabilities-list'
import type { CreateReservationDto, GuideAvailabilityDto, JoinReservationDto, TourDto } from '@rapid-guide-io/contracts'
import { bookingQueries, bookingQueryKeys } from '@/lib/query'
import Api from '@/lib/api'

export function useCreateReservationMutation(tourId: string, selectedDate: Date) {
  const navigate = useNavigate()
  const api = new Api()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (reservation: CreateReservationDto) => api.booking.createReservation(reservation),
    onSuccess: () => {
      toast.success('Reservation created successfully!')
      // Refresh any reservations lists (for this tour/date and caches derived from it)
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.all({ tour_id: tourId, date: selectedDate }) })
      // Navigate to reservation details or back to tours
      navigate({ to: '/traveller/tours' })
    },
    onError: (error: Error) => {
      console.error('Error creating reservation:', error)
      toast.error(error.message || 'Failed to create reservation')
    },
  })
}

export function useJoinReservationMutation(tourId: string, selectedDate: Date | undefined) {
  const navigate = useNavigate()
  const api = new Api()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: JoinReservationDto) => api.booking.joinReservation(dto),
    onSuccess: () => {
      toast.success('Successfully joined the reservation!')
      if (selectedDate) {
        queryClient.invalidateQueries({
          queryKey: bookingQueryKeys.all({ tour_id: tourId, date: selectedDate }),
        })
      }
      navigate({ to: '/traveller/tours' })
    },
    onError: (error: Error) => {
      console.error('Error joining reservation:', error)
      toast.error(error.message || 'Failed to join reservation')
    },
  })
}

export function useCancelReservationMutation(tourId: string, selectedDate: Date | undefined) {
  const api = new Api()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (reservationId: string) => api.booking.cancelReservation(reservationId),
    onSuccess: () => {
      toast.success('Reservation cancelled')
      if (selectedDate) {
        queryClient.invalidateQueries({
          queryKey: bookingQueryKeys.all({ tour_id: tourId, date: selectedDate }),
        })
      }
    },
    onError: (error: Error) => {
      console.error('Error cancelling reservation:', error)
      toast.error(error.message || 'Failed to cancel reservation')
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

  const createReservationMutation = useCreateReservationMutation(tourId, selectedDate ?? new Date())
  const joinReservationMutation = useJoinReservationMutation(tourId, selectedDate)
  const cancelReservationMutation = useCancelReservationMutation(tourId, selectedDate)

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

  // Extract reserved availability IDs from existing reservations (pending or confirmed only)
  const reservedAvailabilityIds = new Set<string>(
    existingReservations
      .filter(
        (reservation) =>
          reservation.status === 'pending' || reservation.status === 'confirmed'
      )
      .flatMap((reservation) =>
        reservation.reservation_availabilities.map(
          (ra) => ra.availability_id
        )
      )
  )

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    setSelectedAvailabilityId(undefined) // Reset selection when date changes
  }

  // Handle availability selection
  const handleAvailabilityClick = (availability: GuideAvailabilityDto) => {
    setSelectedAvailabilityId(availability.id)
  }

  // Check if selected slot is already reserved (by anyone)
  const isSelectedSlotReserved = selectedAvailabilityId
    ? reservedAvailabilityIds.has(selectedAvailabilityId)
    : false

  // Check if selected slot is reserved by the current traveller
  const reservationByCurrentUser = travellerId
    ? existingReservations.find(
        (r) =>
          (r.status === 'pending' || r.status === 'confirmed') &&
          r.traveller_ids.includes(travellerId) &&
          r.reservation_availabilities.some(
            (ra) => ra.availability_id === selectedAvailabilityId
          )
      )
    : undefined

  // Handle finalizing the reservation
  const handleFinalizeReservation = () => {
    if (!selectedDate || !selectedSlotDetails || !travellerId) {
      console.error('Missing required data for reservation')
      return
    }

    // Validate that the selected slot is not already reserved
    if (isSelectedSlotReserved) {
      toast.error('This time slot is already reserved. Please select a different time slot.')
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

  // Handle joining an existing reservation
  const handleJoinReservation = (reservationId: string): void => {
    if (!travellerId) {
      toast.error('You must be logged in to join a reservation')
      return
    }
    joinReservationMutation.mutate({
      reservation_id: reservationId,
      traveller_id: travellerId,
    })
  }

  // Handle cancelling own reservation
  const handleCancelReservation = (reservationId: string): void => {
    cancelReservationMutation.mutate(reservationId)
  }

  // Check if a date should be disabled (past dates or unavailable dates)
  const isDateDisabled = (date: Date): boolean => {
    // Disable dates in the past
    const isPast = dayjs(date).isBefore(dayjs(), 'day')
    // Disable dates that are not available
    const isNotAvailable = !isDateAvailable(date)
    return isPast || isNotAvailable
  }

  // Filter joinable reservations (pending/confirmed with available spots, excluding ones the traveller is already in)
  const allJoinableReservations = existingReservations.filter(
    (reservation) =>
      (reservation.status === 'pending' || reservation.status === 'confirmed') &&
      reservation.traveller_ids.length < tour.max_travellers &&
      !(travellerId && reservation.traveller_ids.includes(travellerId))
  )

  // If a specific availability is selected, only show reservations for that slot
  const joinableReservations = selectedAvailabilityId
    ? allJoinableReservations.filter((reservation) =>
        reservation.reservation_availabilities.some(
          (ra) => ra.availability_id === selectedAvailabilityId
        )
      )
    : []

  return {
    // State
    selectedDate,
    currentMonth,
    selectedAvailabilityId,
    selectedSlotDetails,
    reservationDatetime,
    reservedAvailabilityIds,

    // Actions
    setSelectedDate: handleDateSelect,
    setCurrentMonth,
    handleAvailabilityClick,
    handleFinalizeReservation,
    handleJoinReservation,
    handleCancelReservation,
    joinableReservations,
    // Computed values
    modifiers,
    isDateAvailable,
    isDateDisabled,
    isSelectedSlotReserved,
    reservationByCurrentUser,

    // Mutation state
    isCreatingReservation: createReservationMutation.isPending,
    isJoiningReservation: joinReservationMutation.isPending,
    isCancellingReservation: cancelReservationMutation.isPending,
  }
}
