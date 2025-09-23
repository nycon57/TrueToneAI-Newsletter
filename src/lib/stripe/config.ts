import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});

// Basic subscription configuration (no plans/limits as requested)
export const STRIPE_CONFIG = {
  currency: 'usd',
  success_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/dashboard`,
  cancel_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/pricing`,
};

export interface StripeCustomer {
  id: string;
  email: string;
  name?: string;
  metadata: {
    userId: string;
    organizationId?: string;
  };
}

export interface StripeSubscription {
  id: string;
  customer: string;
  status: string;
  current_period_start: number;
  current_period_end: number;
  cancel_at_period_end: boolean;
  metadata: {
    userId: string;
    organizationId?: string;
  };
}