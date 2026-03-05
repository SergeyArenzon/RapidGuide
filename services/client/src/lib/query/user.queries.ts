import type {
  CityDto,
  CountryDto,
  GetProfilesMeResponseDto,
  GuideAvailabilityDto,
  GuideDto,
  LanguageDto,
} from '@rapid-guide-io/contracts';
import { UserApi } from '@/lib/api/user';

/**
 * Query keys for user-related queries
 */
export const userQueryKeys = {
  me: (jwt?: string) => ['user', 'me', jwt] as const,
  countries: () => ['countries'] as const,
  cities: () => ['cities'] as const,
  languages: () => ['languages'] as const,
  guideById: (guideId: string) => ['guide', guideId] as const,
  guideAvailabilities: () => ['guide', 'availabilities'] as const,
  guideAvailabilitiesByGuideId: (guideId: string) => ['guide', guideId, 'availabilities'] as const,
} as const;

/**
 * Query options factories for user-related queries
 * These combine query keys with their query functions
 */
export const userQueries = {
  /**
   * Get current user profile (guide/traveller)
   */
  me: (jwt?: string) => ({
    queryKey: userQueryKeys.me(jwt),
    queryFn: async (): Promise<GetProfilesMeResponseDto> => {
      const userApi = new UserApi(jwt);
      return userApi.getMe();
    },
  }),

  /**
   * Get all countries
   */
  countries: () => ({
    queryKey: userQueryKeys.countries(),
    queryFn: async (): Promise<Array<CountryDto>> => {
      const userApi = new UserApi();
      return userApi.getCountries();
    },
  }),

  /**
   * Get all cities
   */
  cities: () => ({
    queryKey: userQueryKeys.cities(),
    queryFn: async (): Promise<Array<CityDto>> => {
      const userApi = new UserApi();
      return userApi.getCities();
    },
  }),

  /**
   * Get all languages
   */
  languages: () => ({
    queryKey: userQueryKeys.languages(),
    queryFn: async (): Promise<Array<LanguageDto>> => {
      const userApi = new UserApi();
      return userApi.getLanguages();
    },
  }),

  /**
   * Get guide by guide entity ID
   */
  guideById: (guideId: string) => ({
    queryKey: userQueryKeys.guideById(guideId),
    queryFn: async (): Promise<GuideDto> => {
      const userApi = new UserApi();
      return userApi.getGuideByGuideId(guideId);
    },
  }),

  /**
   * Get guide availabilities by guide ID (for guides - uses JWT)
   */
  guideAvailabilities: () => ({
    queryKey: userQueryKeys.guideAvailabilities(),
    queryFn: async (): Promise<Array<GuideAvailabilityDto>> => {
      const userApi = new UserApi();
      return userApi.getGuideAvailabilities();
    },
  }),

  /**
   * Get guide availabilities by guide ID (for travelers - uses guide ID parameter)
   */
  guideAvailabilitiesByGuideId: (guideId: string) => ({
    queryKey: userQueryKeys.guideAvailabilitiesByGuideId(guideId),
    queryFn: async (): Promise<Array<GuideAvailabilityDto>> => {
      const userApi = new UserApi();
      return userApi.getGuideAvailabilitiesByGuideId(guideId);
    },
  }),

  /**
   * Delete guide availability by ID
   */
  deleteGuideAvailability: (availabilityId: string) => ({
    mutationFn: async (): Promise<void> => {
      const userApi = new UserApi();
      return userApi.deleteGuideAvailability(availabilityId);
    },
  }),
} as const;

