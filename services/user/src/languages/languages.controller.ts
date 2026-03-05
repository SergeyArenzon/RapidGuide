import { Controller, Get, HttpCode } from '@nestjs/common';
import { LanguagesService } from './languages.service';
import { Languages } from './languages.entity';
import { Public } from '@rapid-guide-io/decorators';

@Controller('languages')
export class LanguagesController {
  constructor(private languagesService: LanguagesService) {}

  @Get()
  @Public()
  getLanguages(): Promise<Languages[]> {
    return this.languagesService.getLanguages();
  }
}
