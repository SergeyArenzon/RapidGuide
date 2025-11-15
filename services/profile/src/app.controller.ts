import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { Public, Service } from '@rapid-guide-io/decorators';
import { ServiceToServiceGuard } from '@rapid-guide-io/guards';
import { AppService } from './app.service';
import { GetProfilesResponseDto } from '@rapid-guide-io/contracts';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get('/health')
  @Public()
  async health() {}

  @Get('/:userId')
  @Service()
  @UseGuards(ServiceToServiceGuard)
  async root(@Param('userId') userId: string): Promise<GetProfilesResponseDto> {
    const userProfiles = await this.appService.getProfilesByUserId(userId);
    return userProfiles;
  }
}
