import { Controller, Get, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto } from '@rapid-guide-io/dto';
import { Public, Scopes } from '@rapid-guide-io/decorators';
import { ScopesGuard } from '@rapid-guide-io/guards';


@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @Public()
  @UseGuards(ScopesGuard)
  @Scopes(['category:read'])
  findAll(): Promise<CategoryDto[]> {
    return this.categoryService
      .findAll()
      .then((categories) => categories.map((category) => category.toDto()));
  }
}
