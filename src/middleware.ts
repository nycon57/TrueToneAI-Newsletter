import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { createClient } from '@/lib/supabase/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only apply middleware to protected routes
  const protectedRoutes = ['/dashboard', '/onboarding', '/admin'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Allow all other routes (homepage, newsletter, etc.) to pass through
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  try {
    // Check authentication for protected routes
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();

    // If accessing protected route without auth, redirect to home
    if (!kindeUser?.id) {
      console.log('[Middleware] No authenticated user, redirecting to home');
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Fetch user data from database
    try {
      const supabase = await createClient();
      const { data: user, error } = await supabase
        .from('users')
        .select('has_completed_onboarding, role')
        .eq('kinde_id', kindeUser.id)
        .single();

      if (error) {
        console.error('[Middleware] Database error checking user data:', {
          kindeId: kindeUser.id,
          error: error.message,
          code: error.code,
          details: error.details
        });

        // On database error for admin routes, deny access
        if (pathname.startsWith('/admin')) {
          return NextResponse.redirect(new URL('/', req.url));
        }

        // For onboarding/dashboard, allow access (fail open) but log the issue
        return NextResponse.next();
      }

      if (!user) {
        console.warn('[Middleware] User not found in database:', {
          kindeId: kindeUser.id,
          email: kindeUser.email
        });

        // If user doesn't exist and trying to access admin, deny
        if (pathname.startsWith('/admin')) {
          return NextResponse.redirect(new URL('/', req.url));
        }

        // If user doesn't exist in DB yet, allow them through for onboarding/dashboard
        // The auth-cached function will create them on the next page load
        return NextResponse.next();
      }

      // Admin route protection - check role
      if (pathname.startsWith('/admin')) {
        // Only allow admin and super_admin roles
        if (!user.role || !['admin', 'super_admin'].includes(user.role)) {
          console.log('[Middleware] Unauthorized admin access attempt:', {
            kindeId: kindeUser.id,
            role: user.role || 'none'
          });
          return NextResponse.redirect(new URL('/', req.url));
        }

        console.log('[Middleware] Admin access granted:', {
          kindeId: kindeUser.id,
          role: user.role
        });

        // Admin has access, continue
        return NextResponse.next();
      }

      // Onboarding/Dashboard route protection
      if (pathname.startsWith('/onboarding') || pathname.startsWith('/dashboard')) {
        const hasCompletedOnboarding = user.has_completed_onboarding;

        // If trying to access onboarding but already completed, redirect to dashboard
        if (pathname.startsWith('/onboarding') && hasCompletedOnboarding) {
          console.log('[Middleware] User completed onboarding, redirecting to dashboard');
          return NextResponse.redirect(new URL('/dashboard', req.url));
        }

        // If trying to access dashboard but haven't completed onboarding, redirect to onboarding
        if (pathname.startsWith('/dashboard') && !hasCompletedOnboarding) {
          console.log('[Middleware] User has not completed onboarding, redirecting to onboarding');
          return NextResponse.redirect(new URL('/onboarding', req.url));
        }
      }
    } catch (error) {
      console.error('[Middleware] Unexpected error checking user data:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        kindeId: kindeUser.id
      });

      // On unexpected error for admin routes, deny access
      if (pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/', req.url));
      }

      // For onboarding/dashboard, allow access (fail open) to prevent user lockout
      // The actual page will handle authentication and show appropriate errors
      return NextResponse.next();
    }

    return NextResponse.next();
  } catch (error) {
    console.error('[Middleware] Critical error in middleware:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      pathname
    });

    // On critical error, redirect to home instead of allowing access
    // This prevents potential security issues from unhandled errors
    return NextResponse.redirect(new URL('/', req.url));
  }
}

export const config = {
  matcher: [
    /*
     * Only match protected routes:
     * - /dashboard and its sub-routes
     * - /onboarding and its sub-routes
     * - /admin and its sub-routes (role-based access)
     *
     * Explicitly exclude /api/* routes to prevent middleware from running
     * on API routes and causing infinite loops
     */
    '/dashboard/:path*',
    '/onboarding/:path*',
    '/admin/:path*',
  ],
};