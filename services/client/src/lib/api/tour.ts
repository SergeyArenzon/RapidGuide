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
      () => this.axios.get(`${TourApi.baseUrl}/sub-category`),
      z.array(subCategorySchema),
    );
  }

  async getCategories(): Promise<Array<CategoryDto>> {
    return this.validateResponse(
      () => this.axios.get(`${TourApi.baseUrl}/category`),
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

  async getTour(tourId: string): Promise<TourDto> {
    return this.validateResponse(
      () => this.axios.get(`${TourApi.baseUrl}/tour/${tourId}`),
      tourSchema
    );
  }

  async updateTour(tourId: string, tour: CreateTourDto): Promise<TourDto> {
    return this.validateResponse(
      () => this.axios.put(`${TourApi.baseUrl}/tour/${tourId}`, tour),
      tourSchema
    );
  }
}

