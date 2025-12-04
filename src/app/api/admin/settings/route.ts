import { NextRequest, NextResponse } from 'next/server';
import { getApiUser } from '@/lib/api/auth';
import { createClient } from '@/lib/supabase/server';
import { logSettingsActivity } from '@/lib/admin/activity-logger';

// Define valid setting keys and their types
const VALID_SETTINGS = [
  'review_sla_hours',
  'rejection_templates',
  'auto_archive_days',
  'email_on_submission',
  'digest_frequency',
  'admin_emails',
] as const;

type SettingKey = typeof VALID_SETTINGS[number];

export async function GET(req: NextRequest) {
  try {
    const user = await getApiUser();

    // Check admin or super_admin role
    if (!user || !['admin', 'super_admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const supabase = await createClient();

    const { data: settings, error } = await supabase
      .from('admin_settings')
      .select('*');

    if (error) {
      console.error('[Settings API] Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform array of settings into an object
    const settingsObj: Record<string, unknown> = {};
    settings?.forEach((setting) => {
      settingsObj[setting.key] = setting.value;
    });

    // Add defaults for any missing settings
    const defaults: Record<SettingKey, unknown> = {
      review_sla_hours: 48,
      rejection_templates: ['Content quality issues', 'Missing required information', 'Duplicate content', 'Off-topic', 'Needs revision'],
      auto_archive_days: 0,
      email_on_submission: true,
      digest_frequency: 'immediate',
      admin_emails: [],
    };

    VALID_SETTINGS.forEach((key) => {
      if (settingsObj[key] === undefined) {
        settingsObj[key] = defaults[key];
      }
    });

    return NextResponse.json({ settings: settingsObj });

  } catch (error) {
    console.error('[Settings API] Error:', error);

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getApiUser();

    // Check super_admin role for settings changes
    if (!user || user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Only super admins can modify settings' }, { status: 403 });
    }

    const updates = await req.json();

    if (!updates || typeof updates !== 'object') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const supabase = await createClient();

    // Get current settings for comparison (for activity logging)
    const { data: currentSettings } = await supabase
      .from('admin_settings')
      .select('*');

    const currentSettingsMap: Record<string, unknown> = {};
    currentSettings?.forEach((setting) => {
      currentSettingsMap[setting.key] = setting.value;
    });

    // Update each setting
    const updateResults = [];
    for (const [key, value] of Object.entries(updates)) {
      // Validate the key
      if (!VALID_SETTINGS.includes(key as SettingKey)) {
        continue; // Skip invalid keys
      }

      const { error } = await supabase
        .from('admin_settings')
        .upsert({
          key,
          value,
          updated_by: user.id,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'key',
        });

      if (error) {
        console.error(`[Settings API] Error updating ${key}:`, error);
        updateResults.push({ key, success: false, error: error.message });
      } else {
        updateResults.push({ key, success: true });

        // Log the activity
        const oldValue = currentSettingsMap[key];
        if (oldValue !== value) {
          await logSettingsActivity(key, oldValue, value, user.id);
        }
      }
    }

    const successCount = updateResults.filter((r) => r.success).length;
    const failCount = updateResults.filter((r) => !r.success).length;

    return NextResponse.json({
      success: failCount === 0,
      message: failCount === 0
        ? `Updated ${successCount} setting(s)`
        : `Updated ${successCount} setting(s), failed to update ${failCount}`,
      results: updateResults,
    });

  } catch (error) {
    console.error('[Settings API] Error:', error);

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
