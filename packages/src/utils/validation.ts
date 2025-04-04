/**
 * @author Mikiyas Birhanu And AI
 * @description Validation utilities
 */
import { z } from 'zod';

/**
 * Email validation regex
 */
export const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

/**
 * Phone number validation regex (simple)
 */
export const phoneRegex = /^\+?[0-9]{10,14}$/;

/**
 * URL validation regex
 */
export const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

/**
 * Check if a string is empty
 */
export function isEmpty(value: string | null | undefined): boolean {
  return value === null || value === undefined || value.trim() === '';
}

/**
 * Check if a value is a valid email
 */
export function isValidEmail(email: string): boolean {
  return emailRegex.test(email);
}

/**
 * Check if a value is a valid phone number
 */
export function isValidPhone(phone: string): boolean {
  return phoneRegex.test(phone);
}

/**
 * Check if a value is a valid URL
 */
export function isValidUrl(url: string): boolean {
  return urlRegex.test(url);
}

/**
 * Create a Zod schema for a required field
 */
export function requiredField(fieldName: string) {
  return z.string().min(1, `${fieldName} is required`);
}

/**
 * Create a Zod schema for an email field
 */
export function emailField(fieldName = 'Email') {
  return z
    .string()
    .min(1, `${fieldName} is required`)
    .email(`Please enter a valid ${fieldName.toLowerCase()}`);
}

/**
 * Create a Zod schema for a password field with minimum length
 */
export function passwordField(minLength = 8, fieldName = 'Password') {
  return z
    .string()
    .min(1, `${fieldName} is required`)
    .min(minLength, `${fieldName} must be at least ${minLength} characters`);
}

/**
 * Create a Zod schema for a confirmation field that must match another field
 */
export function confirmationField(field: string, fieldName = 'Confirmation') {
  return z.string().min(1, `${fieldName} is required`);
}
