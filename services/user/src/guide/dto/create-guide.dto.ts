import { z } from 'zod';
// import { guideSchema } from './guide.dto';

export const createGuideSchema = z.object({
  name: z.string().min(1),
  bio: z.string().min(1),
  user_id: z.uuid(),
  country_code: z.string().min(2).max(2),
  city_id: z.number(),
  languages_code: z.array(z.string().min(2).max(2)),
  subcategories_id: z.array(z.uuid()),
});

export type CreateGuideDto = z.infer<typeof createGuideSchema>;
