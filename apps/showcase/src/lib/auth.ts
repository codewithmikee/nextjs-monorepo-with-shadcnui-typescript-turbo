/**
 * @author Mikiyas Birhanu And AI
 * @description Client-side authentication utilities
 */
import { PaginatedResponse, User } from '@shared/types';
import { defaultApiClient } from '@packages/libs';
import { useUserStore } from '@packages/stores';
import { useCallback } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

/**
 * Hook that provides auth-related utilities and state
 */
export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { user, isAuthenticated, login, logout, setLoading, setError } = useUserStore();

  /**
   * Sign in with credentials
   */
  const signInWithCredentials = useCallback(
    async (username: string, password: string) => {
      setLoading(true);
      setError(null);

      try {
        const result = await signIn('credentials', {
          username,
          password,
          redirect: false,
        });

        if (result?.error) {
          setError(result.error);
          return false;
        }

        return true;
      } catch (error) {
        setError((error as Error).message || 'An error occurred during sign in');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  /**
   * Register a new user
   */
  const registerUser = useCallback(
    async (userData: {
      username: string;
      email: string;
      password: string;
      name?: string;
    }) => {
      setLoading(true);
      setError(null);

      try {
        const response = await defaultApiClient.post<User>('/api/auth/register', userData);

        if (!response.success || !response.data) {
          throw new Error(response.error?.message || 'Registration failed');
        }

        // Auto login after successful registration
        await signInWithCredentials(userData.username, userData.password);
        return true;
      } catch (error) {
        setError((error as Error).message || 'An error occurred during registration');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, signInWithCredentials]
  );

  /**
   * Sign out the current user
   */
  const signOutUser = useCallback(async () => {
    await signOut({ redirect: false });
    logout();
    router.push('/');
  }, [logout, router]);

  /**
   * Fetch users (admin only function)
   */
  const fetchUsers = useCallback(
    async (page = 1, limit = 10) => {
      if (!isAuthenticated) return null;

      try {
        const response = await defaultApiClient.get<PaginatedResponse<User>>(
          `/api/users?page=${page}&limit=${limit}`
        );

        if (!response.success || !response.data) {
          throw new Error(response.error?.message || 'Failed to fetch users');
        }

        return response.data;
      } catch (error) {
        console.error('Error fetching users:', error);
        return null;
      }
    },
    [isAuthenticated]
  );

  return {
    user: session?.user as User | null || user,
    isAuthenticated: status === 'authenticated' || isAuthenticated,
    isLoading: status === 'loading',
    signIn: signInWithCredentials,
    signOut: signOutUser,
    register: registerUser,
    fetchUsers,
  };
}

/**
 * Check if a route is protected and should require authentication
 */
export function isProtectedRoute(pathname: string): boolean {
  const protectedRoutes = ['/dashboard', '/profile', '/admin'];
  return protectedRoutes.some(route => pathname.startsWith(route));
}
