import { Body, Controller, Post } from '@nestjs/common';
import { TourService } from './tour.service';
import { TourDto } from '@rapid-guide-io/contracts';

@Controller('tour')
export class TourController {
  constructor(private readonly tourService: TourService) {}

  @Post()
  create(@Body() createTourDto: TourDto): Promise<TourDto> {
    return this.tourService.create(createTourDto);
  }
}
