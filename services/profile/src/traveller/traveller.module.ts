import { Module } from '@nestjs/common';
import { TravellerController } from './traveller.controller';

@Module({
  controllers: [TravellerController],
})
export class TravellerModule {}
