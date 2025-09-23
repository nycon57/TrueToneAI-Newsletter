import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not set in environment variables');
}

export const resend = new Resend(process.env.RESEND_API_KEY);

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