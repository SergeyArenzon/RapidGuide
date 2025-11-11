import { z } from 'zod';
import { guideSchema } from './guide.dto';

export const createGuideSchema = guideSchema.omit({
  id: true,
  user_id: true,
  created_at: true,
  updated_at: true,
});

export type CreateGuideDto = z.infer<typeof createGuideSchema>;
