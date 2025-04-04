/**
 * @author Mikiyas Birhanu And AI
 * @description API hooks using React Query for data fetching
 */
import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { ApiResponse } from '@shared/types';
import { ApiClient, defaultApiClient } from '../libs/api-configurations';

interface UseApiQueryOptions<TData> extends Omit<UseQueryOptions<ApiResponse<TData>, Error, TData>, 'queryFn'> {
  client?: ApiClient;
}

interface UseApiMutationOptions<TData, TVariables> extends Omit<UseMutationOptions<ApiResponse<TData>, Error, TVariables>, 'mutationFn'> {
  client?: ApiClient;
}

/**
 * Hook for fetching data using GET method
 */
export function useFetch<TData>(
  endpoint: string,
  options?: UseApiQueryOptions<TData>
) {
  const client = options?.client || defaultApiClient;
  
  return useQuery<ApiResponse<TData>, Error, TData>({
    ...options,
    queryKey: options?.queryKey || [endpoint],
    queryFn: async () => {
      return client.get<TData>(endpoint);
    },
    select: (data) => {
      if (!data.success) {
        throw new Error(data.error?.message || 'An error occurred');
      }
      return data.data as TData;
    },
  });
}

/**
 * Hook for creating data using POST method
 */
export function useCreate<TData, TVariables>(
  endpoint: string,
  options?: UseApiMutationOptions<TData, TVariables>
) {
  const client = options?.client || defaultApiClient;
  
  return useMutation<ApiResponse<TData>, Error, TVariables>({
    ...options,
    mutationFn: async (variables) => {
      return client.post<TData>(endpoint, variables);
    },
  });
}

/**
 * Hook for updating data using PUT method
 */
export function useUpdate<TData, TVariables>(
  endpoint: string,
  options?: UseApiMutationOptions<TData, TVariables>
) {
  const client = options?.client || defaultApiClient;
  
  return useMutation<ApiResponse<TData>, Error, TVariables>({
    ...options,
    mutationFn: async (variables) => {
      return client.put<TData>(endpoint, variables);
    },
  });
}

/**
 * Hook for patching data using PATCH method
 */
export function usePatch<TData, TVariables>(
  endpoint: string,
  options?: UseApiMutationOptions<TData, TVariables>
) {
  const client = options?.client || defaultApiClient;
  
  return useMutation<ApiResponse<TData>, Error, TVariables>({
    ...options,
    mutationFn: async (variables) => {
      return client.patch<TData>(endpoint, variables);
    },
  });
}

/**
 * Hook for deleting data using DELETE method
 */
export function useDelete<TData, TVariables>(
  endpoint: string,
  options?: UseApiMutationOptions<TData, TVariables>
) {
  const client = options?.client || defaultApiClient;
  
  return useMutation<ApiResponse<TData>, Error, TVariables>({
    ...options,
    mutationFn: async (variables) => {
      return client.delete<TData>(`${endpoint}${variables ? `/${variables}` : ''}`);
    },
  });
}
