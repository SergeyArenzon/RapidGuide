import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { Category } from './entities/category.entity';


@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private categoryRepository: EntityRepository<Category>,
    private readonly em: EntityManager,
  ) {}
}
