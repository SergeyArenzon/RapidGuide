import { Controller, Get, Query } from '@nestjs/common';
import { CityService } from './city.service';

@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get()
  async getCities(@Query('countryCode') countryCode: string) {
    console.log("-=-=-=-=-=-=-=-=-");
    
    return [{
      id: 1,
      name: "New York",
      country_code: "US"
    }];
  }
}
