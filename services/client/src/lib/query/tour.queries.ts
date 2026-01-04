import type { CategoryDto, SubCategoryDto, TourDto } from '@rapid-guide-io/contracts';
import Api from '@/lib/api';

/**
 * Query keys for tour-related queries
 */
export const tourQueryKeys = {
  all: () => ['tours'] as const,
  byCity: (cityId: number) => ['tours', 'city', cityId] as const,
  byGuide: (guideId: string) => ['tours', 'guide', guideId] as const,
  detail: (tourId: string) => ['tour', tourId] as const,
  categories: () => ['categories'] as const,
  subcategories: () => ['subcategories'] as const,
  // Legacy alias
  subCategories: () => ['subCategories'] as const,
} as const;

/**
 * Query options factories for tour-related queries
 * These combine query keys with their query functions
 */
export const tourQueries = {
  /**
   * Get all tours
   */
  all: () => ({
    queryKey: tourQueryKeys.all(),
    queryFn: async (): Promise<Array<TourDto>> => {
      const api = new Api();
      return api.tour.getTours();
    },
  }),

  /**
   * Get tours by city ID
   */
  byCity: (cityId: number) => ({
    queryKey: tourQueryKeys.byCity(cityId),
    queryFn: async (): Promise<Array<TourDto>> => {
      const api = new Api();
      return api.tour.getTours(cityId);
    },
  }),

  /**
   * Get tours by guide ID (user_id)
   */
  byGuide: (guideId: string) => ({
    queryKey: tourQueryKeys.byGuide(guideId),
    queryFn: async (): Promise<Array<TourDto>> => {
      const api = new Api();
      return api.tour.getTours(undefined, guideId);
    },
  }),

  /**
   * Get a single tour by ID
   */
  detail: (tourId: string, jwt?: string | null) => ({
    queryKey: tourQueryKeys.detail(tourId),
    queryFn: async (): Promise<TourDto> => {
      const api = new Api(jwt);
      return api.tour.getTour(tourId);
    },
  }),

  /**
   * Get all categories
   */
  categories: () => ({
    queryKey: tourQueryKeys.categories(),
    queryFn: async (): Promise<Array<CategoryDto>> => {
      const api = new Api();
      return api.tour.getCategories();
    },
  }),

  /**
   * Get all subcategories
   */
  subcategories: () => ({
    queryKey: tourQueryKeys.subcategories(),
    queryFn: async (): Promise<Array<SubCategoryDto>> => {
      const api = new Api();
      return api.tour.getSubCategories();
    },
  }),

  /**
   * Legacy alias for subcategories
   */
  subCategories: () => ({
    queryKey: tourQueryKeys.subCategories(),
    queryFn: async (): Promise<Array<SubCategoryDto>> => {
      const api = new Api();
      return api.tour.getSubCategories();
    },
  }),
} as const;

