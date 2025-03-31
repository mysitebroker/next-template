import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { DEV_AUTH_STORAGE_KEY } from './lib/dev-auth';

// This middleware is used to refresh the user's session and redirect unauthenticated users
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Check for dev auth in cookies
  const isDevAuth = req.cookies.get(DEV_AUTH_STORAGE_KEY)?.value === 'true';
  
  // Get the pathname
  const { pathname } = req.nextUrl;
  
  // Check if the pathname is a protected route
  const isProtectedRoute = 
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/profile') || 
    pathname.startsWith('/tournaments/my-tournaments') ||
    pathname.startsWith('/tournaments') ||
    pathname.startsWith('/practice-courts') ||
    pathname.startsWith('/travel-booking');
  
  // If dev auth is active, allow access to protected routes
  if (isDevAuth) {
    // If the user is authenticated and trying to access auth pages, redirect to dashboard
    if (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register')) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    return res;
  }
  
  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req, res });
  
  // Refresh session if expired
  await supabase.auth.getSession();
  
  // Get the session
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  // If the route is protected and the user is not authenticated, redirect to login
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/auth/login', req.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }
  
  // If the user is authenticated and trying to access auth pages, redirect to dashboard
  if (session && (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register'))) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  
  return res;
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/tournaments/:path*',
    '/practice-courts/:path*',
    '/travel-booking/:path*',
    '/auth/:path*',
  ],
};
