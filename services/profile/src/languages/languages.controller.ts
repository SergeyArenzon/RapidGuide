import { Controller, Get, HttpCode } from '@nestjs/common';
import { LanguagesService } from './languages.service';
import { Languages } from './languages.entity';

@Controller('languages')
export class LanguagesController {
  constructor(private languagesService: LanguagesService) {}

  @Get()
  @HttpCode(200) // Set the HTTP status code to 200
  getLanguages(): Promise<Languages[]> {
    return this.languagesService.getLanguages();
  }
}
