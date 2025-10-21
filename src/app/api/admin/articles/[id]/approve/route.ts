import { NextRequest, NextResponse } from 'next/server';
import { getApiUser } from '@/lib/api/auth';
import { createClient } from '@/lib/supabase/server';
import { checkAndTriggerNewsletter } from '@/lib/newsletter/trigger';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getApiUser();

    // Check super admin role
    if (!user || user.role !== 'super_admin') {
      return NextResponse.json({
        error: 'Unauthorized. Super admin access required.'
      }, { status: 403 });
    }

    const { action } = await req.json();

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({
        error: 'Invalid action. Must be "approve" or "reject"'
      }, { status: 400 });
    }

    const supabase = await createClient();

    const updateData = action === 'approve'
      ? {
          status: 'published' as const,
          published_at: new Date().toISOString(),
          last_edited_by_admin_id: user.id
        }
      : {
          status: 'archived' as const,
          last_edited_by_admin_id: user.id
        };

    const { data, error } = await supabase
      .from('articles')
      .update(updateData)
      .eq('id', params.id)
      .eq('status', 'draft') // Only allow approving draft articles
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({
        error: 'Article not found or already processed'
      }, { status: 404 });
    }

    // After approval, check if we should trigger newsletter
    let newsletterTrigger = null;
    if (action === 'approve') {
      try {
        newsletterTrigger = await checkAndTriggerNewsletter();
        console.log('Newsletter trigger check:', newsletterTrigger);
      } catch (triggerError) {
        console.error('Newsletter trigger error:', triggerError);
        // Don't fail the approval if newsletter trigger fails
      }
    }

    return NextResponse.json({
      success: true,
      action,
      article: data,
      newsletter: newsletterTrigger
    });

  } catch (error) {
    console.error('Article approval error:', error);

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    return NextResponse.json({ error: 'Failed to process article' }, { status: 500 });
  }
}
