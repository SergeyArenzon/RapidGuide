import { Module } from '@nestjs/common';
import { GuideController } from './guide.controller';
import { GuideService } from './guide.service';
import { AvailabilityService } from './availability.service';
import { Guide } from './entities/guide.entity';
import { GuideSubcategory } from './entities/guide-subcategory.entity';
import { GuideAvailability } from './entities/guide-availability.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
// import { JwtModule } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
// import { jwtConfig } from '../config';
import { CountryModule } from '../country/country.module';
import { CityModule } from '../city/city.module';
import { LanguagesModule } from '../languages/languages.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([Guide, GuideSubcategory, GuideAvailability]),
    CountryModule,
    CityModule,
    LanguagesModule,
    // JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  controllers: [GuideController],
  providers: [GuideService, AvailabilityService, Reflector],
  exports: [GuideService, AvailabilityService],
})
export class GuideModule {}
