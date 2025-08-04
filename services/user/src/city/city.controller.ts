import { Controller, Get, Query } from '@nestjs/common';
import { CityService } from './city.service';
import { CityDto } from '@rapid-guide-io/shared';

@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get()
  async getCities(@Query('countryCode') countryCode: string): Promise<any> {
    return this.cityService.getCitiesByCountry(countryCode);
  }
}
