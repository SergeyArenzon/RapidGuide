import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { GuideService } from './guide.service';
import { AvailabilityService } from './availability.service';
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
  constructor(
    private readonly guideService: GuideService,
    private readonly availabilityService: AvailabilityService,
  ) {}

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
    @Body(new ZodValidationPipe(postGuideAvailabilitiesRequestSchema))
    body: Array<PostGuideAvailabilitiesRequestDto>,
  ): Promise<GuideAvailabilityDto[]> {
    return await this.availabilityService.createAvailabilities(
      guideId,
      body,
    );
  }

  @Get('availabilities')
  @UseGuards(ScopesGuard)
  @Scopes([ScopePermission.GUIDE_READ])
  async getAvailabilities(
    @GuideId() guideId: string,
  ): Promise<GuideAvailabilityDto[]> {
    return await this.availabilityService.findAvailabilitiesByGuideId(
      guideId,
    );
  }

  @Delete('availabilities/:id')
  @UseGuards(ScopesGuard)
  @Scopes([ScopePermission.GUIDE_DELETE])
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAvailability(
    @GuideId() guideId: string,
    @Param('id') availabilityId: string,
  ): Promise<void> {
    await this.availabilityService.deleteAvailability(
      guideId,
      availabilityId,
    );
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
