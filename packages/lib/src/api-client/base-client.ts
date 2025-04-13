// packages/lib/src/api-client/base-client.ts
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { getSession, signOut } from "next-auth/react";
import { ApiResponse } from "./types";

// packages/lib/src/api-client/server-client.ts
import { getServerSession } from 'next-auth';
import authOptions from "../auth/auth.config";
type AuthTokenProvider = () => Promise<string | null>;

export abstract class BaseApiClient {
  protected readonly instance: AxiosInstance;
  private readonly baseURL: string;
  private readonly isProtected: boolean;
  protected tokenProvider: AuthTokenProvider;

  constructor(
    config: {
      basePrefix?: string;
      isProtected?: boolean;
      isServer?: boolean;
      baseURL?: string;
    } = {}
  ) {
    const baseURL = config.baseURL || this.getPrefixedBaseUrl(config.basePrefix);
    this.baseURL = baseURL;
    this.isProtected = config.isProtected || false;

    this.instance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.tokenProvider = config.isProtected
      ? config.isServer
        ? this.serverTokenProvider
        : this.clientTokenProvider
      : () => Promise.resolve(null);
    this.initializeResponseInterceptor();
  }

  // Client-side token provider
  private clientTokenProvider = async (): Promise<string | null> => {
    const token = await getSession();
    return token?.accessToken || null;
  };

  // Server-side token provider
  private serverTokenProvider = async (): Promise<string | null> => {
    const session = await getServerSession(authOptions);
    return session?.accessToken || null;
  };

  private initializeResponseInterceptor() {
    this.instance.interceptors.response.use(
      this.handleResponse,
      this.handleError,
    );
  }

  private getBaseUrl = () => {
    let url = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
    // handle ends with slash
    return this.makeSureUrlEndsWithSlash(url);
  };

  private getPrefixedBaseUrl = (prefix?: string) => {
    const baseUrl = this.getBaseUrl();
    if (!prefix) return baseUrl;

    return this.makeSureUrlEndsWithSlash(
      `${baseUrl}${prefix.startsWith("/") ? prefix.slice(1) : prefix}`,
    );
  };

  private makeSureUrlEndsWithSlash(url: string) {
    return url.endsWith("/") ? url : `${url}/`;
  }

  private handleResponse = (response: AxiosResponse) => {
    return response;
  };

  // packages/lib/src/api-client/base-client.ts
  private handleError = async (error: AxiosError): Promise<never> => {
    // Type-safe error details extraction
    const getErrorDetails = (
      data: unknown,
    ): Record<string, unknown> | undefined => {
      if (typeof data === "object" && data !== null) {
        return data as Record<string, unknown>;
      }
      return undefined;
    };

    const formattedError: ApiResponse<never> = {
      success: false,
      error: {
        code: typeof error.code === "string" ? error.code : "UNKNOWN_ERROR",
        message: error.message,
        details: axios.isAxiosError(error)
          ? getErrorDetails(error.response?.data)
          : undefined,
      },
    };

    // Handle specific error cases
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      // Handle token expiration
      if (status === 401 && this.isProtected) {
        try {
          // Add token refresh logic here if needed
          const originalRequest = error.config!;
          return this.instance(originalRequest);
        } catch (refreshError) {
          await signOut({ redirect: false });
          window.location.href = "/auth/signin";
        }
      }

      // Handle account blocked
      if (status === 403) {
        await signOut({ redirect: false });
        window.location.href = "/auth/blocked";
      }
    }

    return Promise.reject(formattedError);
  };

  private defaultTokenProvider = async (): Promise<string | null> => {
    const session = await getSession();
    return session?.accessToken || null;
  };


  protected async request<T>(config: AxiosRequestConfig) {
    try {
      if (this.isProtected) {
        const token = await this.tokenProvider();
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }

      const response = await this.instance.request<ApiResponse<T>>(config);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data;
      }
      throw error;
    }
  }

  // Define ALL common methods in base class
  async get<T>(
    endpoint: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: "GET",
      url: endpoint,
      ...config,
    });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: "POST",
      url: endpoint,
      data,
      ...config,
    });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: "PUT",
      url: endpoint,
      data,
      ...config,
    });
  }

  async delete<T>(
    endpoint: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: "DELETE",
      url: endpoint,
      ...config,
    });
  }
}


