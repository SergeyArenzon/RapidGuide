import { z } from 'zod';
import { timeSchema } from '../../time.dto';

// Base schema for guide availability
export const guideAvailabilitySchema = timeSchema.extend({
  id: z.uuid(),
  guide_id: z.uuid(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
});

// Create schema - omits id, guide_id, and timestamps (guide_id will be set from user's guide)
export const createGuideAvailabilitySchema = guideAvailabilitySchema.omit({
  id: true,
  guide_id: true,
  created_at: true,
  updated_at: true,
});

// DTOs
export type GuideAvailabilityDto = z.infer<typeof guideAvailabilitySchema>;
export type CreateGuideAvailabilityDto = z.infer<typeof createGuideAvailabilitySchema>;


