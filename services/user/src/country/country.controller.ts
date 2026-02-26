import { Controller, Get, UseGuards } from '@nestjs/common';
import { CountryService } from './country.service';

@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  // @UseGuards(RolesGuard, ScopesGuard)
  // @Roles(Role.CLIENT)
  // @Scopes([ScopePermission.USER_READ])
  async getCountries() {
    return this.countryService.getCountries();
  }
}
