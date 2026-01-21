import { z } from 'zod';
import { timeSchema } from '../../time.dto';

// Reservation status enum
export const reservationStatusSchema = z.enum(['pending', 'confirmed', 'rejected', 'cancelled']);

// Schema for reservation availability (nested)
// Used because it contains both availability_id and slot_order
export const reservationAvailabilitySchema = z.object({
  availability_id: z.uuid(),
  slot_order: z.number().int().nonnegative(),
});

// Full reservation schema for response - includes all fields
export const reservationSchema = timeSchema.extend({
  id: z.uuid(),
  tour_id: z.uuid(),
  datetime: z.coerce.date(),
  number_of_travellers: z.number().int().positive(),
  price_per_traveller: z.number().positive(),
  total_price: z.number().positive(),
  status: reservationStatusSchema,
  notes: z.string().nullable().optional(),
  reviewed_at: z.coerce.date().nullable().optional(),
  rejection_reason: z.string().nullable().optional(),
  // Nested arrays for related entities
  traveller_ids: z.array(z.uuid()).min(1, 'At least one traveller is required'),
  availabilities: z.array(reservationAvailabilitySchema).min(1, 'At least one availability is required'),
});

// Create reservation schema - omits auto-generated fields and includes required inputs
export const createReservationSchema = z.object({
  tour_id: z.uuid(),
  availability_ids: z.array(z.uuid()).min(1, 'At least one availability is required'),
  datetime: z.coerce.date(),
  traveller_id: z.uuid().min(1, 'Traveller is required'),
  // Price per traveller - should match tour price, but included for validation
  price_per_traveller: z.number().positive().optional(),
});

// Update reservation schema - all fields optional except id (handled in route)
export const updateReservationSchema = z.object({
  status: reservationStatusSchema.optional(),
  notes: z.string().optional(),
  rejection_reason: z.string().optional(),
  reviewed_at: z.coerce.date().optional(),
});

// Export types
export type ReservationDto = z.infer<typeof reservationSchema>;
export type CreateReservationDto = z.infer<typeof createReservationSchema>;
export type UpdateReservationDto = z.infer<typeof updateReservationSchema>;
export type ReservationStatus = z.infer<typeof reservationStatusSchema>;
export type ReservationAvailabilityDto = z.infer<typeof reservationAvailabilitySchema>;
