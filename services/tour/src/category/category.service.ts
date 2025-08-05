import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { Category } from './entities/category.entity';
import { SubCategory } from '../sub-category/entities/sub-category';
import { ResponseCategoryDto } from './dto/response-category.dto';


@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private categoryRepository: EntityRepository<Category>,
    private readonly em: EntityManager,
  ) {}


  async findAll(): Promise<Category[]> {
    // Find all categories
    const categories = await this.categoryRepository.findAll();
    
    // Fetch all subcategories in a single query
    const allSubcategories = await this.em.find(SubCategory, {});
    
    // Group subcategories by category id
    const subcategoriesByCategory = allSubcategories.reduce((acc, subcategory) => {
      const categoryId = subcategory.category.id;
      if (!acc[categoryId]) {
        acc[categoryId] = [];
      }
      acc[categoryId].push(subcategory);
      return acc;
    }, {} as Record<string, SubCategory[]>);
    
    // Map categories with their subcategories
    const result = categories.map(category => {
      return {
        ...category,
        subcategories: subcategoriesByCategory[category.id] || []
      } as ResponseCategoryDto;
    });
    
    return result;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
