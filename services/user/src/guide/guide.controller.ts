import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { GuideService } from './guide.service';
import { ZodValidationPipe } from '@rapid-guide-io/pipes';
import {
  CreateGuideDto,
  createGuideSchema,
  GuideDto,
  UserDto,
  userSchema,
} from '@rapid-guide-io/dto';
import {
  Subject,
  Roles,
  Scopes,
  Role,
  ScopePermission,
  ResponseSchema,
} from '@rapid-guide-io/decorators';
import { RolesGuard, ScopesGuard } from '@rapid-guide-io/guards';

@Controller('guide')
export class GuideController {
  constructor(private readonly guideService: GuideService) {}

  @Post()
  @UseGuards(RolesGuard, ScopesGuard)
  @ResponseSchema(userSchema)
  @Roles(Role.CLIENT)
  @Scopes([ScopePermission.GUIDE_CREATE])
  async create(
    @Body(new ZodValidationPipe(createGuideSchema)) body: CreateGuideDto,
    @Subject() userId: string,
  ): Promise<GuideDto> {
    return await this.guideService.create(userId, body);
  }

  @Get()
  @UseGuards(RolesGuard, ScopesGuard)
  @Roles(Role.CLIENT)
  @Scopes([ScopePermission.GUIDE_READ])
  async getGuide(@Subject() userId: string): Promise<GuideDto> {
    return await this.guideService.findByUserId(userId);
  }
}
