import { Controller, Get, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto } from '@rapid-guide-io/dto';
import { RolesGuard, ScopesGuard } from '@rapid-guide-io/guards';
import {
  Role,
  Roles,
  ScopePermission,
  Scopes,
} from '@rapid-guide-io/decorators';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @UseGuards(RolesGuard, ScopesGuard)
  @Roles(Role.CLIENT)
  @Scopes([ScopePermission.CATEGORY_READ])
  findAll(): Promise<CategoryDto[]> {
    return this.categoryService
      .findAll()
      .then((categories) => categories.map((category) => category.toDto()));
  }
}
