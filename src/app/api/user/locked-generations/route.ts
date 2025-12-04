import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCachedApiUser } from '@/lib/api/auth-cached';

/**
 * GET /api/user/locked-generations
 *
 * Returns the count of locked generations for free tier users.
 * For paid users, returns 0.
 */
export async function GET(req: NextRequest) {
  try {
    // Get authenticated user
    const user = await getCachedApiUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = await createClient();

    // For paid users, return 0 locked generations
    if (user.subscription_tier?.toLowerCase() !== 'free') {
      return NextResponse.json({
        count: 0,
        tier: user.subscription_tier?.toUpperCase() || 'FREE'
      });
    }

    // For free users, count their generations (these are "locked" behind paywall)
    const { count, error } = await supabase
      .from('generations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (error) {
      console.error('[API] Error fetching locked generations count:', error);
      return NextResponse.json(
        { error: 'Failed to fetch locked generations count' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      count: count || 0,
      tier: user.subscription_tier?.toUpperCase() || 'FREE'
    });

  } catch (error) {
    console.error('[API] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
