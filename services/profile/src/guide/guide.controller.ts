import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { GuideService } from './guide.service';
import { ZodValidationPipe } from '@rapid-guide-io/pipes';
import {
  ScopePermission,
  Scopes,
  CurrentUser,
} from '@rapid-guide-io/decorators';
import { ScopesGuard } from '@rapid-guide-io/guards';
import {
  GuideDto,
  createGuideSchema,
  CreateGuideDto,
} from '@rapid-guide-io/contracts';

@Controller('guide')
export class GuideController {
  constructor(private readonly guideService: GuideService) {}

  @Post()
  @UseGuards(ScopesGuard)
  @Scopes([ScopePermission.GUIDE_WRITE])
  async create(
    @CurrentUser() user,
    @Body(new ZodValidationPipe(createGuideSchema)) body: CreateGuideDto,
  ): Promise<GuideDto> {
    return await this.guideService.create(user.id, body);
  }

  // @Get()
  // // @UseGuards(RolesGuard, ScopesGuard)
  // @Roles(Role.CLIENT)
  // @Scopes([ScopePermission.GUIDE_READ])
  // async getGuide(@Subject() userId: string): Promise<GuideDto> {
  //   return await this.guideService.findByUserId(userId);
  // }
}
