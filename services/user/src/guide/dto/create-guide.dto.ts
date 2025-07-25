import { createZodDto } from 'nestjs-zod';
import { guideSchema } from './guide.dto';

// Schema for creating a guide - omits auto-generated fields
const createGuideSchema = guideSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export class CreateGuideDto extends createZodDto(createGuideSchema) {}
