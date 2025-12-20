import { Injectable } from '@nestjs/common';
import { CreateTourSubcategoryDto } from './dto/create-tour-subcategory.dto';
import { UpdateTourSubcategoryDto } from './dto/update-tour-subcategory.dto';

@Injectable()
export class TourSubcategoryService {
  create(createTourSubcategoryDto: CreateTourSubcategoryDto) {
    return 'This action adds a new tourSubcategory';
  }

  findAll() {
    return `This action returns all tourSubcategory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tourSubcategory`;
  }

  update(id: number, updateTourSubcategoryDto: UpdateTourSubcategoryDto) {
    return `This action updates a #${id} tourSubcategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} tourSubcategory`;
  }
}
