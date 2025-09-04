import { Module } from '@nestjs/common';
import { CountryService } from './country.service';
import { CountryController } from './country.controller';
import { Country } from './country.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/config';

@Module({
  imports: [
    MikroOrmModule.forFeature([Country]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  controllers: [CountryController],
  providers: [CountryService],
})
export class CountryModule {}
