import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CityService } from './city.service';
import { CityDto } from '@rapid-guide-io/contracts';

@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get()
  // @UseGuards(RolesGuard, ScopesGuard)
  // @Roles(Role.CLIENT)
  // @Scopes([ScopePermission.USER_READ])
  async getCities(
    @Query('countryCode') countryCode: string,
  ): Promise<CityDto[]> {
    return (await this.cityService.getCities(countryCode)).map((city) =>
      city.toDto(),
    );
  }
}
