import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { GuideService } from './guide.service';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import {
  CreateGuideDto,
  createGuideSchema,
  GuideDto,
  UserDto,
} from '@rapid-guide-io/dto';
import { Subject, Roles, Scopes } from '@rapid-guide-io/decorators';
import { RolesGuard, ScopesGuard } from '@rapid-guide-io/guards';


@Controller('guide')
export class GuideController {
  constructor(private readonly guideService: GuideService) {}

  @Post()
  @UseGuards(RolesGuard, ScopesGuard)
  @Roles('client')
  @Scopes(['guide:create'])
  async create(
    @Body(new ZodValidationPipe(createGuideSchema)) body: CreateGuideDto,
    @Subject() userId: string,
  ): Promise<GuideDto> {
    return await this.guideService.create(userId, body);
  }

  @Get()
  @UseGuards(RolesGuard, ScopesGuard)
  @Roles('client')
  @Scopes(['guide:read'])
  async getGuide(@Subject() userId: string): Promise<GuideDto> {
    return await this.guideService.findByUserId(userId);
  }
}
