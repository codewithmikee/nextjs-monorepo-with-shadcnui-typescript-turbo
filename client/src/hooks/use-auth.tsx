import { createContext, ReactNode, useContext } from 'react';
import {
  useQuery,
  useMutation,
  UseMutationResult,
  QueryClient,
} from '@tanstack/react-query';
import { User, InsertUser } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// Type for login data
type LoginData = {
  username: string;
  password: string;
};

// Helper functions for API requests
export async function apiRequest(
  method: string,
  endpoint: string,
  data?: unknown
): Promise<Response> {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(endpoint, options);

  if (!response.ok && response.status !== 401) {
    const errorText = await response.text();
    throw new Error(errorText || `API error: ${response.status}`);
  }

  return response;
}

// Custom query function for user data
export async function fetchUserData(on401: "throw" | "returnNull" = "throw"): Promise<User | undefined> {
  try {
    const response = await apiRequest('GET', '/api/user');
    
    if (response.status === 401) {
      if (on401 === "returnNull") {
        return undefined;
      }
      throw new Error('Unauthorized');
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized' && on401 === "returnNull") {
      return undefined;
    }
    throw error;
  }
}

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<User, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<User, Error, InsertUser>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<User | undefined, Error>({
    queryKey: ['/api/user'],
    queryFn: () => fetchUserData("returnNull"),
  });

  const loginMutation = useMutation<User, Error, LoginData>({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest('POST', '/api/login', credentials);
      return await res.json();
    },
    onSuccess: (user: User) => {
      queryClient.setQueryData(['/api/user'], user);
    },
    onError: (error: Error) => {
      toast({
        title: 'Login failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const registerMutation = useMutation<User, Error, InsertUser>({
    mutationFn: async (credentials: InsertUser) => {
      const res = await apiRequest('POST', '/api/register', credentials);
      return await res.json();
    },
    onSuccess: (user: User) => {
      queryClient.setQueryData(['/api/user'], user);
    },
    onError: (error: Error) => {
      toast({
        title: 'Registration failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const logoutMutation = useMutation<void, Error, void>({
    mutationFn: async () => {
      await apiRequest('POST', '/api/logout');
    },
    onSuccess: () => {
      queryClient.setQueryData(['/api/user'], null);
    },
    onError: (error: Error) => {
      toast({
        title: 'Logout failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}