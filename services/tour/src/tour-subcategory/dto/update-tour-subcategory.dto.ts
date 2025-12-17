import { PartialType } from '@nestjs/mapped-types';
import { CreateTourSubcategoryDto } from './create-tour-subcategory.dto';

export class UpdateTourSubcategoryDto extends PartialType(CreateTourSubcategoryDto) {}
