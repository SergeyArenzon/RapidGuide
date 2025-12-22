import { z } from 'zod';
import { timeSchema } from '../../time.dto';

// Tour schema for response - includes all fields
export const tourSchema = timeSchema.extend({
  id: z.uuid(),
  guide_id: z.uuid(),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  min_travellers: z.number().int().positive(),
  max_travellers: z.number().int().positive(),
  price: z.number().positive('Price must be a positive number'),
  duration_minutes: z.number().int().positive(),
  // Nested subcategories for response
  subcategory_ids: z.array(z.uuid()).min(1, 'At least one subcategory is required'),
});



// Export types
export type TourDto = z.infer<typeof tourSchema>;



