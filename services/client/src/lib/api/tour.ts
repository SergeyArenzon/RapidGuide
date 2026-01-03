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

  async getTours(cityId?: number, guideId?: string): Promise<Array<TourDto>> {
    const params = new URLSearchParams();
    if (cityId) {
      params.append('city_id', cityId.toString());
    }
    if (guideId) {
      params.append('guide_id', guideId);
    }

    const queryString = params.toString();
    const url = queryString
      ? `${TourApi.baseUrl}/tour?${queryString}`
      : `${TourApi.baseUrl}/tour`;
    return this.validateResponse(
      () => this.axios.get(url),
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

  async deleteTour(tourId: string): Promise<void> {
    return this.axios.delete(`${TourApi.baseUrl}/tour/${tourId}`).then(() => undefined);
  }
}

