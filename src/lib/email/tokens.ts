/**
 * Secure Email Token Generation and Validation
 *
 * Uses HMAC-SHA256 for cryptographic token generation and validation.
 * Tokens are time-limited and tied to specific email addresses.
 */

import crypto from 'crypto';

// Token configuration
const TOKEN_SECRET = process.env.EMAIL_TOKEN_SECRET || process.env.KINDE_CLIENT_SECRET || 'fallback-secret-change-in-production';
const TOKEN_EXPIRY_HOURS = 72; // Tokens expire after 72 hours

interface TokenPayload {
  email: string;
  action: 'unsubscribe' | 'preferences' | 'verify';
  timestamp: number;
  expiresAt: number;
}

/**
 * Generate a secure, time-limited token for email actions
 *
 * @param email - The email address to generate the token for
 * @param action - The action type (unsubscribe, preferences, verify)
 * @returns Base64 encoded token string
 */
export function generateEmailToken(
  email: string,
  action: 'unsubscribe' | 'preferences' | 'verify' = 'unsubscribe'
): string {
  const timestamp = Date.now();
  const expiresAt = timestamp + (TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

  const payload: TokenPayload = {
    email: email.toLowerCase().trim(),
    action,
    timestamp,
    expiresAt
  };

  // Create payload string
  const payloadString = JSON.stringify(payload);
  const payloadBase64 = Buffer.from(payloadString).toString('base64url');

  // Create HMAC signature
  const hmac = crypto.createHmac('sha256', TOKEN_SECRET);
  hmac.update(payloadBase64);
  const signature = hmac.digest('base64url');

  // Combine payload and signature
  return `${payloadBase64}.${signature}`;
}

/**
 * Validate an email token and extract its payload
 *
 * @param token - The token to validate
 * @param expectedEmail - The email address that should match the token
 * @param expectedAction - The action type that should match the token
 * @returns Object with valid flag and optional payload/error
 */
export function validateEmailToken(
  token: string,
  expectedEmail: string,
  expectedAction: 'unsubscribe' | 'preferences' | 'verify' = 'unsubscribe'
): { valid: boolean; payload?: TokenPayload; error?: string } {
  try {
    // Split token into payload and signature
    const parts = token.split('.');
    if (parts.length !== 2) {
      return { valid: false, error: 'Invalid token format' };
    }

    const [payloadBase64, providedSignature] = parts;

    // Verify signature
    const hmac = crypto.createHmac('sha256', TOKEN_SECRET);
    hmac.update(payloadBase64);
    const expectedSignature = hmac.digest('base64url');

    // Use timing-safe comparison to prevent timing attacks
    if (!crypto.timingSafeEqual(
      Buffer.from(providedSignature),
      Buffer.from(expectedSignature)
    )) {
      return { valid: false, error: 'Invalid token signature' };
    }

    // Decode and parse payload
    const payloadString = Buffer.from(payloadBase64, 'base64url').toString('utf-8');
    const payload: TokenPayload = JSON.parse(payloadString);

    // Check expiration
    if (Date.now() > payload.expiresAt) {
      return { valid: false, error: 'Token has expired' };
    }

    // Verify email matches
    if (payload.email !== expectedEmail.toLowerCase().trim()) {
      return { valid: false, error: 'Email mismatch' };
    }

    // Verify action matches
    if (payload.action !== expectedAction) {
      return { valid: false, error: 'Action mismatch' };
    }

    return { valid: true, payload };
  } catch (error) {
    console.error('[EmailToken] Validation error:', error);
    return { valid: false, error: 'Token validation failed' };
  }
}

/**
 * Generate an unsubscribe URL with a secure token
 *
 * @param email - The email address to generate the URL for
 * @returns Full unsubscribe URL with token
 */
export function generateUnsubscribeUrl(email: string): string {
  const token = generateEmailToken(email, 'unsubscribe');
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const encodedEmail = encodeURIComponent(email.toLowerCase().trim());
  const encodedToken = encodeURIComponent(token);

  return `${baseUrl}/api/email/unsubscribe?email=${encodedEmail}&token=${encodedToken}`;
}

/**
 * Generate an email preferences URL with a secure token
 *
 * @param email - The email address to generate the URL for
 * @returns Full preferences URL with token
 */
export function generatePreferencesUrl(email: string): string {
  const token = generateEmailToken(email, 'preferences');
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const encodedEmail = encodeURIComponent(email.toLowerCase().trim());
  const encodedToken = encodeURIComponent(token);

  return `${baseUrl}/account/email-preferences?email=${encodedEmail}&token=${encodedToken}`;
}

/**
 * Check if a token is close to expiring (within 24 hours)
 * Useful for regenerating tokens before they expire
 *
 * @param token - The token to check
 * @returns Boolean indicating if token expires within 24 hours
 */
export function isTokenExpiringSoon(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return true;

    const payloadString = Buffer.from(parts[0], 'base64url').toString('utf-8');
    const payload: TokenPayload = JSON.parse(payloadString);

    const twentyFourHoursFromNow = Date.now() + (24 * 60 * 60 * 1000);
    return payload.expiresAt < twentyFourHoursFromNow;
  } catch {
    return true;
  }
}
