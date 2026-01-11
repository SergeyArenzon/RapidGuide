import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { GuideService } from './guide.service';
import { ZodValidationPipe } from '@rapid-guide-io/pipes';
import {
  ScopePermission,
  Scopes,
  CurrentUser,
  GuideId,
} from '@rapid-guide-io/decorators';
import { ScopesGuard } from '@rapid-guide-io/guards';
import {
  GuideDto,
  createGuideSchema,
  CreateGuideDto,
  GuideAvailabilityDto,
  postGuideAvailabilitiesRequestSchema,
  PostGuideAvailabilitiesRequestDto,
} from '@rapid-guide-io/contracts';

@Controller('guide')
export class GuideController {
  constructor(private readonly guideService: GuideService) {}

  @Post()
  @UseGuards(ScopesGuard)
  @Scopes([ScopePermission.GUIDE_CREATE])
  async create(
    @CurrentUser() user,
    @Body(new ZodValidationPipe(createGuideSchema)) body: CreateGuideDto,
  ): Promise<GuideDto> {
    return await this.guideService.create(user.id, body);
  }

  @Post('availabilities')
  @UseGuards(ScopesGuard)
  @Scopes([ScopePermission.GUIDE_UPDATE])
  async createAvailabilities(
    @GuideId() guideId: string,
    @Body(new ZodValidationPipe(postGuideAvailabilitiesRequestSchema)) body: Array<PostGuideAvailabilitiesRequestDto>,
  ): Promise<GuideAvailabilityDto[]> {
    return await this.guideService.createAvailabilities(guideId, body);
  }

  @Get(':id/availabilities')
  @UseGuards(ScopesGuard)
  @Scopes([ScopePermission.GUIDE_READ])
  async getAvailabilities(@Param('id') id: string): Promise<GuideAvailabilityDto[]> {
    return await this.guideService.findAvailabilitiesByGuideId(id);
  }

  @Get(':id')
  @UseGuards(ScopesGuard)
  @Scopes([ScopePermission.GUIDE_READ])
  async findOne(@Param('id') id: string): Promise<GuideDto> {
    const guide = await this.guideService.findById(id);
    if (!guide) {
      throw new NotFoundException(`Guide with id ${id} not found`);
    }
    return guide;
  }
}
