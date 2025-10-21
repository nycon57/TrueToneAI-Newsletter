import { createClient } from '@/lib/supabase/server';
import { cookies, headers } from 'next/headers';

export interface AnonymousSession {
  id: string;
  session_id: string;
  ip_address: string | null;
  generations_used: number;
  created_at: string;
  last_used_at: string;
}

/**
 * Get the IP address from the request headers
 */
export async function getClientIpAddress(): Promise<string | null> {
  const headersList = await headers();

  // Try various headers in order of preference
  const forwardedFor = headersList.get('x-forwarded-for');
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, get the first one
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = headersList.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback to other common headers
  const cfConnectingIp = headersList.get('cf-connecting-ip'); // Cloudflare
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  return null;
}

/**
 * Get or create an anonymous session
 * Uses both session cookie and IP address for tracking
 */
export async function getOrCreateAnonymousSession(): Promise<{
  sessionId: string;
  ipAddress: string | null;
  existingUsage: number;
}> {
  const cookieStore = await cookies();
  const ipAddress = await getClientIpAddress();

  // Check for existing session cookie
  let sessionId = cookieStore.get('anonymous_session')?.value;

  if (!sessionId) {
    // Generate new session ID
    sessionId = `anon_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

    // Set the cookie
    cookieStore.set('anonymous_session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/'
    });
  }

  // Check if session exists in database
  const supabase = await createClient();

  // Try to find by session ID first
  let { data: session } = await supabase
    .from('anonymous_ai_usage')
    .select('*')
    .eq('session_id', sessionId)
    .single();

  // If not found and we have IP, try to find by IP
  if (!session && ipAddress) {
    const { data: ipSession } = await supabase
      .from('anonymous_ai_usage')
      .select('*')
      .eq('ip_address', ipAddress)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    session = ipSession;
  }

  return {
    sessionId,
    ipAddress,
    existingUsage: session?.generations_used || 0
  };
}

/**
 * Create a new anonymous session record in the database
 */
export async function createAnonymousSession(
  sessionId: string,
  ipAddress: string | null
): Promise<void> {
  const supabase = await createClient();

  await supabase
    .from('anonymous_ai_usage')
    .insert({
      session_id: sessionId,
      ip_address: ipAddress,
      generations_used: 0,
      created_at: new Date().toISOString(),
      last_used_at: new Date().toISOString()
    });
}

/**
 * Update anonymous session usage
 */
export async function updateAnonymousSessionUsage(
  sessionId: string,
  ipAddress: string | null
): Promise<void> {
  const supabase = await createClient();

  // Try to find session by session_id first
  const { data: session } = await supabase
    .from('anonymous_ai_usage')
    .select('*')
    .eq('session_id', sessionId)
    .single();

  if (session) {
    // Update existing session
    await supabase
      .from('anonymous_ai_usage')
      .update({
        generations_used: session.generations_used + 1,
        last_used_at: new Date().toISOString()
      })
      .eq('id', session.id);
  } else {
    // Create new session
    await supabase
      .from('anonymous_ai_usage')
      .insert({
        session_id: sessionId,
        ip_address: ipAddress,
        generations_used: 1,
        created_at: new Date().toISOString(),
        last_used_at: new Date().toISOString()
      });
  }
}

/**
 * Check if anonymous session has reached generation limit
 */
export async function checkAnonymousSessionLimit(
  sessionId: string,
  ipAddress: string | null,
  limit: number = 3
): Promise<{
  allowed: boolean;
  remaining: number;
  used: number;
}> {
  const supabase = await createClient();

  // Try to find by session ID
  let { data: session } = await supabase
    .from('anonymous_ai_usage')
    .select('*')
    .eq('session_id', sessionId)
    .single();

  // If not found and we have IP, try IP
  if (!session && ipAddress) {
    const { data: ipSession } = await supabase
      .from('anonymous_ai_usage')
      .select('*')
      .eq('ip_address', ipAddress)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    session = ipSession;
  }

  const used = session?.generations_used || 0;
  const remaining = Math.max(0, limit - used);

  return {
    allowed: used < limit,
    remaining,
    used
  };
}
