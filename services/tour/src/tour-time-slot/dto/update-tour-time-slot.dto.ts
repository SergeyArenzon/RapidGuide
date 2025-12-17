import { PartialType } from '@nestjs/mapped-types';
import { CreateTourTimeSlotDto } from './create-tour-time-slot.dto';

export class UpdateTourTimeSlotDto extends PartialType(CreateTourTimeSlotDto) {}
