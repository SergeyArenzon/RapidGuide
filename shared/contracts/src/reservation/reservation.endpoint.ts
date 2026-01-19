import { z } from 'zod';


export const getResevationsFilerSchema = z.object({
  tour_id: z.uuid().optional(),
  date: z.coerce.date().optional(),
});

export type GetReservationsFilterDto = z.infer<typeof getResevationsFilerSchema>;
