import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { Reservation } from './entities/reservation.entity';
import { ReservationTraveller } from './entities/reservation-traveller.entity';
import { ReservationAvailability } from './entities/reservation-availability.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Reservation, ReservationTraveller, ReservationAvailability])],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
