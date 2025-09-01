import { Controller, Get, HttpCode } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @HttpCode(200)
  @Get('/health')
  health() {}
}
