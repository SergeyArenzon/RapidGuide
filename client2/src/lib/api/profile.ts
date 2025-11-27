import { z } from 'zod';
import { 
  citySchema,
  countrySchema,
  getProfilesMeResponseSchema,
  languageSchema
} from '@rapid-guide-io/contracts';
import type { 
  CityDto, 
  CountryDto, 
  GetProfilesMeResponseDto, 
  LanguageDto
} from '@rapid-guide-io/contracts';
import { BaseApi } from './base';

export class ProfileApi extends BaseApi {
  // 🛠 Fetch languages with validation
  async getLanguages(): Promise<Array<LanguageDto>> {
    return this.validateResponse(
      () => this.axios.get('/profile/languages'),
      z.array(languageSchema)
    );
  }
  
  async getCountries(): Promise<Array<CountryDto>> {
    return this.validateResponse(
      () => this.axios.get('/profile/country'),
      z.array(countrySchema)
    );
  }

  async getCities(): Promise<Array<CityDto>> {
    return this.validateResponse(
      () => this.axios.get(`/profile/city`),
      z.array(citySchema)
    );
  }

  async getMe(): Promise<GetProfilesMeResponseDto> {
    return this.validateResponse(
      () => this.axios.get('/profile/profile/me'),
      getProfilesMeResponseSchema
    );
  }
}

