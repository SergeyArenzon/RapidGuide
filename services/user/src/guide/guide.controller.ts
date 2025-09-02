import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { GuideService } from './guide.service';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import {
  CreateGuideDto,
  createGuideSchema,
  GuideDto,
  UserDto,
} from '@rapid-guide-io/dto';
import { Subject } from 'src/decorators/subject.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { ScopesGuard } from 'src/guards/scope.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Scopes } from 'src/decorators/scope.decorator';

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
