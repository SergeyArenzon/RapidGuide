import { Controller, Get, HttpCode } from '@nestjs/common';
import { Public } from './auth/decorators/public.decorator';

@Controller()
export class AppController {
  constructor() {}

  @Public()
  @HttpCode(200)
  @Get('/health')
  health() {}
}
