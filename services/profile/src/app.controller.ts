import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller()
export class AppController {
  @Get('/health')
  async health() {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  root(@Req() req: Request) {
    const user = (req as any).user;
    console.log({ user });

    return { message: user?.id };
  }
}
