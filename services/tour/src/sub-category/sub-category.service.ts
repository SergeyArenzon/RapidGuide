import { Injectable } from '@nestjs/common';
import { SubCategory } from './entities/sub-category';


@Injectable()
export class SubCategoryService {

  findAll(): Promise<SubCategory[]> {
    return `This action returns all subCategory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subCategory`;
  }
}
