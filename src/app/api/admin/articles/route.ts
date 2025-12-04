import { NextRequest, NextResponse } from 'next/server';
import { getApiUser } from '@/lib/api/auth';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const user = await getApiUser();

    // Check admin or super_admin role
    if (!user || !['admin', 'super_admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'draft';

    const supabase = await createClient();

    // Build query - support 'all' status to fetch all articles
    let query = supabase
      .from('articles')
      .select(`
        *,
        created_by:users!articles_created_by_admin_id_fkey(name, email),
        edited_by:users!articles_last_edited_by_admin_id_fkey(name, email)
      `);

    // Only filter by status if not 'all'
    if (status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: articles, error } = await query.order('created_at', { ascending: false });

    // Also get counts for each status
    const { data: counts } = await supabase
      .from('articles')
      .select('status')
      .then(({ data }) => {
        const statusCounts = { draft: 0, published: 0, archived: 0, all: 0 };
        data?.forEach((article) => {
          statusCounts[article.status as keyof typeof statusCounts]++;
          statusCounts.all++;
        });
        return { data: statusCounts };
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ articles, counts });

  } catch (error) {
    console.error('Admin articles error:', error);

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}
