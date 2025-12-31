import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { useJwtTokenStore } from '@/store/useJwtToken';

/**
 * Sets up a response interceptor on an Axios instance to handle 401 errors
 * by automatically refreshing the session token.
 * 
 * @param axiosInstance - The Axios instance to attach the interceptor to
 * @param handleError - Optional callback to handle non-401 errors (should throw)
 * @returns A cleanup function to remove the interceptor
 */
export function setupRefreshTokenInterceptor(
  axiosInstance: AxiosInstance,
  handleError?: (error: AxiosError) => void
): () => void {
  let isRefreshing = false;
  const failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
  }> = [];

  const processQueue = (error: Error | null) => {
    failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve();
      }
    });
    failedQueue.length = 0;
  };

  const interceptorId = axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      // Handle 401 Unauthorized - JWT expired
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // If already refreshing, queue this request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => {
              const token = useJwtTokenStore.getState().token;
              if (token) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return axiosInstance(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Refresh session using Better Auth (uses HTTP-only cookies)
          // const newToken = await refreshSession();
          
          // if (newToken) {
          //   // Process queued requests
          //   processQueue(null);
            
          //   // Retry original request with new token
          //   originalRequest.headers.Authorization = `Bearer ${newToken}`;
          //   return axiosInstance(originalRequest);
          // } else {
          //   // Session refresh failed - session expired
          //   processQueue(new Error('Session expired'));
          //   return Promise.reject(error);
          // }
        } catch (refreshError) {
          processQueue(refreshError instanceof Error ? refreshError : new Error(String(refreshError)));
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // For other errors, use the error handler if provided, otherwise reject normally
      if (handleError) {
        try {
          handleError(error);
        } catch (err) {
          return Promise.reject(err);
        }
      }
      return Promise.reject(error);
    }
  );

  // Return cleanup function
  return () => {
    axiosInstance.interceptors.response.eject(interceptorId);
  };
}

