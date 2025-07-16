import { z } from 'zod';
import { EntitySchema } from './entity.schema';

const GuideBaseSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    categories: z.array(z.string().uuid()).min(1, { message: "At least one category is required" }),
    languages: z.array(z.string()).min(1, { message: "At least one language is required" }),
    country: z.string().min(1, { message: "Country is required" }),
    city: z.string().min(1, { message: "City is required" }),
    bio: z.string().min(10, { message: "Bio must be at least 10 characters" }),
});

const GuideSchema = z.object({
    ...GuideBaseSchema.shape,
    ...EntitySchema.shape,
});

export { GuideSchema, GuideBaseSchema };