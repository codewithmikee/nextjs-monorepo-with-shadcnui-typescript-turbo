/**
 * @author Mikiyas Birhanu And AI
 * @description Client-side API configurations
 */
import { ApiResponse } from '@shared/types';
import { z } from 'zod';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface FetchOptions {
  baseUrl?: string;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
  timeout?: number;
  skipAuthRefresh?: boolean;
}

interface TokenData {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number; // Unix timestamp in milliseconds
}

interface ApiClientConfig {
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
  withCredentials?: boolean;
  timeout?: number;
  authRefreshEndpoint?: string;
  onAuthError?: (error: any) => void;
}

/**
 * API client for making HTTP requests from the client side
 */
export class ApiClient {
  private config: ApiClientConfig;
  private tokenData: TokenData | null = null;
  private refreshPromise: Promise<TokenData | null> | null = null;

  constructor(config: ApiClientConfig) {
    this.config = {
      baseUrl: config.baseUrl.endsWith('/') 
        ? config.baseUrl.slice(0, -1) 
        : config.baseUrl,
      defaultHeaders: {
        'Content-Type': 'application/json',
        ...config.defaultHeaders,
      },
      withCredentials: config.withCredentials ?? true,
      timeout: config.timeout ?? 30000,
      authRefreshEndpoint: config.authRefreshEndpoint || '/api/auth/refresh',
      onAuthError: config.onAuthError,
    };
  }

  /**
   * Set authentication token data for subsequent requests
   */
  setAuthTokens(tokenData: TokenData): void {
    this.tokenData = tokenData;
    
    if (!this.config.defaultHeaders) {
      this.config.defaultHeaders = {};
    }
    
    if (tokenData.accessToken) {
      this.config.defaultHeaders['Authorization'] = `Bearer ${tokenData.accessToken}`;
    }
  }

  /**
   * Set authentication token for subsequent requests
   */
  setAuthToken(token: string, expiresIn?: number): void {
    const expiresAt = expiresIn ? Date.now() + expiresIn * 1000 : undefined;
    this.setAuthTokens({ accessToken: token, expiresAt });
  }

  /**
   * Clear authentication tokens
   */
  clearAuthToken(): void {
    this.tokenData = null;
    
    if (this.config.defaultHeaders && 'Authorization' in this.config.defaultHeaders) {
      delete this.config.defaultHeaders['Authorization'];
    }
  }
  
  /**
   * Check if the current token is expired
   */
  isTokenExpired(): boolean {
    if (!this.tokenData || !this.tokenData.expiresAt) {
      return false;
    }
    
    // Consider token expired 30 seconds before actual expiry
    return Date.now() > (this.tokenData.expiresAt - 30000);
  }
  
  /**
   * Refresh the auth token
   */
  async refreshToken(): Promise<TokenData | null> {
    // If there's already a refresh in progress, return that promise
    if (this.refreshPromise) {
      return this.refreshPromise;
    }
    
    // No refresh token or endpoint available
    if (!this.tokenData?.refreshToken || !this.config.authRefreshEndpoint) {
      return null;
    }
    
    // Start a new refresh token request
    this.refreshPromise = (async () => {
      try {
        const response = await this.request<{ accessToken: string; refreshToken?: string; expiresIn?: number }>(
          'POST',
          this.config.authRefreshEndpoint!,
          { refreshToken: this.tokenData!.refreshToken },
          { skipAuthRefresh: true }
        );
        
        if (!response.success || !response.data) {
          throw new Error(response.error?.message || 'Token refresh failed');
        }
        
        const { accessToken, refreshToken, expiresIn } = response.data;
        const expiresAt = expiresIn ? Date.now() + expiresIn * 1000 : undefined;
        
        const newTokenData = { 
          accessToken, 
          refreshToken: refreshToken || this.tokenData!.refreshToken,
          expiresAt 
        };
        
        this.setAuthTokens(newTokenData);
        return newTokenData;
      } catch (error) {
        // Clear token data on refresh failure
        this.clearAuthToken();
        
        // Call the auth error handler if provided
        if (this.config.onAuthError) {
          this.config.onAuthError(error);
        }
        
        return null;
      } finally {
        this.refreshPromise = null;
      }
    })();
    
    return this.refreshPromise;
  }

  /**
   * Make a GET request
   */
  async get<T>(
    endpoint: string, 
    options?: FetchOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>('GET', endpoint, undefined, options);
  }

  /**
   * Make a POST request
   */
  async post<T>(
    endpoint: string, 
    data?: any, 
    options?: FetchOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>('POST', endpoint, data, options);
  }

  /**
   * Make a PUT request
   */
  async put<T>(
    endpoint: string, 
    data?: any, 
    options?: FetchOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', endpoint, data, options);
  }

  /**
   * Make a PATCH request
   */
  async patch<T>(
    endpoint: string, 
    data?: any, 
    options?: FetchOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', endpoint, data, options);
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(
    endpoint: string, 
    options?: FetchOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', endpoint, undefined, options);
  }

  /**
   * Make a request with schema validation
   */
  async requestWithValidation<T>(
    method: HttpMethod,
    endpoint: string,
    schema: z.ZodType<T>,
    data?: any,
    options?: FetchOptions
  ): Promise<T> {
    const response = await this.request<unknown>(method, endpoint, data, options);
    
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Request failed');
    }
    
    try {
      return schema.parse(response.data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Validation error: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Make an HTTP request
   */
  private async request<T>(
    method: HttpMethod,
    endpoint: string,
    data?: any,
    options?: FetchOptions
  ): Promise<ApiResponse<T>> {
    // Check if token needs refresh before making the request, unless this is a refresh request itself
    if (!options?.skipAuthRefresh && this.isTokenExpired() && this.tokenData?.refreshToken) {
      await this.refreshToken();
    }
    
    const url = this.buildUrl(endpoint, options?.baseUrl);
    const headers = this.buildHeaders(options?.headers);
    const credentials = options?.credentials || (this.config.withCredentials ? 'include' : 'same-origin');

    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(), 
      options?.timeout || this.config.timeout
    );

    try {
      const response = await fetch(url, {
        method,
        headers,
        credentials,
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle authentication errors (401 Unauthorized)
      if (response.status === 401 && !options?.skipAuthRefresh) {
        // Try to refresh the token
        const refreshedToken = await this.refreshToken();
        
        // If token refresh was successful, retry the original request
        if (refreshedToken) {
          return this.request(method, endpoint, data, options);
        }
        
        // Token refresh failed, return the auth error
        return {
          success: false,
          error: {
            code: '401',
            message: 'Authentication required',
          },
        };
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: {
            code: response.status.toString(),
            message: errorData.message || response.statusText,
            details: errorData.details,
          },
        };
      }

      // Handle empty responses (like 204 No Content)
      if (response.status === 204) {
        return { success: true };
      }

      const responseData = await response.json() as T;
      return { success: true, data: responseData };
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof DOMException && error.name === 'AbortError') {
        return {
          success: false,
          error: {
            code: 'TIMEOUT',
            message: 'Request timed out',
          },
        };
      }

      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Network error',
        },
      };
    }
  }

  /**
   * Build the full URL for a request
   */
  private buildUrl(endpoint: string, overrideBaseUrl?: string): string {
    const baseUrl = overrideBaseUrl || this.config.baseUrl;
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${baseUrl}${normalizedEndpoint}`;
  }

  /**
   * Build headers for a request
   */
  private buildHeaders(additionalHeaders?: Record<string, string>): Record<string, string> {
    return {
      ...this.config.defaultHeaders,
      ...additionalHeaders,
    };
  }
}

/**
 * Create an API client instance
 */
export function createApiClient(config: ApiClientConfig): ApiClient {
  return new ApiClient(config);
}

// Default client for common use cases
export const defaultApiClient = new ApiClient({
  baseUrl: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  authRefreshEndpoint: '/api/auth/refresh',
  onAuthError: (error) => {
    console.error('Authentication error:', error);
    
    // If window is defined (client-side), redirect to auth page
    if (typeof window !== 'undefined') {
      // Using window.location to do a hard redirect to the auth page
      // Hard refresh clears any stale state
      window.location.href = '/auth?error=session_expired';
    }
  },
});
