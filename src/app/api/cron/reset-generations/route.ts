import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Cron Job: Reset Monthly Generations
 *
 * This endpoint is called by Vercel Cron on the 1st of each month
 * to reset generation counters for all eligible paid users.
 *
 * Schedule: 0 0 1 * * (12:00 AM on the 1st of each month)
 *
 * Security:
 * - Protected by CRON_SECRET environment variable
 * - Only Vercel Cron can call this endpoint
 */
export async function GET(req: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
      console.error('[Cron] CRON_SECRET not configured');
      return NextResponse.json(
        { error: 'Cron secret not configured' },
        { status: 500 }
      );
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      console.error('[Cron] Unauthorized cron attempt');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('[Cron] Starting monthly generation reset...');

    const supabase = await createClient();

    // Call the Supabase RPC function to reset all eligible users
    const { data, error } = await supabase.rpc('reset_all_eligible_users');

    if (error) {
      console.error('[Cron] Error resetting generations:', error);
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          details: error.details
        },
        { status: 500 }
      );
    }

    console.log('[Cron] Monthly reset completed:', data);

    return NextResponse.json({
      success: true,
      ...data,
      message: `Successfully reset ${data.users_reset} paid users`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[Cron] Unexpected error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Unexpected error during reset',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Also support POST for manual testing
export async function POST(req: NextRequest) {
  return GET(req);
}
