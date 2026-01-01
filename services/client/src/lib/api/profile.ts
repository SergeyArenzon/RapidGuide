import { z } from 'zod';
import { 
  citySchema,
  countrySchema,
  getProfilesMeResponseSchema,
  guideSchema,
  languageSchema,
  travellerSchema,
} from '@rapid-guide-io/contracts';
import { BaseApi } from './base';
import type { 
  CityDto, 
  CountryDto, 
  CreateGuideDto, 
  CreateTravellerDto,
  GetProfilesMeResponseDto, 
  GuideDto, 
  LanguageDto,
  TravellerDto,
} from '@rapid-guide-io/contracts';

export class ProfileApi extends BaseApi {

  static readonly baseUrl = '/profile';
  // 🛠 Fetch profile/me with validation
  async getMe(): Promise<GetProfilesMeResponseDto> {
    return this.validateResponse(
      () => this.axios.get(`${ProfileApi.baseUrl}/profile/me`),
      getProfilesMeResponseSchema
    );
  }
  // 🛠 Fetch languages with validation
  async getLanguages(): Promise<Array<LanguageDto>> {
    return this.validateResponse(
      () => this.axios.get(`${ProfileApi.baseUrl}/languages`),
      z.array(languageSchema)
    );
  }
  
  async getCountries(): Promise<Array<CountryDto>> {
    return this.validateResponse(
      () => this.axios.get(`${ProfileApi.baseUrl}/country`),
      z.array(countrySchema)
    );
  }

  async getCities(): Promise<Array<CityDto>> {
    return this.validateResponse(
      () => this.axios.get(`${ProfileApi.baseUrl}/city`),
      z.array(citySchema)
    );
  }

  async createGuide(guide: CreateGuideDto): Promise<GuideDto> {
    return this.validateResponse(
      () => this.axios.post(`${ProfileApi.baseUrl}/guide`, guide),
      guideSchema
    );
  }

  async createTraveller(traveller: CreateTravellerDto): Promise<TravellerDto> {
    return this.validateResponse(
      () => this.axios.post(`${ProfileApi.baseUrl}/traveller`, traveller),
      travellerSchema
    );
  }

  // Guide Schedule methods
  async getGuideSchedules(): Promise<Array<{ id: string; day_of_week: number; start_time: string; end_time: string }>> {
    // TODO: Replace with proper schema validation when backend is ready
    return this.axios.get(`${ProfileApi.baseUrl}/guide/schedule`).then(res => res.data);
  }

  async createGuideSchedule(schedule: { day_of_week: number; start_time: string; end_time: string }): Promise<{ id: string; day_of_week: number; start_time: string; end_time: string }> {
    // TODO: Replace with proper schema validation when backend is ready
    return this.axios.post(`${ProfileApi.baseUrl}/guide/schedule`, schedule).then(res => res.data);
  }

  async updateGuideSchedule(id: string, schedule: { day_of_week: number; start_time: string; end_time: string }): Promise<{ id: string; day_of_week: number; start_time: string; end_time: string }> {
    // TODO: Replace with proper schema validation when backend is ready
    return this.axios.patch(`${ProfileApi.baseUrl}/guide/schedule/${id}`, schedule).then(res => res.data);
  }

  async deleteGuideSchedule(id: string): Promise<void> {
    return this.axios.delete(`${ProfileApi.baseUrl}/guide/schedule/${id}`).then(() => undefined);
  }
}

