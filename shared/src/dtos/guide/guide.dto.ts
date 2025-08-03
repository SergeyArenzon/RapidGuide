import { z } from 'zod';
import { timeSchema } from '../time.dto';

// Base schema that will be extended by create and response DTOs
const guideSchema = timeSchema.extend({
  id: z.uuid(),
  name: z.string().min(1),
  bio: z.string().min(1),
  country_code: z.string().min(2).max(2),
  city_id: z.number(),
  languages_code: z.array(z.string().min(2).max(2)),
  subcategories_id: z.array(z.uuid()),
});

// Schema for guide response - includes all fields
export { guideSchema };
// Create DTOs from schemas
export type GuideDto = z.infer<typeof guideSchema>;
