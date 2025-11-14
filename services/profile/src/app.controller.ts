import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Public } from '@rapid-guide-io/decorators';
import { ScopesGuard } from '@rapid-guide-io/guards';
import { Scopes } from '@rapid-guide-io/decorators';

@Controller()
export class AppController {
  @Get('/health')
  @Public()
  async health() {}

  @Get('/')
  @Scopes(['profile:read'])
  @UseGuards(ScopesGuard)
  root(@Req() req: Request) {
    const user = (req as any).user;
    console.log({ user });

    return { message: user?.id };
  }
}
