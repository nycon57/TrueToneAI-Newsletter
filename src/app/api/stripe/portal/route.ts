import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/config';
import { getApiUser } from '@/lib/api/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await getApiUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!user.stripe_customer_id) {
      return NextResponse.json(
        { error: 'No Stripe customer ID' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_URL;
    if (!baseUrl) {
      throw new Error('NEXT_PUBLIC_URL environment variable is required');
    }

    // Normalize URL to avoid duplicate slashes
    const normalizedBaseUrl = baseUrl.replace(/\/$/, '');
    const returnUrl = `${normalizedBaseUrl}/account?tab=billing`;

    // Use your custom billing portal configuration
    const portalConfig = process.env.STRIPE_BILLING_PORTAL_CONFIG_ID || 'bpc_1SLPLHCezhgJ3dc1P6xPF58J';

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: returnUrl,
      configuration: portalConfig,
    });

    return NextResponse.json({ url: session.url });

  } catch (error) {
    console.error('Portal session error:', error);

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    );
  }
}
