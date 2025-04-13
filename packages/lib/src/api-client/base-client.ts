import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { getSession, signOut } from "next-auth/react";
import { ApiResponse } from "./types";
import { getServerSession } from "next-auth";
import authOptions from "../auth/auth.config";
import { URLUtils, QueryParams, ArrayFormat } from "./url-utils";

type AuthTokenProvider = () => Promise<string | null>;
type RequestConfig = AxiosRequestConfig & {
  queryParams?: QueryParams;
  arrayFormat?: ArrayFormat;
};

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
    } = {},
  ) {
    const baseURL = this.getPrefixedBaseUrl(config.basePrefix || "");
    this.baseURL = baseURL;
    this.isProtected = config.isProtected || false;

    this.instance = axios.create({
      baseURL: this.baseURL,
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
    const url = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
    return url;
  };

  private getPrefixedBaseUrl = (prefix?: string) => {
    const baseUrl = this.getBaseUrl();
    if (!prefix) return baseUrl;
    return `${baseUrl}/${prefix}`.replace(/\/+/g, "/");
  };

  private handleResponse = (response: AxiosResponse) => {
    return response;
  };

  // packages/lib/src/api-client/base-client.ts
  private handleError = async (error: AxiosError): Promise<never> => {

    const status = error.response?.status;
    const data = error.response?.data;
    console.info("Error to handle on handleError", {
      status, data
    });
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
          const originalRequest = error.config!;
          return this.instance(originalRequest);
        } catch (refreshError) {
          await signOut({ redirect: false });

          if (typeof window !== "undefined") {
            window.location.href = "/auth/signin";
          }
        }
      }

      if (status === 423) {
        await signOut({ redirect: false });
        if (typeof window !== "undefined") {
          window.location.href = "/auth/blocked";
        }
      }
    }



    // Wrap plain error payload into expected format
    if (
      data &&
      typeof data === "object" &&
      "error" in data &&
      typeof data.error === "string"
    ) {
      formattedError.error = {
        code: error.code || "BACKEND_ERROR",
        message: data.error,
        details: data,
      };
    }

    return Promise.reject(formattedError);
  };

  private defaultTokenProvider = async (): Promise<string | null> => {
    const session = await getSession();
    return session?.accessToken || null;
  };

  protected async request<T>(config: RequestConfig) {
    try {
      if (this.isProtected) {
        const token = await this.tokenProvider();
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }

      // let path =
      let path = config.url || "";
      path = path.startsWith("/") ? path.slice(1) : path;

      // Handle query parameters
      const url = config.url || "";

      const existingParams = new URLSearchParams();

      // Parse existing query params from URL
      if (url.includes("?")) {
        const [path, query] = url.split("?");
        config.url = path;
        new URLSearchParams(query).forEach((value, key) => {
          existingParams.append(key, value);
        });
      }

      // Merge with new query params
      if (config.queryParams) {
        const newParams = new URLSearchParams(
          URLUtils.serializeQueryParams(config.queryParams, config.arrayFormat),
        );

        // In BaseApiClient.request()
        newParams.forEach((value, key) => {
          existingParams.append(key, value); // Append instead of set
        });
      }

      // Rebuild URL with merged params
      const queryString = existingParams.toString();
      config.url = queryString ? `${config.url}?${queryString}` : config.url;

      console.info("Config url", {
        base: this.baseURL,
        config,
      });

      const response = await this.instance.request<T>(config);

      // console.info("REsponse on request", response);

      const data = response.data;
      return {
        data,
        success: true
      };
    } catch (error) {
      console.error("Error on request", error);

      if (
        error &&
        typeof error === "object" &&
        "success" in error &&
        "error" in error
      ) {
        return error as ApiResponse<T>;
      }

      if (axios.isAxiosError(error)) {
        const response = error.response;

        // Known API error format
        if (response?.data?.success === false && response?.data?.error) {
          return response.data as ApiResponse<T>;
        }

        // Zod validation error
        if (response?.status === 422 && typeof response?.data === "object") {
          return {
            success: false,
            error: {
              code: "VALIDATION_ERROR",
              message: "Validation failed",
              details: response.data,
            },
          };
        }

        // Generic fallback
        return {
          success: false,
          error: {
            code: error.code || "UNKNOWN_AXIOS_ERROR",
            message: error.message,
            details: response?.data,
          },
        };
      }

      // Non-Axios error fallback
      return {
        success: false,
        error: {
          code: "UNEXPECTED_ERROR",
          message: error instanceof Error ? error.message : "Unexpected error",
        },
      };
    }
  }

  // Define ALL common methods in base class
  async get<T>(
    endpoint: string,
    config?: RequestConfig,
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
    config?: RequestConfig,
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
    config?: RequestConfig,
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
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: "DELETE",
      url: endpoint,
      ...config,
    });
  }
}
