/**
 * @author Mikiyas Birhanu And AI
 * @description Custom API client for the showcase app
 */
import { ApiClient } from '@packages/libs';
import { dispatchSessionExpiredEvent } from './auth-events';

// Create a custom API client that dispatches auth events
const apiClient = new ApiClient({
  baseUrl: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  authRefreshEndpoint: '/api/auth/refresh',
  onAuthError: (error) => {
    console.error('Authentication error in showcase app:', error);
    
    // Dispatch the session expired event to be handled by AuthEventHandler
    dispatchSessionExpiredEvent(error);
  },
});

export default apiClient;