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

    const { data: articles, error } = await supabase
      .from('articles')
      .select(`
        *,
        created_by:users!articles_created_by_admin_id_fkey(name, email),
        edited_by:users!articles_last_edited_by_admin_id_fkey(name, email)
      `)
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ articles });

  } catch (error) {
    console.error('Admin articles error:', error);

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}
