import { z } from 'zod';
import {
  categorySchema,
  subCategorySchema,
  tourSchema,
} from '@rapid-guide-io/contracts';
import { BaseApi } from './base';
import type {
  CategoryDto,
  CreateTourDto,
  SubCategoryDto,
  TourDto,
} from '@rapid-guide-io/contracts';

export class TourApi extends BaseApi {
  // Base URL for the tour service
  static readonly baseUrl = '/tour';

  async getSubCategories(): Promise<Array<SubCategoryDto>> {
    return this.validateResponse(
      () => this.axios.get('/sub-category'),
      z.array(subCategorySchema),
    );
  }

  async getCategories(): Promise<Array<CategoryDto>> {
    return this.validateResponse(
      () => this.axios.get('/category'),
      z.array(categorySchema),
    );
  }

  async createTour(tour: CreateTourDto): Promise<TourDto> {
    return this.validateResponse(
      () => this.axios.post(`${TourApi.baseUrl}/tour`, tour),
      tourSchema
    );
  }

  async getTours(): Promise<Array<TourDto>> {
    return this.validateResponse(
      () => this.axios.get(`${TourApi.baseUrl}/tour`),
      z.array(tourSchema),
    );
  }
}

