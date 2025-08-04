import { z } from 'zod';

const citySchema = z.object({
  id: z.number(),
  name: z.string(),
  country_code: z.number(),
});

export type CityDto = z.infer<typeof citySchema>;
export { citySchema };