import { createClient } from '@/lib/supabase/server';

export type ActivityEventType =
  | 'article_submitted'
  | 'article_approved'
  | 'article_rejected'
  | 'article_archived'
  | 'article_restored'
  | 'user_signup'
  | 'user_upgraded'
  | 'user_downgraded'
  | 'settings_updated';

export type ResourceType = 'article' | 'user' | 'setting';

interface LogActivityParams {
  eventType: ActivityEventType;
  title: string;
  description?: string;
  resourceType?: ResourceType;
  resourceId?: string;
  actorId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Logs an admin activity to the admin_activity_log table.
 * This creates an audit trail for all admin actions.
 */
export async function logActivity({
  eventType,
  title,
  description,
  resourceType,
  resourceId,
  actorId,
  metadata = {},
}: LogActivityParams): Promise<void> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from('admin_activity_log').insert({
      event_type: eventType,
      title,
      description,
      resource_type: resourceType,
      resource_id: resourceId,
      actor_id: actorId,
      metadata,
    });

    if (error) {
      console.error('[ActivityLogger] Failed to log activity:', error);
      // Don't throw - activity logging should not break the main flow
    }
  } catch (err) {
    console.error('[ActivityLogger] Error logging activity:', err);
    // Silently fail - activity logging is non-critical
  }
}

/**
 * Helper function to log article-related activities
 */
export async function logArticleActivity(
  action: 'approved' | 'rejected' | 'archived' | 'restored' | 'submitted',
  articleId: string,
  articleTitle: string,
  actorId: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  const eventTypeMap: Record<string, ActivityEventType> = {
    approved: 'article_approved',
    rejected: 'article_rejected',
    archived: 'article_archived',
    restored: 'article_restored',
    submitted: 'article_submitted',
  };

  const titleMap: Record<string, string> = {
    approved: `Article approved: ${articleTitle}`,
    rejected: `Article rejected: ${articleTitle}`,
    archived: `Article archived: ${articleTitle}`,
    restored: `Article restored: ${articleTitle}`,
    submitted: `New article submitted: ${articleTitle}`,
  };

  await logActivity({
    eventType: eventTypeMap[action],
    title: titleMap[action],
    description: articleTitle,
    resourceType: 'article',
    resourceId: articleId,
    actorId,
    metadata,
  });
}

/**
 * Helper function to log user-related activities
 */
export async function logUserActivity(
  action: 'signup' | 'upgraded' | 'downgraded',
  userId: string,
  userName: string,
  actorId?: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  const eventTypeMap: Record<string, ActivityEventType> = {
    signup: 'user_signup',
    upgraded: 'user_upgraded',
    downgraded: 'user_downgraded',
  };

  const titleMap: Record<string, string> = {
    signup: `New user registered: ${userName}`,
    upgraded: `User upgraded subscription: ${userName}`,
    downgraded: `User downgraded subscription: ${userName}`,
  };

  await logActivity({
    eventType: eventTypeMap[action],
    title: titleMap[action],
    description: userName,
    resourceType: 'user',
    resourceId: userId,
    actorId,
    metadata,
  });
}

/**
 * Helper function to log settings changes
 */
export async function logSettingsActivity(
  settingKey: string,
  oldValue: unknown,
  newValue: unknown,
  actorId: string
): Promise<void> {
  await logActivity({
    eventType: 'settings_updated',
    title: `Setting updated: ${settingKey}`,
    description: `Changed from ${JSON.stringify(oldValue)} to ${JSON.stringify(newValue)}`,
    resourceType: 'setting',
    actorId,
    metadata: {
      setting_key: settingKey,
      old_value: oldValue,
      new_value: newValue,
    },
  });
}
