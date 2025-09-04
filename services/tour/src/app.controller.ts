import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import {
  Role,
  Roles,
  ScopePermission,
  Scopes,
} from '@rapid-guide-io/decorators';
import { ScopesGuard, RolesGuard } from '@rapid-guide-io/guards';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(RolesGuard, ScopesGuard)
  @Roles(Role.CLIENT)
  @Scopes([ScopePermission.TOUR_READ])
  getHello(): string {
    return this.appService.getHello();
  }
}
