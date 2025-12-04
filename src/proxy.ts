import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { createClient } from '@/lib/supabase/server';

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only apply proxy to protected routes
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
      console.log('[Proxy] No authenticated user, redirecting to home');
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Fetch user data from database
    try {
      const supabase = await createClient();
      const { data: user, error } = await supabase
        .from('users')
        .select('role')
        .eq('kinde_id', kindeUser.id)
        .single();

      if (error) {
        console.error('[Proxy] Database error checking user data:', {
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
        console.warn('[Proxy] User not found in database:', {
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
          console.log('[Proxy] Unauthorized admin access attempt:', {
            kindeId: kindeUser.id,
            role: user.role || 'none'
          });
          return NextResponse.redirect(new URL('/', req.url));
        }

        console.log('[Proxy] Admin access granted:', {
          kindeId: kindeUser.id,
          role: user.role
        });

        // Admin has access, continue
        return NextResponse.next();
      }

      // Onboarding/Dashboard route protection - removed has_completed_onboarding check
      // Users can access both onboarding and dashboard freely
      // TODO: Re-add onboarding flow protection once has_completed_onboarding column is added to DB
      if (pathname.startsWith('/onboarding') || pathname.startsWith('/dashboard')) {
        // Allow access to both routes for now
        return NextResponse.next();
      }
    } catch (error) {
      console.error('[Proxy] Unexpected error checking user data:', {
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
    console.error('[Proxy] Critical error in middleware:', {
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
     * Explicitly exclude /api/* routes to prevent proxy from running
     * on API routes and causing infinite loops
     */
    '/dashboard/:path*',
    '/onboarding/:path*',
    '/admin/:path*',
  ],
};