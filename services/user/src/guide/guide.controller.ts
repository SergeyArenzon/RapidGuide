import { Controller, Post, Body, Get } from '@nestjs/common';
import { GuideService } from './guide.service';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import {
  CreateGuideDto,
  createGuideSchema,
  GuideDto,
  UserDto,
} from '@rapid-guide-io/shared';
import { User } from 'src/decorators/user.decorator';

@Controller('guide')
export class GuideController {
  constructor(private readonly guideService: GuideService) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(createGuideSchema)) body: CreateGuideDto,
    @User() user: UserDto,
  ): Promise<GuideDto> {
    return await this.guideService.create(user.id, body);
  }

  @Get()
  async getGuide(@User() user: UserDto): Promise<GuideDto> {
    return await this.guideService.findByUserId(user.id);
  }
}
