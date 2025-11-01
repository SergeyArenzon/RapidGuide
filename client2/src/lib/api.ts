import axios from 'axios';
import { z } from 'zod';
import { 
  categorySchema, 
  citySchema,
  countrySchema,
  createGuideSchema,
  guideSchema,
  languageSchema,
  subCategorySchema
} from '@rapid-guide-io/dto';
import type { 
  CategoryDto, 
  CityDto, 
  CountryDto, 
  CreateGuideDto, 
  GuideDto, 
  LanguageDto, 
  SubCategoryDto,
  UserDto} from '@rapid-guide-io/dto';
import type { AxiosError, AxiosInstance, AxiosResponse } from 'axios';


export default class Api {
  private axios: AxiosInstance;

  constructor(accessToken: string) {
    console.log({accessToken});
    
    this.axios = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      withCredentials: true,
      timeout: 5000, // 5s timeout
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
    });
    

    // Attach response interceptor
    this.axios.interceptors.response.use(
      (response) => response,
      (error) => this.handleError(error)
    );
  }

   // 🔒 Generic validation wrapper
   private async validateResponse<T>(
    apiCall: () => Promise<AxiosResponse>,
    schema: z.ZodType<T>
  ): Promise<T> {
    const response = await apiCall();
    const parsed = schema.safeParse(response.data);
    
    if (!parsed.success) {
      console.error('Invalid API response:', parsed);
      throw new Error('Unexpected API response format.');
    }

    return parsed.data;
  }
  
  
  // 🛑 Handle API errors globally
  private handleError(error: AxiosError) {
    if (error.response) {
      const errorMessage = (error.response.data as { message?: string })?.message || 'Something went wrong.';
      console.error('API Error:', errorMessage);
      throw new Error(errorMessage);
    } else if (error.request) {
      console.error('No response received:', error.request);
      throw new Error('No response from server. Please try again.');
    } else {
      console.error('Request error:', error.message);
      throw new Error('Request failed. Please check your network.');
    }
  }
  

  
  // 🛠 Fetch languages with validation
  async getLanguages(): Promise<Array<LanguageDto>> {
    return this.validateResponse(
      () => this.axios.get('/user/languages'),
      z.array(languageSchema)
    );
  }
  
  async getCountries(): Promise<Array<CountryDto>> {
    return this.validateResponse(
      () => this.axios.get('/user/country'),
      z.array(countrySchema)
    );
  }

  async getCities(): Promise<Array<CityDto>> {
    return this.validateResponse(
      () => this.axios.get(`/user/city`),
      z.array(citySchema)
    );
  }

  async getSubCategories(): Promise<Array<SubCategoryDto>> {
    return this.validateResponse(
      () => this.axios.get('/tour/sub-category'),
      z.array(subCategorySchema)
    );
  }

  async getCategories(): Promise<Array<CategoryDto>> {
    return this.validateResponse(
      () => this.axios.get('/tour/category'),
      z.array(categorySchema)
    );
  }

  async createGuide(guide: CreateGuideDto): Promise<GuideDto> {
    return this.validateResponse(
      () => this.axios.post('/user/guide', guide),
      guideSchema
    );
  }
  async getGuide(userId: UserDto["id"]): Promise<GuideDto> {
    return this.validateResponse(
      () => this.axios.get(`/user/user/${userId}/guide`),
      guideSchema
    );
  }

  async logout(): Promise<void> {
    try {
      await this.axios.post('/auth//logout');
    } catch (error) {
      console.error('Logout request failed:', error);
      throw error;
    }
  }
}
