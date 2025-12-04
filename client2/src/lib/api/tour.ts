import { z } from 'zod';
import { 
  categorySchema, 
  subCategorySchema 
} from '@rapid-guide-io/contracts';
import type { 
  CategoryDto, 
  SubCategoryDto
} from '@rapid-guide-io/contracts';
import { BaseApi } from './base';

export class TourApi extends BaseApi {
  static readonly baseUrl = '/tour';

  async getSubCategories(): Promise<Array<SubCategoryDto>> {
    return this.validateResponse(
      () => this.axios.get(`${TourApi.baseUrl}/sub-category`),
      z.array(subCategorySchema)
    );
  }

  async getCategories(): Promise<Array<CategoryDto>> {
    return this.validateResponse(
      () => this.axios.get(`${TourApi.baseUrl}/category`),
      z.array(categorySchema)
    );
  }
}

