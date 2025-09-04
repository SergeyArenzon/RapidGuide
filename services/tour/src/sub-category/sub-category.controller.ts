import { Controller, Get, UseGuards } from '@nestjs/common';
import { SubCategoryService } from './sub-category.service';
import { SubCategoryDto } from '@rapid-guide-io/dto';
import { RolesGuard, ScopesGuard } from '@rapid-guide-io/guards';
import {
  Role,
  Roles,
  ScopePermission,
  Scopes,
} from '@rapid-guide-io/decorators';

@Controller('sub-category')
export class SubCategoryController {
  constructor(private readonly subCategoryService: SubCategoryService) {}

  @Get()
  @UseGuards(RolesGuard, ScopesGuard)
  @Roles(Role.CLIENT)
  @Scopes([ScopePermission.SUBCATEGORY_READ])
  findAll(): Promise<SubCategoryDto[]> {
    return this.subCategoryService
      .findAll()
      .then((subCategories) =>
        subCategories.map((subCategory) => subCategory.toDto()),
      );
  }
}
