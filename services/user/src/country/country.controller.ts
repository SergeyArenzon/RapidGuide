import { Controller, Get, UseGuards } from '@nestjs/common';
import { CountryService } from './country.service';
import { RolesGuard, ScopesGuard } from '@rapid-guide-io/guards';
import {
  Role,
  Roles,
  ScopePermission,
  Scopes,
} from '@rapid-guide-io/decorators';

@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  @UseGuards(RolesGuard, ScopesGuard)
  @Roles(Role.CLIENT)
  @Scopes([ScopePermission.USER_READ])
  async getCountries() {
    return this.countryService.getCountries();
  }
}
