import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')?.value;
  let session = null;

  if (sessionCookie) {
    try {
      const secret = process.env.JWT_SECRET || "fallback_secret_key";
      const key = new TextEncoder().encode(secret);
      const { payload } = await jwtVerify(sessionCookie, key, {
        algorithms: ["HS256"],
      });
      session = payload;
    } catch (err) {
      // Invalid or expired token
      session = null;
    }
  }

  const path = request.nextUrl.pathname;

  if (session) {
    // Admin route protection
    if (path.startsWith('/admin') && session.role !== 'admin') {
      // Redirect non-admins away from admin routes
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    // Prevent logged-in users from accessing auth pages
    if (path === '/login' || path === '/signup') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  } else {
    // Unauthenticated user route protection
    const protectedRoutes = ['/history', '/reminders', '/settings', '/my-schedule', '/admin'];
    if (protectedRoutes.some((pr) => path.startsWith(pr))) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
