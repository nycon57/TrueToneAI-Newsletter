import { Resend } from 'resend';

// Validate RESEND_API_KEY in production
const resendKey = process.env.RESEND_API_KEY || 're_placeholder_key_for_build';

if (process.env.NODE_ENV === 'production' && (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_placeholder_key_for_build')) {
  console.error('FATAL: RESEND_API_KEY is not configured in production');
  throw new Error('Cannot start service: RESEND_API_KEY environment variable is required in production');
}

export const resend = new Resend(resendKey);

export const EMAIL_CONFIG = {
  from: 'TrueTone Insights <noreply@yourdomain.com>',
  replyTo: 'support@yourdomain.com',
};

export interface NewsletterData {
  user: {
    id: string;
    email: string;
    name: string;
    firstName?: string;
  };
  newsletter: {
    id: string;
    title: string;
    content: any;
    personalizedContent?: any;
  };
  unsubscribeUrl: string;
}

export function generateNewsletterSubject(title: string, userName?: string): string {
  const firstName = userName?.split(' ')[0] || '';
  if (firstName) {
    return `${firstName}, here's today's TrueTone Insights: ${title}`;
  }
  return `Today's TrueTone Insights: ${title}`;
}

export function generateUnsubscribeUrl(userId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
  return `${baseUrl}/unsubscribe?user=${userId}`;
}