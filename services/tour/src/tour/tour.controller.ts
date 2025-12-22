import { Body, Controller, Post } from '@nestjs/common';
import { TourService } from './tour.service';
import { CreateTourDto, TourDto } from '@rapid-guide-io/contracts';

@Controller('tour')
export class TourController {
  constructor(private readonly tourService: TourService) {}

  @Post()
  create(@Body() createTourDto: CreateTourDto): Promise<TourDto> {
    return this.tourService.create(createTourDto);
  }
}
