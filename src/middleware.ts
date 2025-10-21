import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only apply middleware to protected routes
  const protectedRoutes = ['/dashboard', '/onboarding'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Allow all other routes (homepage, newsletter, etc.) to pass through
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  try {
    // Check authentication for protected routes
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    // If accessing protected route without auth, redirect to home
    if (!user) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // If authenticated and trying to access onboarding or dashboard
    if (pathname.startsWith('/onboarding') || pathname.startsWith('/dashboard')) {
      try {
        // Check if user has completed onboarding by calling our API
        const response = await fetch(new URL('/api/user', req.url), {
          headers: {
            'Cookie': req.headers.get('cookie') || '',
          },
        });

        if (response.ok) {
          const userData = await response.json();

          // If trying to access onboarding but already completed, redirect to dashboard
          if (pathname.startsWith('/onboarding') && userData.has_completed_onboarding) {
            return NextResponse.redirect(new URL('/dashboard', req.url));
          }

          // If trying to access dashboard but haven't completed onboarding, redirect to onboarding
          if (pathname.startsWith('/dashboard') && !userData.has_completed_onboarding) {
            return NextResponse.redirect(new URL('/onboarding', req.url));
          }
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Error in middleware:', error);
    return NextResponse.redirect(new URL('/', req.url));
  }
}

export const config = {
  matcher: [
    /*
     * Only match protected routes:
     * - /dashboard and its sub-routes
     * - /onboarding and its sub-routes
     */
    '/dashboard/:path*',
    '/onboarding/:path*',
  ],
};