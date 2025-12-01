import axios from 'axios';
import type { z } from 'zod';
import type { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

export class BaseApi {
  protected axios: AxiosInstance;

  constructor(accessToken: string, axiosInstance?: AxiosInstance) {
    if (axiosInstance) {
      this.axios = axiosInstance;
    } else {
      this.axios = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
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
  }

  // 🔒 Generic validation wrapper
  protected async validateResponse<T>(
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

