import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { GuideService } from './guide.service';
import { CreateGuideDto, ResponseGuideDto } from './dto/guide.dto';

@Controller('guide')
export class GuideController {
  constructor(private guideService: GuideService) {}

  @HttpCode(200)
  @Get('/')
  health() {}

  @Post('/')
  async create(@Body() body: CreateGuideDto): Promise<ResponseGuideDto> {
    return this.guideService.create(body);
  }
}
