import { Controller, Post, Body, Param } from '@nestjs/common';
import { GuideService } from './guide.service';
import { CreateGuideDto } from './dto/create-guide.dto';

@Controller('guide')
export class GuideController {
  constructor(private readonly guideService: GuideService) {}

  @Post()
  async create(
    @Body() body: CreateGuideDto,
    @Param('user_id') user_id: string,
  ) {
    console.log('[][][][][', body, user_id);
    return this.guideService.create(body);
  }
}
