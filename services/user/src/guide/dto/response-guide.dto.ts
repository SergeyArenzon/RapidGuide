import { OmitType } from '@nestjs/mapped-types';
import { GuideDto } from './guide.dto';

export class ResponseGuideDto extends OmitType(GuideDto, [] as const) {}
