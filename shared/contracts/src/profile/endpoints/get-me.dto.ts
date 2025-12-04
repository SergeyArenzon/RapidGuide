import { z } from 'zod';
import { guideSchema } from '../entities/guide.dto';

export const getProfilesMeResponseSchema = z.object({
    guide: guideSchema.nullable(),
});

export type GetProfilesMeResponseDto = z.infer<typeof getProfilesMeResponseSchema>;