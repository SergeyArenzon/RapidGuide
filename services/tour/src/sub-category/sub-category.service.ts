import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { SubCategory } from './entities/sub-category';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectRepository(SubCategory)
    private subCategoryRepository: EntityRepository<SubCategory>,
  ) {}

  findAll(): Promise<SubCategory[]> {
    return this.subCategoryRepository.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} subCategory`;
  }
}
