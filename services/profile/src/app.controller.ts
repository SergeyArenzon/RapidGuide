import { Controller, Get, HttpCode } from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@Controller()
@AllowAnonymous()
export class AppController {
  constructor() {}

  @HttpCode(200)
  @Get('/health')
  health() {}

  
}
