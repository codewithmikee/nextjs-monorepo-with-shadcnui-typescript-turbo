import { z } from 'zod';

export const userSchema = z.object({
  id: z.number(),
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8),
  displayName: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type User = z.infer<typeof userSchema>;

export const insertUserSchema = userSchema.omit({ 
  id: true,
  createdAt: true,
  updatedAt: true
});

export type InsertUser = z.infer<typeof insertUserSchema>;

export const loginCredentialsSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type LoginCredentials = z.infer<typeof loginCredentialsSchema>;