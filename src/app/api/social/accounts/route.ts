import { NextRequest, NextResponse } from 'next/server';
import { getConnectedSocialAccounts } from '@/lib/social/bundlesocial-actions';
import { getApiUser } from '@/lib/api/auth';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const user = await getApiUser();
    const supabase = createClient();

    // Get user's organization and Bundle Social team ID
    const { data: userWithOrg } = await supabase
      .from('users')
      .select(`
        *,
        organization:organizations(*)
      `)
      .eq('id', user.id)
      .single();

    if (!userWithOrg?.organization?.bundle_social_team_id) {
      return NextResponse.json({
        accounts: [],
        message: 'Bundle Social team not configured for your organization'
      });
    }

    // Fetch connected social accounts from Bundle Social
    const result = await getConnectedSocialAccounts(
      userWithOrg.organization.bundle_social_team_id
    );

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      accounts: result.accounts || [],
      teamId: userWithOrg.organization.bundle_social_team_id
    });

  } catch (error) {
    console.error('Social accounts API error:', error);

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}