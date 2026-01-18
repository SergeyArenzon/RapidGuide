import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import Api from '@/lib/api'
import type { CreateReservationDto } from '@rapid-guide-io/contracts'

export function useCreateReservationMutation() {
  const navigate = useNavigate()
  const api = new Api()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (reservation: CreateReservationDto) => api.booking.createReservation(reservation),
    onSuccess: (data) => {
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

