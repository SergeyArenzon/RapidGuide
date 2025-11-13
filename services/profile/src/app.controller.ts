import { Controller, Get, Req } from '@nestjs/common';
import { Public } from './decorators/public.decorator';

@Controller()
export class AppController {

  @Get('/health')
  @Public()
  async health() {}

  @Get('/')
  root(@Req() req: Request) {
    const user = (req as any).user;
    console.log({ user });

    return { message: user?.id };
  }
}
