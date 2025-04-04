/**
 * @author Mikiyas Birhanu And AI
 * @description Auth providers configuration for next-auth
 */
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { loginCredentialsSchema, userSchema } from '@shared/types';
import { defaultApiClient } from '../libs/api-configurations';

/**
 * Function to create NextAuth options with custom configuration
 */
export function createAuthOptions(options?: Partial<NextAuthOptions>): NextAuthOptions {
  return {
    providers: [
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          username: { label: 'Username', type: 'text' },
          password: { label: 'Password', type: 'password' },
        },
        async authorize(credentials) {
          if (!credentials) return null;
          
          try {
            // Validate credentials format
            const validatedCredentials = loginCredentialsSchema.parse(credentials);
            
            // Make API request to authenticate
            const response = await defaultApiClient.post('/api/auth/login', validatedCredentials);
            
            if (!response.success || !response.data) {
              console.error('Authentication failed:', response.error);
              return null;
            }
            
            // Validate user data
            const user = userSchema.parse(response.data);
            return user;
          } catch (error) {
            console.error('Authentication error:', error);
            return null;
          }
        },
      }),
    ],
    pages: {
      signIn: '/auth',
      error: '/auth',
    },
    callbacks: {
      jwt: async ({ token, user }) => {
        if (user) {
          token.user = user;
        }
        return token;
      },
      session: async ({ session, token }) => {
        if (token.user) {
          session.user = token.user;
        }
        return session;
      },
    },
    session: {
      strategy: 'jwt',
      maxAge: 60 * 60, // 1 hour
    },
    ...options,
  };
}
