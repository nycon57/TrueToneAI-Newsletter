import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/api/auth-cached';

/**
 * GET /api/user/locked-generations
 *
 * Returns the count of locked generations for free tier users.
 * For paid users, returns 0.
 */
export async function GET(req: NextRequest) {
  try {
    // Get authenticated user
    const user = await getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = await createClient();

    // Call the Supabase RPC function
    const { data, error } = await supabase.rpc('get_locked_generations_count', {
      user_id: user.id
    });

    if (error) {
      console.error('[API] Error fetching locked generations count:', error);
      return NextResponse.json(
        { error: 'Failed to fetch locked generations count' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      count: data || 0,
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
