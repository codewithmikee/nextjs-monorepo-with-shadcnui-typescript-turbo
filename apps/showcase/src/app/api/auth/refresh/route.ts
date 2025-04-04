/**
 * @author Mikiyas Birhanu And AI
 * @description API route for refreshing authentication tokens
 */
import { NextRequest, NextResponse } from 'next/server';
import { getToken, encode } from 'next-auth/jwt';
import { z } from 'zod';

const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

/**
 * Token refresh handler
 * This endpoint validates a refresh token and issues a new access token
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const { refreshToken } = refreshTokenSchema.parse(body);

    // Verify the refresh token
    // In a real-world application, you'd validate this against a database
    // or a token blacklist to prevent replay attacks
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || 'a-development-secret-for-nextauth',
      raw: true,
    });

    if (!token) {
      return NextResponse.json({ success: false, error: { message: 'Invalid session' } }, { status: 401 });
    }

    // In a real implementation, validate the refresh token against stored tokens
    // Here we're just checking if it exists for demonstration
    if (!refreshToken) {
      return NextResponse.json({ success: false, error: { message: 'Invalid refresh token' } }, { status: 401 });
    }

    // Generate a new JWT token with updated expiration
    const payload = typeof token === 'string' 
      ? { sub: 'user' } // Fallback if token is just a string
      : token;
      
    const newToken = await encode({
      token: {
        ...payload,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
      },
      secret: process.env.NEXTAUTH_SECRET || 'a-development-secret-for-nextauth',
    });

    // In a real application, you would generate a new refresh token as well
    // and invalidate the old one for security
    const newRefreshToken = refreshToken; // In a real app, generate a new one

    return NextResponse.json({
      success: true,
      data: {
        accessToken: newToken,
        refreshToken: newRefreshToken,
        expiresIn: 3600, // 1 hour in seconds
      },
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: { message: 'Invalid request format', details: error.errors } },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: { message: 'Token refresh failed' } },
      { status: 500 }
    );
  }
}