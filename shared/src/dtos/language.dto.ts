import { z } from 'zod';

export const languageSchema = z.object({
  code: z.string()
    .length(2, 'Language code must be exactly 2 characters')
    .regex(/^[a-z]{2}$/, 'Language code must be a valid ISO 639-1 code (e.g., "en", "es", "fr")'),
  name: z.string()
    .min(1, 'Language name is required')
    .max(50, 'Language name must be less than 50 characters'),
});

export type LanguageDto = z.infer<typeof languageSchema>;