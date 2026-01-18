import { Injectable } from '@nestjs/common';
import { 
  CreateReservationDto, 
  ReservationDto,
  UpdateReservationDto 
} from '@rapid-guide-io/contracts';

@Injectable()
export class ReservationService {
  create(createReservationDto: CreateReservationDto): Promise<ReservationDto> {
    // TODO: Implement reservation creation
    throw new Error('Not implemented');
  }

  findAll(): Promise<ReservationDto[]> {
    // TODO: Implement find all reservations
    throw new Error('Not implemented');
  }

  findOne(id: string): Promise<ReservationDto> {
    // TODO: Implement find one reservation
    throw new Error('Not implemented');
  }

  update(id: string, updateReservationDto: UpdateReservationDto): Promise<ReservationDto> {
    // TODO: Implement update reservation
    throw new Error('Not implemented');
  }

  remove(id: string): Promise<void> {
    // TODO: Implement remove reservation
    throw new Error('Not implemented');
  }
}
