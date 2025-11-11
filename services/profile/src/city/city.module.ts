import { Module } from '@nestjs/common';
import { CityService } from './city.service';
import { CityController } from './city.controller';
import { City } from './city.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [
    MikroOrmModule.forFeature([City]),
  ],
  controllers: [CityController],
  providers: [CityService],
})
export class CityModule {}
