import { z } from 'zod';

const UserSchema = z.object({
    email: z.email(),
    last_name: z.string(),
    first_name: z.string(),
    image_url: z.url(),
});


const ISOSchema = z.object({
  code: z.string(),
  name: z.string(),
})

// Define the expected structure of a language object
const LanguageSchema = ISOSchema


export { UserSchema, LanguageSchema };