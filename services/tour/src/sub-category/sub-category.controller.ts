import { Controller, Get } from '@nestjs/common';
import { SubCategoryService } from './sub-category.service';
import { SubCategoryDto } from '@rapid-guide-io/shared';

@Controller('sub-category')
export class SubCategoryController {
  constructor(private readonly subCategoryService: SubCategoryService) {}

  @Get()
  findAll(): Promise<SubCategoryDto[]> {
    return this.subCategoryService
      .findAll()
      .then((subCategories) =>
        subCategories.map((subCategory) => subCategory.toDto()),
      );
  }
}
