import { z } from 'zod';
import { guideSchema } from '../entities/guide.dto';
import { travellerSchema } from '../entities/traveller.dto';

export const getProfilesMeResponseSchema = z.object({
    guide: guideSchema.nullable(),
    traveller: travellerSchema.nullable(),
});

export type GetProfilesMeResponseDto = z.infer<typeof getProfilesMeResponseSchema>;