import { jwtDecode } from 'jwt-decode';
import { AuthTokens } from '../types/auth';

// Check if token is expired or will expire in the next 5 minutes
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    
    // Check if token is expired or will expire in the next 5 minutes (300 seconds)
    return !decoded.exp || decoded.exp < currentTime + 300;
  } catch (error) {
    // If token cannot be decoded, consider it expired
    return true;
  }
}

// Save tokens to localStorage
export function saveTokens(tokens: AuthTokens): void {
  localStorage.setItem('auth_tokens', JSON.stringify(tokens));
}

// Get tokens from localStorage
export function getTokens(): AuthTokens | null {
  const tokensStr = localStorage.getItem('auth_tokens');
  if (!tokensStr) return null;
  
  try {
    return JSON.parse(tokensStr) as AuthTokens;
  } catch (error) {
    localStorage.removeItem('auth_tokens');
    return null;
  }
}

// Remove tokens from localStorage
export function removeTokens(): void {
  localStorage.removeItem('auth_tokens');
}

// Create authorization header with access token
export function getAuthHeader(token?: string): { Authorization: string } | undefined {
  const tokens = token ? { accessToken: token } : getTokens();
  if (!tokens?.accessToken) return undefined;
  
  return {
    Authorization: `Bearer ${tokens.accessToken}`
  };
}

// Dispatch token expiry event
export function dispatchTokenExpiryEvent(): void {
  const event = new CustomEvent('auth:token_expired');
  window.dispatchEvent(event);
}

// Dispatch login success event
export function dispatchLoginSuccessEvent(): void {
  const event = new CustomEvent('auth:login_success');
  window.dispatchEvent(event);
}

// Dispatch logout event
export function dispatchLogoutEvent(): void {
  const event = new CustomEvent('auth:logout');
  window.dispatchEvent(event);
}
