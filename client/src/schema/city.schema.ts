import { z } from 'zod';

const CitySchema = z.object({
    id: z.number(),
    name: z.string(),
    country: z.string(),
});


export { CitySchema };