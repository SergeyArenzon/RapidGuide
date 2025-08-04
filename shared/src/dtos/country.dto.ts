import { z } from 'zod';

export const countrySchema = z.object({
  code: z.string(),
  alpha3: z.string(),
  name: z.string(),
  country_code: z.string(),
  region: z.string(),
  region_code: z.string(),
});

export type CountryDto = z.infer<typeof countrySchema>;
