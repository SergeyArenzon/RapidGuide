import { Controller, Get, Param, Query } from '@nestjs/common';
import { CityService } from './city.service';

@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get()
  async getCities() {
    return this.cityService.getCities();
  }

  @Get()
  async getCitiesByCountry(@Query('countryCode') countryCode: string) {
    return this.cityService.getCitiesByCountry(countryCode);
  }
}
