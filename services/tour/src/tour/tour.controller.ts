import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TourService } from './tour.service';
import { CreateTourDto, TourDto } from '@rapid-guide-io/contracts';
import { ScopesGuard } from '@rapid-guide-io/guards';
import { ScopePermission, Scopes, GuideId } from '@rapid-guide-io/decorators';

@Controller('tour')
export class TourController {
  constructor(private readonly tourService: TourService) {}

  @Get()
  @UseGuards(ScopesGuard)
  @Scopes([ScopePermission.TOUR_READ])
  findAll(
    @Query('city_id') cityId?: string,
    @Query('guide_id') guideId?: string,
  ): Promise<TourDto[]> {
    // If guide_id is provided, filter by guide
    if (guideId) {
      return this.tourService.findByGuide(guideId);
    }
    // If city_id is provided, filter by city
    if (cityId) {
      const cityIdNum = parseInt(cityId, 10);
      if (isNaN(cityIdNum)) {
        return this.tourService.findAll();
      }
      return this.tourService.findByCity(cityIdNum);
    }
    // Otherwise return all tours
    return this.tourService.findAll();
  }

  @Get(':id')
  @UseGuards(ScopesGuard)
  @Scopes([ScopePermission.TOUR_READ])
  findOne(@Param('id') id: string): Promise<TourDto> {
    return this.tourService.findOne(id);
  }

  @Post()
  @UseGuards(ScopesGuard)
  @Scopes([ScopePermission.TOUR_CREATE])
  create(
    @GuideId() guideId: string,
    @Body() createTourDto: CreateTourDto,
  ): Promise<TourDto> {
    return this.tourService.create(guideId, createTourDto);
  }

  @Put(':id')
  @UseGuards(ScopesGuard)
  @Scopes([ScopePermission.TOUR_UPDATE])
  update(
    @Param('id') id: string,
    @Body() updateTourDto: CreateTourDto,
  ): Promise<TourDto> {
    return this.tourService.update(id, updateTourDto);
  }

  @Delete(':id')
  @UseGuards(ScopesGuard)
  @Scopes([ScopePermission.TOUR_DELETE])
  remove(@Param('id') id: string): Promise<void> {
    return this.tourService.remove(id);
  }
}
