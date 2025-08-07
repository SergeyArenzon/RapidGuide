import { z } from 'zod';
import { timeSchema } from './time.dto';
import { countrySchema } from './country.dto';

const citySchema = timeSchema.extend({
  id: z.number(),
  name: z.string(),
  country_code: countrySchema.shape.code,
});

export type CityDto = z.infer<typeof citySchema>;
export { citySchema };