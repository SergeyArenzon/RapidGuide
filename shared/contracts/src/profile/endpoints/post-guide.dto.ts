import { z } from 'zod';
import { guideSchema } from '../entities/guide.dto';

export const postGuideRequestSchema = guideSchema.omit({
  id: true,
  user_id: true,
  created_at: true,
  updated_at: true,
});

export type PostGuideRequestDto = z.infer<typeof postGuideRequestSchema>;
