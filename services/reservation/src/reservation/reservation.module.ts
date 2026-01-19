import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { Reservation } from './entities/reservation.entity';
import { ReservationTraveller } from './entities/reservation-traveller.entity';
import { ReservationAvailability } from './entities/reservation-availability.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Reservation, ReservationTraveller, ReservationAvailability])],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
