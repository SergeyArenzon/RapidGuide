import { z } from 'zod';
import { 
  citySchema,
  countrySchema,
  getProfilesMeResponseSchema,
  guideSchema,
  languageSchema
} from '@rapid-guide-io/contracts';
import { BaseApi } from './base';
import type { 
  CityDto, 
  CountryDto, 
  CreateGuideDto, 
  GetProfilesMeResponseDto, 
  GuideDto, 
  LanguageDto
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
}

