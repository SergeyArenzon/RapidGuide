import { Controller, Get } from '@nestjs/common';
import { Public } from '@rapid-guide-io/decorators';

@Controller()
export class AppController {
  @Get('/health')
  @Public()
  async health() {}
}
