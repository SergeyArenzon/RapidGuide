import { z } from 'zod';
import { 
  categorySchema, 
  subCategorySchema 
} from '@rapid-guide-io/contracts';
import { BaseApi } from './base';
import type { 
  CategoryDto, 
  SubCategoryDto
} from '@rapid-guide-io/contracts';

// Tour schemas (temporary until contracts are updated)
const tourSchema = z.object({
  id: z.string().uuid(),
  guide_id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  min_travellers: z.number().optional(),
  max_travellers: z.number().optional(),
  price: z.number(),
  duration_minutes: z.number().optional(),
  subcategory_ids: z.array(z.string().uuid()),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

const createTourSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  min_travellers: z.number().int().positive().optional(),
  max_travellers: z.number().int().positive().optional(),
  price: z.number().positive('Price must be a positive number'),
  duration_minutes: z.number().int().positive().optional(),
  subcategory_ids: z.array(z.string().uuid()).min(1, 'At least one subcategory is required'),
});

export type TourDto = z.infer<typeof tourSchema>;
export type CreateTourDto = z.infer<typeof createTourSchema>;

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

  async createTour(tour: CreateTourDto): Promise<TourDto> {
    return this.validateResponse(
      () => this.axios.post(`${TourApi.baseUrl}/tour`, tour),
      tourSchema
    );
  }

  async getTours(): Promise<Array<TourDto>> {
    return this.validateResponse(
      () => this.axios.get(`${TourApi.baseUrl}/tour`),
      z.array(tourSchema)
    );
  }
}

