import { Controller, Get, Query } from '@nestjs/common';
import { CityService } from './city.service';
import { CityDto } from '@rapid-guide-io/shared';
import { City } from './city.entity';

@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get()
  async getCities(@Query('countryCode') countryCode: string): Promise<City[]> {
    return this.cityService.getCitiesByCountry(countryCode);
  }
}
