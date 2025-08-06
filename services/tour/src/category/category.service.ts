import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { Category } from './entities/category.entity';
import { SubCategory } from '../sub-category/entities/sub-category';


@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private categoryRepository: EntityRepository<Category>,
    private readonly em: EntityManager,
  ) {}


  async findAll() {
    // Find all categories
    // const categories = await this.categoryRepository.findAll();
    
    // // Fetch all subcategories in a single query
    // const allSubcategories = await this.em.find(SubCategory, {});
    
    // // Group subcategories by category id
    // const subcategoriesByCategory = allSubcategories.reduce((acc, subcategory) => {
    //   const categoryId = subcategory.category.id;
    //   if (!acc[categoryId]) {
    //     acc[categoryId] = [];
    //   }
    //   acc[categoryId].push(subcategory);
    //   return acc;
    // }, {} as Record<string, SubCategory[]>);
    
    // // Map categories with their subcategories
    // const result = categories.map(category => {
    //   return {
    //     ...category,
    //     subcategories: subcategoriesByCategory[category.id] || []
    //   } as ResponseCategoryDto;
    // });
    
    return [];
  }

}
