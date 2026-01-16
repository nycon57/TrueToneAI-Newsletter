import { NextRequest, NextResponse } from 'next/server';
import { performBundlesocialPost, performBundlesocialUpload } from '@/lib/social/bundlesocial-actions';
import { getApiUser } from '@/lib/api/auth';
import { createClient } from '@/lib/supabase/server';
import { checkBotId } from 'botid/server';

export async function POST(req: NextRequest) {
  // Bot protection check
  const botVerification = await checkBotId();
  if (botVerification.isBot) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  try {
    const user = await getApiUser();
    const { content, platforms, mediaUrl, scheduled_for } = await req.json();

    if (!content || !platforms || !Array.isArray(platforms)) {
      return NextResponse.json(
        { error: 'Content and platforms array are required' },
        { status: 400 }
      );
    }

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
      return NextResponse.json(
        { error: 'Bundle Social team not configured for your organization' },
        { status: 400 }
      );
    }

    const teamId = userWithOrg.organization.bundle_social_team_id;

    // Handle media upload if provided
    let uploadId;
    if (mediaUrl) {
      const uploadResult = await performBundlesocialUpload(mediaUrl, teamId);
      if (uploadResult.error) {
        return NextResponse.json(
          { error: `Media upload failed: ${uploadResult.error}` },
          { status: 500 }
        );
      }
      uploadId = uploadResult.uploadId;
    }

    // Prepare platform-specific data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const platformData: any = {};
    platforms.forEach((platform: string) => {
      const platformKey = platform.toUpperCase();
      platformData[platformKey] = {
        text: content,
        uploadIds: uploadId ? [uploadId] : []
      };
    });

    // Create Bundle Social post request
    const postRequest = {
      teamId,
      postDate: scheduled_for || new Date().toISOString(),
      status: 'SCHEDULED' as const,
      socialAccountTypes: platforms.map((p: string) => p.toUpperCase()),
      data: platformData
    };

    // Execute the Bundle Social post
    const result = await performBundlesocialPost(postRequest);

    // Save the social media post record
    const { data: socialPost } = await supabase
      .from('social_media_posts')
      .insert({
        user_id: user.id,
        organization_id: user.organization_id,
        bundle_social_post_id: result.results[platforms[0]]?.bundleSocialPostId,
        platforms,
        platform_results: result.results,
        scheduled_for: scheduled_for ? new Date(scheduled_for).toISOString() : new Date().toISOString(),
        status: result.overallStatus === 'success' ? 'published' : 'failed'
      })
      .select()
      .single();

    // Update user's last active timestamp
    await supabase
      .from('users')
      .update({ last_active: new Date().toISOString() })
      .eq('id', user.id);

    return NextResponse.json({
      success: true,
      socialPost,
      bundleSocialResults: result
    });

  } catch (error) {
    console.error('Social publishing error:', error);

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