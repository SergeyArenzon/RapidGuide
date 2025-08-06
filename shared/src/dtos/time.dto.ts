import { z } from 'zod';

// Base schema that will be extended by create and response DTOs
const timeSchema = z.object({
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

// Schema for guide response - includes all fields
export { timeSchema };
// Create DTOs from schemas
export type GuideDto = z.infer<typeof timeSchema>;
