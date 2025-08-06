import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubCategoryService } from './sub-category.service';
import { SubCategoryDto } from "@rapid-guide-io/shared"

@Controller('sub-category')
export class SubCategoryController {
  constructor(private readonly subCategoryService: SubCategoryService) {}

  @Get()
  async findAll(): Promise<SubCategoryDto[]> {
    const subCategories = await this.subCategoryService.findAll();
    return subCategories.map(subCategory => subCategory.toDto());
  }
}
