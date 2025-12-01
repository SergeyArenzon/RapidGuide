import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { GuideService } from './guide.service';
import { ZodValidationPipe } from '@rapid-guide-io/pipes';
import { ScopePermission, Scopes } from '@rapid-guide-io/decorators';
import { ScopesGuard } from '@rapid-guide-io/guards';
import { GuideDto } from '@rapid-guide-io/contracts';

// import {
//   Subject,
//   Roles,
//   Scopes,
//   Role,
//   ScopePermission,
//   ResponseSchema,
// } from '@rapid-guide-io/decorators';
// import { RolesGuard, ScopesGuard } from '@rapid-guide-io/guards';

@Controller('guide')
export class GuideController {
  constructor(private readonly guideService: GuideService) {}

  @Post()
  @UseGuards(ScopesGuard)
  @Scopes([ScopePermission.GUIDE_CREATE])
  async create(
    @Body(new ZodValidationPipe(createGuideSchema)) body: CreateGuideDto,
  ): Promise<GuideDto> {
    return await this.guideService.create(userId, body);
  }

  // @Get()
  // // @UseGuards(RolesGuard, ScopesGuard)
  // @Roles(Role.CLIENT)
  // @Scopes([ScopePermission.GUIDE_READ])
  // async getGuide(@Subject() userId: string): Promise<GuideDto> {
  //   return await this.guideService.findByUserId(userId);
  // }
}
