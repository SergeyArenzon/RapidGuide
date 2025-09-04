import { Module } from '@nestjs/common';
import { CityService } from './city.service';
import { CityController } from './city.controller';
import { City } from './city.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from '../config';

@Module({
  imports: [
    MikroOrmModule.forFeature([City]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  controllers: [CityController],
  providers: [CityService],
})
export class CityModule {}
