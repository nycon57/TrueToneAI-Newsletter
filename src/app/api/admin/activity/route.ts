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
    const eventType = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const supabase = await createClient();

    // Build query
    let query = supabase
      .from('admin_activity_log')
      .select(`
        *,
        actor:users!admin_activity_log_actor_id_fkey(id, name, email)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Filter by event type if provided
    if (eventType && eventType !== 'all') {
      // Map filter categories to event types
      const typeMap: Record<string, string[]> = {
        submissions: ['article_submitted'],
        approvals: ['article_approved', 'article_rejected'],
        users: ['user_signup', 'user_upgraded', 'user_downgraded'],
        system: ['settings_updated', 'article_archived', 'article_restored'],
      };

      const eventTypes = typeMap[eventType];
      if (eventTypes) {
        query = query.in('event_type', eventTypes);
      }
    }

    const { data: activities, error, count } = await query;

    if (error) {
      console.error('[Activity API] Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Group activities by date for the UI
    const groupedActivities = groupByDate(activities || []);

    return NextResponse.json({
      activities: groupedActivities,
      total: count || 0,
      hasMore: (count || 0) > offset + limit,
    });

  } catch (error) {
    console.error('[Activity API] Error:', error);

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    return NextResponse.json({ error: 'Failed to fetch activity log' }, { status: 500 });
  }
}

interface Activity {
  id: string;
  event_type: string;
  title: string;
  description: string | null;
  resource_type: string | null;
  resource_id: string | null;
  actor: { id: string; name: string | null; email: string } | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

interface GroupedActivities {
  label: string;
  date: string;
  activities: Activity[];
}

function groupByDate(activities: Activity[]): GroupedActivities[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const thisWeekStart = new Date(today);
  thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);

  const groups: Record<string, { label: string; date: string; activities: Activity[] }> = {};

  activities.forEach((activity) => {
    const activityDate = new Date(activity.created_at);
    const dateOnly = new Date(activityDate.getFullYear(), activityDate.getMonth(), activityDate.getDate());

    let groupKey: string;
    let groupLabel: string;

    if (dateOnly.getTime() === today.getTime()) {
      groupKey = 'today';
      groupLabel = 'Today';
    } else if (dateOnly.getTime() === yesterday.getTime()) {
      groupKey = 'yesterday';
      groupLabel = 'Yesterday';
    } else if (dateOnly >= thisWeekStart) {
      groupKey = 'this_week';
      groupLabel = 'This Week';
    } else if (dateOnly >= lastWeekStart) {
      groupKey = 'last_week';
      groupLabel = 'Last Week';
    } else {
      // Group by month
      groupKey = `${activityDate.getFullYear()}-${activityDate.getMonth()}`;
      groupLabel = activityDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }

    if (!groups[groupKey]) {
      groups[groupKey] = {
        label: groupLabel,
        date: groupKey,
        activities: [],
      };
    }

    groups[groupKey].activities.push(activity);
  });

  // Return groups in order: today, yesterday, this week, last week, then by month
  const order = ['today', 'yesterday', 'this_week', 'last_week'];
  const orderedGroups: GroupedActivities[] = [];

  order.forEach((key) => {
    if (groups[key]) {
      orderedGroups.push(groups[key]);
      delete groups[key];
    }
  });

  // Add remaining groups (months) sorted by date descending
  Object.keys(groups)
    .sort((a, b) => b.localeCompare(a))
    .forEach((key) => {
      orderedGroups.push(groups[key]);
    });

  return orderedGroups;
}
