import { Controller, Post, Body, Req, Get } from '@nestjs/common';
import { GuideService } from './guide.service';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { Request } from 'express';
import {
  CreateGuideDto,
  createGuideSchema,
  GuideDto,
  UserDto,
} from '@rapid-guide-io/shared';
import { CurrentUser } from 'src/decorators/current-user.decorator';

@Controller('guide')
export class GuideController {
  constructor(private readonly guideService: GuideService) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(createGuideSchema)) body: CreateGuideDto,
    @CurrentUser() currentUser: UserDto,
  ): Promise<GuideDto> {
    return await this.guideService.create(currentUser.id, body);
  }

  @Get()
  async getGuide(@Req() req: Request): Promise<GuideDto> {
    const user = req['user'];
    return await this.guideService.findByUserId(user.id);
  }
}
