/**
 * @author Mikiyas Birhanu And AI
 * @description Shared API response and request types
 */
import { z } from 'zod';

// Common response interface for all API responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
}

// User related types
export const userSchema = z.object({
  id: z.string(),
  username: z.string().min(3).max(50),
  email: z.string().email(),
  name: z.string().optional(),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
});

export type User = z.infer<typeof userSchema>;

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Login credentials schema
export const loginCredentialsSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6),
});

export type LoginCredentials = z.infer<typeof loginCredentialsSchema>;

// Registration schema
export const registrationSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

export type RegistrationData = z.infer<typeof registrationSchema>;
