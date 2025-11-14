import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { Public, Service } from '@rapid-guide-io/decorators';
import { ServiceToServiceGuard } from '@rapid-guide-io/guards';

@Controller()
export class AppController {
  @Get('/health')
  @Public()
  async health() {}

  @Get('/:userId')
  @Service()
  @UseGuards(ServiceToServiceGuard)
  root(@Param('userId') userId: string) {
    return { message: userId };
  }
}
