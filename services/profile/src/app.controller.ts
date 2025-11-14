import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { Public } from '@rapid-guide-io/decorators';
import { ScopesGuard } from '@rapid-guide-io/guards';
import { Scopes } from '@rapid-guide-io/decorators';

@Controller()
export class AppController {
  @Get('/health')
  @Public()
  async health() {}

  @Get('/:userId')
  @Public()
  root(@Param('userId') userId: string) {

    return { message: userId};
  }
}
