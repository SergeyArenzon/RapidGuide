import { Controller, Post, Body, Param, UsePipes } from '@nestjs/common';
import { GuideService } from './guide.service';
import { CreateGuideDto, createGuideSchema } from './dto/create-guide.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('guide')
export class GuideController {
  constructor(private readonly guideService: GuideService) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(createGuideSchema)) body: CreateGuideDto,
    @Param('user_id') user_id: string,
  ) {
    console.log('[][][][][', body, user_id);
    return this.guideService.create(body);
  }
}
