import axios, { AxiosInstance, AxiosError } from 'axios';
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
  categorySchema,
  CategoryDto
} from '@rapid-guide-io/shared';


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
    const response = await this.axios.get('/user/languages');
    // ✅ Validate API response
    const parsed = z.array(languageSchema).safeParse(response.data);
    if (!parsed.success) {
      console.error('Invalid API response:', parsed.error);
      throw new Error('Unexpected API response format.');
    }

    return parsed.data;
  }
  
  async getCountries(): Promise<CountryDto[]> {
    const response = await this.axios.get('/user/country');

    // ✅ Validate API response
    const parsed = z.array(countrySchema).safeParse(response.data);
    if (!parsed.success) {
      console.error('Invalid API response:', parsed.error);
      throw new Error('Unexpected API response format.');
    }
    return parsed.data;
  }

  async getCities(country_code: string): Promise<CityDto[]> {
    const response = await this.axios.get(`/user/city?countryCode=${country_code}`);

    // ✅ Validate API response
    const parsed = z.array(citySchema).safeParse(response.data);
    if (!parsed.success) {
      console.error('Invalid API response:', parsed.error);
      throw new Error('Unexpected API response format.');
    }
    return parsed.data;
  }

  async getSubCategories(): Promise<SubCategoryDto[]> {
    const response = await this.axios.get('/tour/sub-category');
    const parsed = z.array(subCategorySchema).safeParse(response.data);
    if (!parsed.success) {
      console.error('Invalid API response:', parsed.error);
      throw new Error('Unexpected API response format.');
    }
    return parsed.data;
  }

  async getCategories(): Promise<CategoryDto[]> {
    const response = await this.axios.get('/tour/category');
    const parsed = z.array(categorySchema).safeParse(response.data);
    if (!parsed.success) {
      console.error('Invalid API response:', parsed.error);
      throw new Error('Unexpected API response format.');
    }
    return parsed.data;
  }

  async createGuide(guide: CreateGuideDto): Promise<GuideDto> {
    const response = await this.axios.post('/user/guide', guide);
    const parsed = createGuideSchema.safeParse(response.data);
    if (!parsed.success) {
      console.error('Invalid API response:', parsed.error);
      throw new Error('Unexpected API response format.');
    }
    return response.data;
  }
  async getGuide(userId: UserDto["id"]): Promise<GuideDto> {
    const response = await this.axios.get(`/user/user/${userId}/guide`);
    const parsed = createGuideSchema.safeParse(response.data);
    if (!parsed.success) {
      console.error('Invalid API response:', parsed.error);
      throw new Error('Unexpected API response format.');
    }
    return response.data;
  }



}
