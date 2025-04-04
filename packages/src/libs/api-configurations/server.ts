/**
 * @author Mikiyas Birhanu And AI
 * @description Server-side API configurations
 */
import { ApiResponse } from '@shared/types';
import { z } from 'zod';

interface FetchOptions {
  headers?: Record<string, string>;
  timeout?: number;
}

interface ServerApiClientConfig {
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
  timeout?: number;
}

/**
 * API client for making HTTP requests from the server side
 */
export class ServerApiClient {
  private config: ServerApiClientConfig;

  constructor(config: ServerApiClientConfig) {
    this.config = {
      baseUrl: config.baseUrl.endsWith('/') 
        ? config.baseUrl.slice(0, -1) 
        : config.baseUrl,
      defaultHeaders: {
        'Content-Type': 'application/json',
        ...config.defaultHeaders,
      },
      timeout: config.timeout ?? 30000,
    };
  }

  /**
   * Set authentication token for subsequent requests
   */
  setAuthToken(token: string): void {
    if (!this.config.defaultHeaders) {
      this.config.defaultHeaders = {};
    }
    this.config.defaultHeaders['Authorization'] = `Bearer ${token}`;
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
    method: string,
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
    method: string,
    endpoint: string,
    data?: any,
    options?: FetchOptions
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const headers = this.buildHeaders(options?.headers);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(), 
      options?.timeout || this.config.timeout
    );

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

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
  private buildUrl(endpoint: string): string {
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${this.config.baseUrl}${normalizedEndpoint}`;
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
 * Create a server-side API client instance
 */
export function createServerApiClient(config: ServerApiClientConfig): ServerApiClient {
  return new ServerApiClient(config);
}

/**
 * Helper function to create a server API client with environment variables
 */
export function createServerApiClientFromEnv(apiUrlEnvVar = 'API_URL'): ServerApiClient {
  const apiUrl = process.env[apiUrlEnvVar] || 'http://localhost:8000';
  
  return new ServerApiClient({
    baseUrl: apiUrl,
    defaultHeaders: {
      'Content-Type': 'application/json',
    },
  });
}
