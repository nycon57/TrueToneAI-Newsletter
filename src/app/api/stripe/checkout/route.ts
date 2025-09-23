import { NextRequest, NextResponse } from 'next/server';
import { stripe, STRIPE_CONFIG } from '@/lib/stripe/config';
import { getApiUser } from '@/lib/api/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await getApiUser();
    const { returnUrl } = await req.json();

    // Create or retrieve Stripe customer
    let customer;
    if (user.stripe_customer_id) {
      customer = await stripe.customers.retrieve(user.stripe_customer_id);
    } else {
      customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user.id,
          organizationId: user.organization_id || '',
        },
      });

      // Update user with Stripe customer ID
      // Note: In production, you'd update this in the database
      // For now, we'll just proceed with the session
    }

    // Create checkout session (basic subscription without specific plans)
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      mode: 'subscription',
      success_url: returnUrl || STRIPE_CONFIG.success_url,
      cancel_url: STRIPE_CONFIG.cancel_url,
      metadata: {
        userId: user.id,
        organizationId: user.organization_id || '',
      },
      // For now, we'll use a simple subscription without predefined plans
      // This would be configured with actual price IDs in production
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      subscription_data: {
        metadata: {
          userId: user.id,
          organizationId: user.organization_id || '',
        },
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });

  } catch (error) {
    console.error('Stripe checkout error:', error);

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}