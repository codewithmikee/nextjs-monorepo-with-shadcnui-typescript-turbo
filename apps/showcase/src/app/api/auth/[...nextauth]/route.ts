/**
 * @author Mikiyas Birhanu And AI
 * @description Next Auth API route
 */
import NextAuth from 'next-auth';
import { createAuthOptions } from '@packages/auth';

// Configure NextAuth options
const authOptions = createAuthOptions({
  secret: process.env.NEXTAUTH_SECRET || 'a-development-secret-for-nextauth',
});

// Create and export the NextAuth handler
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
