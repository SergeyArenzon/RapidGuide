import { z } from 'zod';


export const getResevationsFilerSchema = z.object({
  tour_id: z.uuid().optional(),
  date: z.coerce.date().optional(),
});

export const joinReservationSchema = z.object({
  reservation_id: z.uuid(),
  traveller_id: z.uuid(),
});

export type GetReservationsFilterDto = z.infer<typeof getResevationsFilerSchema>;
export type JoinReservationDto = z.infer<typeof joinReservationSchema>;