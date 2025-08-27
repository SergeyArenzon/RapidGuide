import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import { z } from 'zod';
import { 
  CreateGuideDto, 
  createGuideSchema, 
  GuideDto, 
  UserDto, 
  CityDto, 
  citySchema, 
  LanguageDto,
  languageSchema, 
  CountryDto, 
  countrySchema,
  subCategorySchema,
  SubCategoryDto,
  guideSchema,
  CategoryDto,
  categorySchema
} from '@rapid-guide-io/dto';


export default class Api {
  private axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      withCredentials: true,
      timeout: 5000, // 5s timeout
      headers: {
        'Content-Type': 'application/json'
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
  async getLanguages(): Promise<LanguageDto[]> {
    return this.validateResponse(
      () => this.axios.get('/user/languages'),
      z.array(languageSchema)
    );
  }
  
  async getCountries(): Promise<CountryDto[]> {
    return this.validateResponse(
      () => this.axios.get('/user/country'),
      z.array(countrySchema)
    );
  }

  async getCities(): Promise<CityDto[]> {
    return this.validateResponse(
      () => this.axios.get(`/user/city`),
      z.array(citySchema)
    );
  }

  async getSubCategories(): Promise<SubCategoryDto[]> {
    return this.validateResponse(
      () => this.axios.get('/tour/sub-category'),
      z.array(subCategorySchema)
    );
  }

  async getCategories(): Promise<CategoryDto[]> {
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
