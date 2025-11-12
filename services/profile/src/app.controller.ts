import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller()
@AllowAnonymous()
export class AppController {
  constructor() {}

  @HttpCode(200)
  @Get('/health')
  health() {}


  @UseGuards(JwtAuthGuard)
  @Get('/')
  root() {
    return { message: 'authorized' };
  }

  
}
