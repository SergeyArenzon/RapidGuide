import { Module } from '@nestjs/common';
import { TravellerController } from './traveller.controller';
import { Traveller } from './traveller.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [MikroOrmModule.forFeature([Traveller])],
  controllers: [TravellerController],
})
export class TravellerModule {}
