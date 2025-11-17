import { z } from 'zod';
import { guideSchema } from '../entities/guide.dto';

export const getProfilesResponseSchema = z.object({
    guide: guideSchema.nullable(),
});

export type GetProfilesResponseDto = z.infer<typeof getProfilesResponseSchema>;