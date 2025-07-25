import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// Base schema that will be extended by create and response DTOs
const guideSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  bio: z.string().min(1),
  user_id: z.string(),
  country_code: z.string().min(2).max(2),
  city_id: z.number(),
  languages_code: z.array(z.string().min(2).max(2)),
  subcategories_ids: z.array(z.string()),
  created_at: z.date(),
  updated_at: z.date(),
});

// Schema for guide response - includes all fields
export { guideSchema };
// Create DTOs from schemas
export class GuideDto extends createZodDto(guideSchema) {}
