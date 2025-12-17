import { Injectable } from '@nestjs/common';
import { CreateTourTimeSlotDto } from './dto/create-tour-time-slot.dto';
import { UpdateTourTimeSlotDto } from './dto/update-tour-time-slot.dto';

@Injectable()
export class TourTimeSlotService {
  create(createTourTimeSlotDto: CreateTourTimeSlotDto) {
    return 'This action adds a new tourTimeSlot';
  }

  findAll() {
    return `This action returns all tourTimeSlot`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tourTimeSlot`;
  }

  update(id: number, updateTourTimeSlotDto: UpdateTourTimeSlotDto) {
    return `This action updates a #${id} tourTimeSlot`;
  }

  remove(id: number) {
    return `This action removes a #${id} tourTimeSlot`;
  }
}
