import { useState } from 'react'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import dayjs from 'dayjs'

import { calculateValidTimeSlots } from './-availabilities-list'
import { useCreateReservationMutation } from './useCreateReservationMutation'

import { bookingQueries, profileQueries, tourQueries } from '@/lib/query'
import { Route as RootRoute } from '@/routes/__root'

type AvailabilityLike = {
  id: string
}

export function useReservationSchedule() {
  const { tourId } = useParams({
    from: '/_authenticated/traveller/tours/$tourId/reservation/',
  })
  const { traveller } = RootRoute.useRouteContext()

  const { data: tour } = useSuspenseQuery(tourQueries.detail(tourId))

  const { data: guideAvailabilities } = useSuspenseQuery(
    profileQueries.guideAvailabilitiesByGuideId(tour.guide_id),
  )

  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [selectedAvailabilityId, setSelectedAvailabilityId] = useState<
    string | undefined
  >()

  const createReservationMutation = useCreateReservationMutation()

  const isDateAvailable = (date: Date): boolean => {
    if (guideAvailabilities.length === 0) return false

    const validSlots = calculateValidTimeSlots(
      date,
      guideAvailabilities,
      tour.duration_minutes,
    )

    return validSlots.length > 0
  }

  const modifiers = {
    available: (date: Date) => isDateAvailable(date),
  }

  const getSelectedTimeSlotDetails = () => {
    if (!selectedDate || !selectedAvailabilityId) return undefined

    const validSlots = calculateValidTimeSlots(
      selectedDate,
      guideAvailabilities,
      tour.duration_minutes,
    )

    return validSlots.find((slot) => slot.id === selectedAvailabilityId)
  }

  const selectedSlotDetails = getSelectedTimeSlotDetails()

  const reservationStartDatetime =
    selectedDate && selectedSlotDetails
      ? (() => {
          const [hours, minutes] = selectedSlotDetails.startTime
            .split(':')
            .map(Number)

          return dayjs(selectedDate)
            .hour(hours)
            .minute(minutes)
            .second(0)
            .millisecond(0)
            .toDate()
        })()
      : undefined

  const { data: existingReservations = [] } = useQuery({
    ...bookingQueries.all({
      tour_id: tourId,
      date: selectedDate ?? new Date(0),
    }),
    enabled: !!selectedDate,
  })

  const handleSelectDate = (date?: Date) => {
    setSelectedDate(date)
    setSelectedAvailabilityId(undefined)
  }

  const handleMonthChange = (date: Date) => {
    setCurrentMonth(date)
  }

  const handleAvailabilityClick = (availability: AvailabilityLike) => {
    setSelectedAvailabilityId(availability.id)
  }

  const handleFinalizeReservation = () => {
    if (!selectedDate || !selectedSlotDetails || !traveller?.id) {
      console.error('Missing required data for reservation')
      return
    }

    const [hours, minutes] = selectedSlotDetails.startTime
      .split(':')
      .map(Number)

    const datetime = dayjs(selectedDate)
      .hour(hours)
      .minute(minutes)
      .second(0)
      .millisecond(0)
      .toDate()

    createReservationMutation.mutate({
      tour_id: tourId,
      availability_ids: [selectedAvailabilityId!],
      datetime,
      traveller_id: traveller.id,
      price_per_traveller: tour.price,
    })
  }

  const isDateDisabled = (date: Date) => {
    const isPast = dayjs(date).isBefore(dayjs(), 'day')
    const isNotAvailable = !isDateAvailable(date)

    return isPast || isNotAvailable
  }

  return {
    // data
    tour,
    guideAvailabilities,
    selectedDate,
    currentMonth,
    selectedAvailabilityId,
    existingReservations,
    selectedSlotDetails,
    reservationDatetime: reservationStartDatetime,
    createReservationMutation,

    // calendar config
    modifiers,
    isDateDisabled,

    // actions
    handleSelectDate,
    handleMonthChange,
    handleAvailabilityClick,
    handleFinalizeReservation,
  }
}


