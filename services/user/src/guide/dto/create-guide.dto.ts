import { OmitType } from '@nestjs/mapped-types';
import { GuideDto } from './guide.dto';

export class CreateGuideDto extends OmitType(GuideDto, [
  'id',
  'created_at',
  'updated_at',
  'user',
] as const) {}
