import { Controller, Get, HttpCode } from '@nestjs/common';
import { Public } from './decorators/public.decorator';

@Controller()
export class AppController {
  constructor() {}

  @Public()
  @HttpCode(200)
  @Get('/health')
  health() {}
}
