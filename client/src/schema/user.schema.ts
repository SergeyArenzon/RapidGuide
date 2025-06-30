import { z } from 'zod';

const UserSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    last_name: z.string(),
    first_name: z.string(),
    image_url: z.string().url(),
    created_at: z.string().transform((val) => new Date(val)),
    updated_at: z.string().transform((val) => new Date(val)),
});


const ISOSchema = z.object({
  code: z.string(),
  name: z.string(),
})

// Define the expected structure of a language object
const LanguageSchema = ISOSchema


export { UserSchema, LanguageSchema};