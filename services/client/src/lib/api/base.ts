import axios from 'axios';
import { setupRefreshTokenInterceptor } from './refresh-token.interception';
import type { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import type { z } from 'zod';
import { useJwtTokenStore } from '@/store/useJwtToken';

export class BaseApi {
  protected axios: AxiosInstance;

  constructor(accessToken?: string | null, axiosInstance?: AxiosInstance) {
    // Choose between provided token and zustand state
    const token = accessToken ?? useJwtTokenStore.getState().getToken() ?? '';
    
    if (axiosInstance) {
      this.axios = axiosInstance;
    } else {
      this.axios = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
        withCredentials: true,
        timeout: 5000, // 5s timeout
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      // Set up refresh token interceptor with error handler
      // setupRefreshTokenInterceptor(this.axios, this.handleError.bind(this));
    }
  }


  // 🔒 Generic validation wrapper
  protected async validateResponse<T>(
    apiCall: () => Promise<AxiosResponse>,
    schema: z.ZodType<T>
  ): Promise<T> {
    const response = await apiCall();
    console.log({data: response.data, schema});
    const parsed = schema.safeParse(response.data);
    
    if (!parsed.success) {
      console.error('Invalid API response:', parsed);
      throw new Error('Unexpected API response format.');
    }

    return parsed.data;
  }
  
  // 🛑 Handle API errors globally
  protected handleError(error: AxiosError) {
    if (error.response) {
      const errorMessage = (error.response.data as { message?: string }).message || 'Something went wrong.';
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
}

