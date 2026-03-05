import { Module } from '@nestjs/common';
import { TravellerController } from './traveller.controller';
import { TravellerService } from './traveller.service';
import { Traveller } from './entities/traveller.entity';
import { TravellerSubcategory } from './entities/traveller-subcategory.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CountryModule } from '../country/country.module';
import { CityModule } from '../city/city.module';
import { LanguagesModule } from '../languages/languages.module';
import { RabbitmqModule } from '../rabbitmq/rabbitmq.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([Traveller, TravellerSubcategory]),
    CountryModule,
    CityModule,
    LanguagesModule,
    RabbitmqModule,
  ],
  controllers: [TravellerController],
  providers: [TravellerService],
  exports: [TravellerService],
})
export class TravellerModule {}
