/**
 * @author Mikiyas Birhanu And AI
 * @description Authentication event utilities
 */

/**
 * Dispatch a session expired event
 * @param error - The error that caused the session expiration
 */
export function dispatchSessionExpiredEvent(error?: any) {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('auth:session-expired', { 
      detail: { error } 
    });
    window.dispatchEvent(event);
  }
}

/**
 * Dispatch a login success event
 * @param user - The user that logged in
 */
export function dispatchLoginSuccessEvent(user: any) {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('auth:login-success', { 
      detail: { user } 
    });
    window.dispatchEvent(event);
  }
}

/**
 * Dispatch a logout event
 */
export function dispatchLogoutEvent() {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('auth:logout');
    window.dispatchEvent(event);
  }
}