import { z } from 'zod';

const CitySchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    country_code: z.string(),
});


export { CitySchema };