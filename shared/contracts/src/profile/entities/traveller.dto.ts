import { z } from 'zod';
import { timeSchema } from '../../time.dto';

// Base schema that will be extended by create and response DTOs
export const travellerSchema = timeSchema.extend({
  id: z.uuid(),
  user_id: z.uuid(),
  bio: z.string()
  .min(10, { message: "Bio must be at least 10 characters" })
  .max(500, { message: "Bio must be less than 500 characters" }),
  country_code: z.string().min(2, { message: "Country must be at least 2 characters" }),
  city_id: z.number().min(1, { message: "City is required" }),  
  languages_code: z.array(z.string().min(2).max(2)).min(1, { message: "At least one language is required" }),
  subcategories_id: z.array(z.uuid()).min(1, { message: "At least one sub category is required" }),
});

export const createTravellerSchema = travellerSchema.omit({
  id: true,
  user_id: true,
  created_at: true,
  updated_at: true,
});


// Create DTOs from schemas
export type TravellerDto = z.infer<typeof travellerSchema>;
export type CreateTravellerDto = z.infer<typeof createTravellerSchema>;
