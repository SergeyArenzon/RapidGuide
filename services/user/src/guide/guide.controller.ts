import { Controller, Post, Body } from '@nestjs/common';
import { GuideService } from './guide.service';
import { CreateGuideDto } from './dto/create-guide.dto';
import { ResponseGuideDto } from './dto/response-guide.dto';

@Controller('guide')
export class GuideController {
  constructor(private readonly guideService: GuideService) {}

  @Post()
  async create(@Body() body: CreateGuideDto): Promise<ResponseGuideDto> {
    return this.guideService.create(body);
  }
}
