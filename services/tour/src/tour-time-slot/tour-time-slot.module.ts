import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TourTimeSlotService } from './tour-time-slot.service';
import { TourTimeSlotController } from './tour-time-slot.controller';
import { TourTimeSlot } from './entities/tour-time-slot.entity';

@Module({
  imports: [MikroOrmModule.forFeature([TourTimeSlot])],
  controllers: [TourTimeSlotController],
  providers: [TourTimeSlotService],
})
export class TourTimeSlotModule {}
