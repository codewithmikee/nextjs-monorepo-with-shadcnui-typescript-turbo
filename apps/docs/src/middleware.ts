import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const token = await getToken({ req })
  const path = req.nextUrl.pathname

  // Define public routes
  const publicRoutes = [
    '/auth/signin',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/error'
  ]

  // Allow public routes and API/auth routes
  if (publicRoutes.includes(path) || path.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  // Redirect unauthenticated users
  if (!token) {
    const signInUrl = new URL('/auth/signin', req.url)
    signInUrl.searchParams.set('callbackUrl', encodeURI(req.url))
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - error page
     * - public asset files (.svg, .png, etc)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|error|.*\\.(?:svg|png|jpg|jpeg)).*)'
  ]
}
