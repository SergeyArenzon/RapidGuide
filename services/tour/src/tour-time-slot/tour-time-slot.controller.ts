import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TourTimeSlotService } from './tour-time-slot.service';
import { CreateTourTimeSlotDto } from './dto/create-tour-time-slot.dto';
import { UpdateTourTimeSlotDto } from './dto/update-tour-time-slot.dto';

@Controller('tour-time-slot')
export class TourTimeSlotController {
  constructor(private readonly tourTimeSlotService: TourTimeSlotService) {}

  @Post()
  create(@Body() createTourTimeSlotDto: CreateTourTimeSlotDto) {
    return this.tourTimeSlotService.create(createTourTimeSlotDto);
  }

  @Get()
  findAll() {
    return this.tourTimeSlotService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tourTimeSlotService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTourTimeSlotDto: UpdateTourTimeSlotDto) {
    return this.tourTimeSlotService.update(+id, updateTourTimeSlotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tourTimeSlotService.remove(+id);
  }
}
