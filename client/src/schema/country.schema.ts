import { z } from 'zod';

const CountrySchema = z.object({
    code: z.string().length(2),
    alpha3: z.string().length(3),
    name: z.string(),
    country_code: z.string(),
    region: z.string(),
    region_code: z.string(),
});


export { CountrySchema };