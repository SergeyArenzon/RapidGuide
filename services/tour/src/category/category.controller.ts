import { Controller, Get } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto } from '@rapid-guide-io/dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  findAll(): Promise<CategoryDto[]> {
    return this.categoryService
      .findAll()
      .then((categories) => categories.map((category) => category.toDto()));
  }
}
