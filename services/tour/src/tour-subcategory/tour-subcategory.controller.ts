import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TourSubcategoryService } from './tour-subcategory.service';
import { CreateTourSubcategoryDto } from './dto/create-tour-subcategory.dto';
import { UpdateTourSubcategoryDto } from './dto/update-tour-subcategory.dto';

@Controller('tour-subcategory')
export class TourSubcategoryController {
  constructor(private readonly tourSubcategoryService: TourSubcategoryService) {}

  @Post()
  create(@Body() createTourSubcategoryDto: CreateTourSubcategoryDto) {
    return this.tourSubcategoryService.create(createTourSubcategoryDto);
  }

  @Get()
  findAll() {
    return this.tourSubcategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tourSubcategoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTourSubcategoryDto: UpdateTourSubcategoryDto) {
    return this.tourSubcategoryService.update(+id, updateTourSubcategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tourSubcategoryService.remove(+id);
  }
}
