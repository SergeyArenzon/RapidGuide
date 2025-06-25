import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CountryService } from './country.service';
import { CountryController } from './country.controller';
import { Country } from './country.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Country])],
  controllers: [CountryController],
  providers: [CountryService],
})
export class CountryModule {}
