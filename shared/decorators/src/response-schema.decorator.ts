import { SetMetadata } from '@nestjs/common';
import { ZodType } from 'zod';

export const RESPONSE_SCHEMA_KEY = 'response_schema';

/**
 * Decorator to set the response schema for validation
 */
export const ResponseSchema = <T>(schema: ZodType<T, any, any>) =>
  SetMetadata(RESPONSE_SCHEMA_KEY, schema);
