import { Controller, Post, Body, Get } from '@nestjs/common';
import { GuideService } from './guide.service';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import {
  CreateGuideDto,
  createGuideSchema,
  GuideDto,
  UserDto,
} from '@rapid-guide-io/dto';
import { Subject } from 'src/decorators/subject.decorator';

@Controller('guide')
export class GuideController {
  constructor(private readonly guideService: GuideService) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(createGuideSchema)) body: CreateGuideDto,
    @Subject() userId: string,
  ): Promise<GuideDto> {
    return await this.guideService.create(userId, body);
  }

  @Get()
  async getGuide(@Subject() userId: string): Promise<GuideDto> {
    return await this.guideService.findByUserId(userId);
  }
}
