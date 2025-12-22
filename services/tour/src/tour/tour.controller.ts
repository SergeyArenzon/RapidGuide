import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TourService } from './tour.service';
import { CreateTourDto, TourDto } from '@rapid-guide-io/contracts';
import { ScopesGuard } from '@rapid-guide-io/guards';
import { ScopePermission, Scopes, GuideId } from '@rapid-guide-io/decorators';

@Controller('tour')
export class TourController {
  constructor(private readonly tourService: TourService) {}

  @Post()
  @UseGuards(ScopesGuard)
  @Scopes([ScopePermission.TOUR_CREATE])
  create(
    @GuideId() guideId: string,
    @Body() createTourDto: CreateTourDto,
  ): Promise<TourDto> {
    return this.tourService.create(guideId, createTourDto);
  }
}
