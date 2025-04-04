import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { 
  getTokens, 
  saveTokens, 
  removeTokens, 
  dispatchLoginSuccessEvent,
  dispatchLogoutEvent
} from '../utils/auth';
import { apiRequest } from '../utils/api';
import { 
  User, 
  AuthState, 
  AuthTokens, 
  LoginCredentials, 
  RegisterData 
} from '../types/auth';
import { useToast } from './ToastContext';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const initialState: AuthState = {
  user: null,
  tokens: getTokens(),
  isLoading: true,
  error: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);
  const router = useRouter();
  const { toast } = useToast();

  // Fetch user data on initial load and token changes
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!state.tokens) {
        setState(prevState => ({ ...prevState, isLoading: false }));
        return;
      }

      try {
        setState(prevState => ({ ...prevState, isLoading: true }));
        const response = await apiRequest<{ user: User, tokens: AuthTokens }>('GET', '/auth/user');
        
        if (response.success && response.data) {
          const { user, tokens } = response.data;
          setState({
            user,
            tokens,
            isLoading: false,
            error: null,
          });
          
          // Save updated tokens if provided
          if (tokens) {
            saveTokens(tokens);
          }
        } else {
          setState({
            user: null,
            tokens: null,
            isLoading: false,
            error: response.error?.message || 'Failed to fetch user',
          });
          removeTokens();
        }
      } catch (error) {
        setState({
          user: null,
          tokens: null,
          isLoading: false,
          error: 'An error occurred while fetching user data',
        });
        removeTokens();
      }
    };

    fetchCurrentUser();
  }, [state.tokens?.accessToken]);

  // Listen for auth events
  useEffect(() => {
    const handleTokenExpiry = () => {
      setState({
        user: null,
        tokens: null,
        isLoading: false,
        error: 'Your session has expired. Please log in again.',
      });
      removeTokens();
      
      // Show toast notification
      toast({
        title: 'Session Expired',
        description: 'Your session has expired. Please log in again.',
        variant: 'warning',
        duration: 5000,
      });
      
      // Redirect to login page if not already there
      if (router.pathname !== '/auth') {
        router.push('/auth');
      }
    };

    window.addEventListener('auth:token_expired', handleTokenExpiry);
    
    return () => {
      window.removeEventListener('auth:token_expired', handleTokenExpiry);
    };
  }, [toast, router]);

  // Login function
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setState(prevState => ({ ...prevState, isLoading: true, error: null }));
      
      const response = await apiRequest<{ user: User, tokens: AuthTokens }>('POST', '/auth/login', credentials);
      
      if (response.success && response.data) {
        const { user, tokens } = response.data;
        
        setState({
          user,
          tokens,
          isLoading: false,
          error: null,
        });
        
        saveTokens(tokens);
        dispatchLoginSuccessEvent();
        
        toast({
          title: 'Login Successful',
          description: `Welcome back, ${user.name}!`,
          variant: 'success',
          duration: 3000,
        });
        
        return true;
      } else {
        setState(prevState => ({
          ...prevState,
          isLoading: false,
          error: response.error?.message || 'Invalid credentials',
        }));
        
        toast({
          title: 'Login Failed',
          description: response.error?.message || 'Invalid credentials',
          variant: 'error',
          duration: 5000,
        });
        
        return false;
      }
    } catch (error) {
      setState(prevState => ({
        ...prevState,
        isLoading: false,
        error: 'An error occurred during login',
      }));
      
      toast({
        title: 'Login Error',
        description: 'An unexpected error occurred. Please try again later.',
        variant: 'error',
        duration: 5000,
      });
      
      return false;
    }
  };

  // Register function
  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      setState(prevState => ({ ...prevState, isLoading: true, error: null }));
      
      const response = await apiRequest<{ user: User, tokens: AuthTokens }>('POST', '/auth/register', data);
      
      if (response.success && response.data) {
        const { user, tokens } = response.data;
        
        setState({
          user,
          tokens,
          isLoading: false,
          error: null,
        });
        
        saveTokens(tokens);
        dispatchLoginSuccessEvent();
        
        toast({
          title: 'Registration Successful',
          description: `Welcome, ${user.name}!`,
          variant: 'success',
          duration: 3000,
        });
        
        return true;
      } else {
        setState(prevState => ({
          ...prevState,
          isLoading: false,
          error: response.error?.message || 'Registration failed',
        }));
        
        toast({
          title: 'Registration Failed',
          description: response.error?.message || 'Registration failed',
          variant: 'error',
          duration: 5000,
        });
        
        return false;
      }
    } catch (error) {
      setState(prevState => ({
        ...prevState,
        isLoading: false,
        error: 'An error occurred during registration',
      }));
      
      toast({
        title: 'Registration Error',
        description: 'An unexpected error occurred. Please try again later.',
        variant: 'error',
        duration: 5000,
      });
      
      return false;
    }
  };

  // Logout function
  const logout = () => {
    // Call logout API (fire and forget)
    apiRequest('POST', '/auth/logout').catch(() => {
      // Silent fail - we're logging out anyway
    });
    
    setState({
      user: null,
      tokens: null,
      isLoading: false,
      error: null,
    });
    
    removeTokens();
    dispatchLogoutEvent();
    
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
      variant: 'default',
      duration: 3000,
    });
    
    // Redirect to login page
    router.push('/auth');
  };

  // Clear error
  const clearError = () => {
    setState(prevState => ({ ...prevState, error: null }));
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}