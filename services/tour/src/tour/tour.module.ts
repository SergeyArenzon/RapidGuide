import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TourService } from './tour.service';
import { TourController } from './tour.controller';
import { Tour } from './tour.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Tour])],
  providers: [TourService],
  controllers: [TourController],
})
export class TourModule {}
