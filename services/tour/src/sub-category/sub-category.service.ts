import { Injectable } from '@nestjs/common';


@Injectable()
export class SubCategoryService {

  findAll() {
    return `This action returns all subCategory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subCategory`;
  }
}
