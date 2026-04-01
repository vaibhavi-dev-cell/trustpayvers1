import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public paths that don't require authentication
  const publicPaths = ['/login', '/register', '/api/health']
  const isPublic = publicPaths.some(path => pathname.startsWith(path))

  if (isPublic) return NextResponse.next()

  // In demo mode, allow everything
  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
    return NextResponse.next()
  }

  // Check for auth cookie
  const authCookie = request.cookies.get('authjs.session-token') ||
                     request.cookies.get('__Secure-authjs.session-token')

  if (!authCookie && pathname !== '/login') {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|textures|.*\\..*).*)'],
}
