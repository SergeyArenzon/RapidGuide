import type { ReservationDto } from '@rapid-guide-io/contracts';
import Api from '@/lib/api';

/**
 * Query keys for reservation-related queries
 */
export const reservationQueryKeys = {
  all: (filter: { tour_id: string; date: Date }) => {
    const dateStr = filter.date instanceof Date ? filter.date.toISOString() : String(filter.date);
    return ['reservations', 'tour', filter.tour_id, 'date', dateStr] as const;
  },
  detail: (reservationId: string) => ['reservation', reservationId] as const,
} as const;

/**
 * Query options factories for reservation-related queries
 * These combine query keys with their query functions
 */
export const reservationQueries = {
  /**
   * Get reservations filtered by tour_id and date
   * Both tour_id and date are required
   */
  all: (filter: { tour_id: string; date: Date }) => ({
    queryKey: reservationQueryKeys.all(filter),
    queryFn: async (): Promise<Array<ReservationDto>> => {
      const api = new Api();
      return api.reservation.getReservations({
        tour_id: filter.tour_id,
        date: filter.date,
      });
    },
  }),

  /**
   * Get a single reservation by ID
   */
  detail: (reservationId: string) => ({
    queryKey: reservationQueryKeys.detail(reservationId),
    queryFn: async (): Promise<Array<ReservationDto>> => {
      const api = new Api();
      return api.reservation.getReservation(reservationId);
    },
  }),
} as const;
