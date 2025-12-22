import { Controller, Get, UseGuards } from '@nestjs/common';
import { SubCategoryService } from './sub-category.service';
import { SubCategoryDto } from '@rapid-guide-io/dto';
import { ScopesGuard } from '@rapid-guide-io/guards';
import { Scopes, ScopePermission } from '@rapid-guide-io/decorators';

@Controller('sub-category')
export class SubCategoryController {
  constructor(private readonly subCategoryService: SubCategoryService) {}

  @Get()
  @UseGuards(ScopesGuard)
  @Scopes([ScopePermission.SUBCATEGORY_READ])
  findAll(): Promise<SubCategoryDto[]> {
    return this.subCategoryService
      .findAll()
      .then((subCategories) =>
        subCategories.map((subCategory) => subCategory.toDto()),
      );
  }
}
