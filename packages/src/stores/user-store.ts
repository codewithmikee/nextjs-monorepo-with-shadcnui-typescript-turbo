/**
 * @author Mikiyas Birhanu And AI
 * @description Zustand store for user state management
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@shared/types';

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  login: (user: User) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      login: (user) => set({ user, isAuthenticated: true, error: null }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'user-storage',
      // Only store non-sensitive information
      partialize: (state) => ({ 
        user: {
          id: state.user?.id,
          username: state.user?.username,
          email: state.user?.email,
          name: state.user?.name,
        }, 
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
