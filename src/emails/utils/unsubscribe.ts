import { createHmac } from 'crypto';

/**
 * Generate a secure, signed unsubscribe token for a user
 * Token format: base64url(userId:timestamp:signature)
 *
 * @param userId - The unique identifier for the user
 * @returns A URL-safe base64 encoded token
 */
export function generateUnsubscribeToken(userId: string): string {
  const secret = process.env.UNSUBSCRIBE_SECRET || 'your-secret-key-change-in-production';
  const timestamp = Date.now();
  const data = `${userId}:${timestamp}`;

  // Create HMAC signature to prevent tampering
  const signature = createHmac('sha256', secret)
    .update(data)
    .digest('hex');

  // Encode as URL-safe base64
  return Buffer.from(`${data}:${signature}`).toString('base64url');
}

/**
 * Verify and decode an unsubscribe token
 *
 * @param token - The unsubscribe token to verify
 * @returns Object with userId and timestamp if valid, null otherwise
 */
export function verifyUnsubscribeToken(token: string): { userId: string; timestamp: number } | null {
  try {
    // Decode from base64url
    const decoded = Buffer.from(token, 'base64url').toString('utf-8');
    const parts = decoded.split(':');

    if (parts.length !== 3) {
      console.error('[Unsubscribe] Invalid token format: expected 3 parts');
      return null;
    }

    const [userId, timestampStr, signature] = parts;
    const timestamp = parseInt(timestampStr, 10);

    if (isNaN(timestamp)) {
      console.error('[Unsubscribe] Invalid timestamp in token');
      return null;
    }

    // Verify signature to ensure token wasn't tampered with
    const secret = process.env.UNSUBSCRIBE_SECRET || 'your-secret-key-change-in-production';
    const data = `${userId}:${timestamp}`;
    const expectedSignature = createHmac('sha256', secret)
      .update(data)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error('[Unsubscribe] Invalid signature - token may be tampered');
      return null;
    }

    // Check token age (valid for 90 days)
    const maxAge = 90 * 24 * 60 * 60 * 1000; // 90 days in milliseconds
    if (Date.now() - timestamp > maxAge) {
      console.error('[Unsubscribe] Token expired - older than 90 days');
      return null;
    }

    return { userId, timestamp };
  } catch (error) {
    console.error('[Unsubscribe] Error verifying token:', error);
    return null;
  }
}

/**
 * Generate a complete unsubscribe URL with token
 *
 * @param userId - The unique identifier for the user
 * @param baseUrl - The base URL of the application (defaults to NEXT_PUBLIC_URL)
 * @returns Complete unsubscribe URL
 */
export function generateUnsubscribeUrl(userId: string, baseUrl?: string): string {
  const token = generateUnsubscribeToken(userId);
  const base = baseUrl || process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
  return `${base}/api/email/unsubscribe?token=${token}`;
}

/**
 * Generate a preferences management URL with token
 * Allows users to update preferences instead of complete unsubscribe
 *
 * @param userId - The unique identifier for the user
 * @param baseUrl - The base URL of the application (defaults to NEXT_PUBLIC_URL)
 * @returns Complete preferences URL
 */
export function generatePreferencesUrl(userId: string, baseUrl?: string): string {
  const token = generateUnsubscribeToken(userId);
  const base = baseUrl || process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
  return `${base}/preferences?token=${token}`;
}
