import { Controller, Get, Param } from '@nestjs/common';
import { CityService } from './city.service';

@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get()
  async getCities() {
    return this.cityService.getCities();
  }

  @Get('country/:countryCode')
  async getCitiesByCountry(@Param('countryCode') countryCode: string) {
    return this.cityService.getCitiesByCountry(countryCode);
  }
}
