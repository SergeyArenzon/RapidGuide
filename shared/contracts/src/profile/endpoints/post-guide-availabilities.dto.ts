import { z } from 'zod';
import { createGuideAvailabilitySchema } from '../entities/guide-availability.dto';

export const postGuideAvailabilitiesRequestSchema = z.array(createGuideAvailabilitySchema);

export type PostGuideAvailabilitiesRequestDto = z.infer<typeof postGuideAvailabilitiesRequestSchema>;

