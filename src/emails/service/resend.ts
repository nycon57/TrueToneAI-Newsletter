/**
 * Resend Email Service Client
 *
 * Provides a configured Resend client and email configuration
 * for the TrueTone Insights platform.
 */

import { Resend } from 'resend';

// Validate required environment variables at module load time
if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY environment variable is required');
}

/**
 * Configured Resend client instance
 */
export const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Email configuration and defaults
 */
export const EMAIL_CONFIG = {
  from: {
    email: process.env.RESEND_FROM_EMAIL || 'Spark@truetone.ai',
    name: process.env.RESEND_FROM_NAME || 'Spark by TrueTone AI',
  },
  support: process.env.SUPPORT_EMAIL || 'sparksupport@truetone.ai',
  replyTo: process.env.SUPPORT_EMAIL || 'sparksupport@truetone.ai',
  audienceId: process.env.RESEND_AUDIENCE_ID,
} as const;

/**
 * Constructs the full "from" address for emails
 */
export function getFromAddress(): string {
  return `${EMAIL_CONFIG.from.name} <${EMAIL_CONFIG.from.email}>`;
}

/**
 * Checks if the Resend client is properly configured
 */
export function isResendConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY &&
    EMAIL_CONFIG.from.email &&
    EMAIL_CONFIG.from.name
  );
}
