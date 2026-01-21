import type {
  CityDto,
  CountryDto,
  GetProfilesMeResponseDto,
  GuideAvailabilityDto,
  GuideDto,
  LanguageDto,
} from '@rapid-guide-io/contracts';
import { ProfileApi } from '@/lib/api/profile';

/**
 * Query keys for profile-related queries
 */
export const profileQueryKeys = {
  me: (jwt?: string) => ['profile', 'me', jwt] as const,
  countries: () => ['countries'] as const,
  cities: () => ['cities'] as const,
  languages: () => ['languages'] as const,
  guideById: (guideId: string) => ['guide', guideId] as const,
  guideAvailabilities: () => ['guide', 'availabilities'] as const,
  guideAvailabilitiesByGuideId: (guideId: string) => ['guide', guideId, 'availabilities'] as const,
} as const;

/**
 * Query options factories for profile-related queries
 * These combine query keys with their query functions
 */
export const profileQueries = {
  /**
   * Get current user profile (guide/traveller)
   */
  me: (jwt?: string) => ({
    queryKey: profileQueryKeys.me(jwt),
    queryFn: async (): Promise<GetProfilesMeResponseDto> => {
      const profileApi = new ProfileApi(jwt);
      return profileApi.getMe();
    },
  }),

  /**
   * Get all countries
   */
  countries: () => ({
    queryKey: profileQueryKeys.countries(),
    queryFn: async (): Promise<Array<CountryDto>> => {
      const profileApi = new ProfileApi();
      return profileApi.getCountries();
    },
  }),

  /**
   * Get all cities
   */
  cities: () => ({
    queryKey: profileQueryKeys.cities(),
    queryFn: async (): Promise<Array<CityDto>> => {
      const profileApi = new ProfileApi();
      return profileApi.getCities();
    },
  }),

  /**
   * Get all languages
   */
  languages: () => ({
    queryKey: profileQueryKeys.languages(),
    queryFn: async (): Promise<Array<LanguageDto>> => {
      const profileApi = new ProfileApi();
      return profileApi.getLanguages();
    },
  }),

  /**
   * Get guide by guide entity ID
   */
  guideById: (guideId: string) => ({
    queryKey: profileQueryKeys.guideById(guideId),
    queryFn: async (): Promise<GuideDto> => {
      const profileApi = new ProfileApi();
      return profileApi.getGuideByGuideId(guideId);
    },
  }),

  /**
   * Get guide availabilities by guide ID (for guides - uses JWT)
   */
  guideAvailabilities: () => ({
    queryKey: profileQueryKeys.guideAvailabilities(),
    queryFn: async (): Promise<Array<GuideAvailabilityDto>> => {
      const profileApi = new ProfileApi();
      return profileApi.getGuideAvailabilities();
    },
  }),

  /**
   * Get guide availabilities by guide ID (for travelers - uses guide ID parameter)
   */
  guideAvailabilitiesByGuideId: (guideId: string) => ({
    queryKey: profileQueryKeys.guideAvailabilitiesByGuideId(guideId),
    queryFn: async (): Promise<Array<GuideAvailabilityDto>> => {
      const profileApi = new ProfileApi();
      return profileApi.getGuideAvailabilitiesByGuideId(guideId);
    },
  }),

  /**
   * Delete guide availability by ID
   */
  deleteGuideAvailability: (availabilityId: string) => ({
    mutationFn: async (): Promise<void> => {
      const profileApi = new ProfileApi();
      return profileApi.deleteGuideAvailability(availabilityId);
    },
  }),
} as const;

