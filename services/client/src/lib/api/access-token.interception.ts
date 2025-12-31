import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { useJwtTokenStore } from '@/store/useJwtToken';

/**
 * Sets up a request interceptor on an Axios instance to automatically
 * add the Authorization header with the current access token from the store.
 * 
 * @param axiosInstance - The Axios instance to attach the interceptor to
 * @returns A cleanup function to remove the interceptor
 */
export function setupAccessTokenInterceptor(
  axiosInstance: AxiosInstance
): () => void {
  const interceptorId = axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = useJwtTokenStore.getState().getToken();
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        // Remove Authorization header if no token is available
        delete config.headers.Authorization;
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Return cleanup function
  return () => {
    axiosInstance.interceptors.request.eject(interceptorId);
  };
}

