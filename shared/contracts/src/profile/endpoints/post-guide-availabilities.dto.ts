import { z } from 'zod';
import { createGuideAvailabilitySchema } from '../entities/guide-availability.dto';

export const postGuideAvailabilitiesRequestSchema = createGuideAvailabilitySchema;

export type PostGuideAvailabilitiesRequestDto = z.infer<typeof postGuideAvailabilitiesRequestSchema>;

