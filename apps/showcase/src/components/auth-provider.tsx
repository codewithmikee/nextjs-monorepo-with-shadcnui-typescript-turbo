/**
 * @author Mikiyas Birhanu And AI
 * @description Authentication provider component that combines next-auth and react-query
 */
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SessionProvider, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
// No need to import API client when using events
import { useRouter } from 'next/navigation'; 
import { useToast } from '@packages/ui';

// Create a client
const createQueryClient = () => 
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
        retry: (failureCount, error: any) => {
          // Don't retry on auth errors
          if (error?.response?.status === 401) {
            return false;
          }
          return failureCount < 3;
        },
      },
    },
  });

/**
 * Configure auth-related event handlers
 */
function AuthEventHandler() {
  const router = useRouter();
  const { toast } = useToast();

  // Set up auth error handler for token refresh failures
  useEffect(() => {
    const handleSessionExpired = () => {
      console.error('Session expired');
      
      // Sign out the user
      signOut({ redirect: false }).then(() => {
        // Show a toast notification about session expiry
        toast({
          title: 'Session Expired',
          description: 'Your session has expired. Please sign in again.',
          variant: 'destructive',
          duration: 5000,
        });
        
        // Redirect to login page
        router.push('/auth?error=session_expired');
      });
    };

    // Listen for custom session expired event
    window.addEventListener('auth:session-expired', handleSessionExpired);
    
    return () => {
      window.removeEventListener('auth:session-expired', handleSessionExpired);
    };
  }, [router, toast]);

  return null;
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus={true}>
        <AuthEventHandler />
        {children}
      </SessionProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
