import { z } from 'zod';
import { EntitySchema } from './entity.schema';

const GuideBaseSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    subcategories_id: z.array(z.uuid()).min(1, { message: "At least one sub category is required" }),
    languages_code: z.array(z.string()).min(1, { message: "At least one language is required" }),
    country_code: z.string().min(1, { message: "Country is required" }),
    city_id: z.number().min(1, { message: "City is required" }),
    bio: z.string()
    .min(10, { message: "Bio must be at least 10 characters" })
    .max(500, { message: "Bio must be less than 500 characters" })  ,
});



const GuideSchema = z.object({
    ...GuideBaseSchema.shape,
    ...EntitySchema.shape,
});

export { GuideSchema, GuideBaseSchema };