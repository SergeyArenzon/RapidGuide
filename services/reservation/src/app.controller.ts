import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from '@rapid-guide-io/decorators';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('health')
  health() {}
}
