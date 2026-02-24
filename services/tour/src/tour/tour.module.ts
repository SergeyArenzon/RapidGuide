import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TourService } from './tour.service';
import { TourController } from './tour.controller';
import { Tour } from './tour.entity';
import { RabbitmqModule } from '../rabbitmq/rabbitmq.module';

@Module({
  imports: [MikroOrmModule.forFeature([Tour]), RabbitmqModule],
  providers: [TourService],
  controllers: [TourController],
})
export class TourModule {}
