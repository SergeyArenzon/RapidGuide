import { z } from 'zod';
import {
  citySchema,
  countrySchema,
  getProfilesMeResponseSchema,
  guideAvailabilitySchema,
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
  GuideAvailabilityDto,
  GuideDto,
  LanguageDto,
  PostGuideAvailabilitiesRequestDto,
  TravellerDto,
} from '@rapid-guide-io/contracts';

export class UserApi extends BaseApi {

  static readonly baseUrl = '/user';

  async getMe(): Promise<GetProfilesMeResponseDto> {
    return this.validateResponse(
      () => this.axios.get(`${UserApi.baseUrl}/profile/me`),
      getProfilesMeResponseSchema
    );
  }

  async getLanguages(): Promise<Array<LanguageDto>> {
    return this.validateResponse(
      () => this.axios.get(`${UserApi.baseUrl}/languages`),
      z.array(languageSchema)
    );
  }

  async getCountries(): Promise<Array<CountryDto>> {
    return this.validateResponse(
      () => this.axios.get(`${UserApi.baseUrl}/country`),
      z.array(countrySchema)
    );
  }

  async getCities(): Promise<Array<CityDto>> {
    return this.validateResponse(
      () => this.axios.get(`${UserApi.baseUrl}/city`),
      z.array(citySchema)
    );
  }

  async createGuide(guide: CreateGuideDto): Promise<GuideDto> {
    return this.validateResponse(
      () => this.axios.post(`${UserApi.baseUrl}/guide`, guide),
      guideSchema
    );
  }

  async createTraveller(traveller: CreateTravellerDto): Promise<TravellerDto> {
    return this.validateResponse(
      () => this.axios.post(`${UserApi.baseUrl}/traveller`, traveller),
      travellerSchema
    );
  }

  async getGuideSchedules(): Promise<Array<{ id: string; day_of_week: number; start_time: string; end_time: string }>> {
    return this.axios.get(`${UserApi.baseUrl}/guide/schedule`).then(res => res.data);
  }

  async createGuideSchedule(schedule: { day_of_week: number; start_time: string; end_time: string }): Promise<{ id: string; day_of_week: number; start_time: string; end_time: string }> {
    return this.axios.post(`${UserApi.baseUrl}/guide/schedule`, schedule).then(res => res.data);
  }

  async updateGuideSchedule(id: string, schedule: { day_of_week: number; start_time: string; end_time: string }): Promise<{ id: string; day_of_week: number; start_time: string; end_time: string }> {
    return this.axios.patch(`${UserApi.baseUrl}/guide/schedule/${id}`, schedule).then(res => res.data);
  }

  async deleteGuideSchedule(id: string): Promise<void> {
    return this.axios.delete(`${UserApi.baseUrl}/guide/schedule/${id}`).then(() => undefined);
  }

  async getGuideByGuideId(guideId: string): Promise<GuideDto> {
    return this.validateResponse(
      () => this.axios.get(`${UserApi.baseUrl}/guide/${guideId}`),
      guideSchema
    );
  }

  async getGuideAvailabilities(): Promise<Array<GuideAvailabilityDto>> {
    return this.validateResponse(
      () => this.axios.get(`${UserApi.baseUrl}/guide/availabilities`),
      z.array(guideAvailabilitySchema)
    );
  }

  async getGuideAvailabilitiesByGuideId(guideId: string): Promise<Array<GuideAvailabilityDto>> {
    return this.validateResponse(
      () => this.axios.get(`${UserApi.baseUrl}/guide/${guideId}/availabilities`),
      z.array(guideAvailabilitySchema)
    );
  }

  async createGuideAvailability(availability: PostGuideAvailabilitiesRequestDto): Promise<Array<GuideAvailabilityDto>> {
    return this.validateResponse(
      () => this.axios.post(`${UserApi.baseUrl}/guide/availabilities`, availability),
      z.array(guideAvailabilitySchema)
    );
  }

  async deleteGuideAvailability(availabilityId: string): Promise<void> {
    return this.axios.delete(`${UserApi.baseUrl}/guide/availabilities/${availabilityId}`);
  }

}
