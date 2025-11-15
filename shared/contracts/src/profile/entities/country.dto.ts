import { z } from 'zod';
import { timeSchema } from '../../time.dto';

export const countrySchema = timeSchema.extend({
  code: z.string().length(2),
  alpha3: z.string().length(3),
  name: z.string(),
  country_code: z.coerce.number(),
  region: z.string(),
  region_code: z.coerce.number(),
});

export type CountryDto = z.infer<typeof countrySchema>;
