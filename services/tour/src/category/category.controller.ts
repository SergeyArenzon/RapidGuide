import { Controller, Get } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto } from '@rapid-guide-io/shared';


@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAll(): Promise<CategoryDto[]> {
    const categories = await this.categoryService.findAll();
    return categories.map(category => category.toDto());
  }

}
