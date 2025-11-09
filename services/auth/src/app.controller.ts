import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  Logger,
  UnauthorizedException,
  Res,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor() {}

  @AllowAnonymous()
  @HttpCode(200)
  @Get('/health')
  health() {}


}
