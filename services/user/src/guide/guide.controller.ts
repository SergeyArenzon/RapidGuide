import { Controller, Post, Body } from '@nestjs/common';
import { GuideService } from './guide.service';
import { CreateGuideDto } from './dto/create-guide.dto';

@Controller('guide')
export class GuideController {
  constructor(private readonly guideService: GuideService) {}

  @Post()
  async create(@Body() body: CreateGuideDto) {
    console.log('[][][][][', body);
    return this.guideService.create(body);
  }
}
