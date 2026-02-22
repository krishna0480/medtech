// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  const { pathname } = request.nextUrl;

  // Define your paths
  const authPages = ['/login', '/sign_up'];
  const isAuthPage = authPages.includes(pathname);
  
  // Public assets and home page
  const isPublicPage = pathname === '/' || pathname.startsWith('/public');

  // 1. Redirect to Dashboard if logged-in user tries to access Login/Signup
  if (isAuthPage && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 2. Redirect to Login if unauthenticated user tries to access protected pages
  // (Everything that isn't an auth page or a public page)
  if (!session && !isAuthPage && !isPublicPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};