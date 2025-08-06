import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { SubCategory } from './entities/sub-category';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectRepository(SubCategory) private subCategoryRepository: EntityRepository<SubCategory>,
    private readonly em: EntityManager,
  ) {}

  async findAll(): Promise<SubCategory[]> {
    const subCategories = await this.subCategoryRepository.findAll();
    return subCategories;
  }

  findOne(id: number) {
    return `This action returns a #${id} subCategory`;
  }
}
