import axios, { AxiosInstance, AxiosError } from 'axios';
import { Language, Category, Country, City, Guide } from '@/types';
import { z } from 'zod';
import { LanguageSchema } from '@/schema/user.schema';
import { CategorySchema, CountrySchema, CitySchema, GuideSchema, GuideBaseSchema } from '@/schema';


export default class Api {
  private axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL + '/api',
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
  async getLanguages(): Promise<Language[]> {
    const response = await this.axios.get('/user/languages');
    // ✅ Validate API response
    const parsed = z.array(LanguageSchema).safeParse(response.data);
    if (!parsed.success) {
      console.error('Invalid API response:', parsed.error);
      throw new Error('Unexpected API response format.');
    }

    return parsed.data;
  }
  
  async getCountries(): Promise<Country[]> {
    const response = await this.axios.get('/user/country');

    // ✅ Validate API response
    const parsed = z.array(CountrySchema).safeParse(response.data);
    if (!parsed.success) {
      console.error('Invalid API response:', parsed.error);
      throw new Error('Unexpected API response format.');
    }
    return parsed.data;
  }

  async getCities(country_code: string): Promise<City[]> {
    const response = await this.axios.get(`/user/city?countryCode=${country_code}`);

    // ✅ Validate API response
    const parsed = z.array(CitySchema).safeParse(response.data);
    if (!parsed.success) {
      console.error('Invalid API response:', parsed.error);
      throw new Error('Unexpected API response format.');
    }
    return parsed.data;
  }

  async getCategories(): Promise<Category[]> {
    const response = await this.axios.get('/tour/categories');
    const parsed = z.array(CategorySchema).safeParse(response.data);
    if (!parsed.success) {
      console.error('Invalid API response:', parsed.error);
      throw new Error('Unexpected API response format.');
    }
    return parsed.data;
  }

  async createGuide(guide: z.infer<typeof GuideBaseSchema>): Promise<Guide> {
    const response = await this.axios.post('/user/guide', guide);
    const parsed = GuideSchema.safeParse(response.data);
    if (!parsed.success) {
      console.error('Invalid API response:', parsed.error);
      throw new Error('Unexpected API response format.');
    }
    return response.data;
  }
}
