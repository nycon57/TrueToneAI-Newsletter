import { NextRequest, NextResponse } from 'next/server';
import { stripe, STRIPE_CONFIG } from '@/lib/stripe/config';
import { getApiUser } from '@/lib/api/auth';

/**
 * Stripe Checkout Session Creation
 * Creates a checkout session for users to subscribe to paid tier
 */

export async function POST(req: NextRequest) {
  try {
    console.log('[Checkout] Starting checkout process...');
    const user = await getApiUser();
    console.log('[Checkout] User authenticated:', {
      id: user.id,
      email: user.email,
      stripe_customer_id: user.stripe_customer_id,
      subscription_tier: user.subscription_tier
    });
    const { returnUrl } = await req.json();
    console.log('[Checkout] Return URL:', returnUrl);

    if (!process.env.STRIPE_PRICE_ID_PAID_TIER) {
      console.error('[Checkout] STRIPE_PRICE_ID_PAID_TIER not configured');
      return NextResponse.json(
        { error: 'Subscription pricing not configured' },
        { status: 500 }
      );
    }

    // Create checkout session without pre-creating customer
    // Stripe will create the customer during successful checkout
    // The webhook will then save the customer ID to our database
    const sessionParams: any = {
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID_PAID_TIER,
          quantity: 1,
        },
      ],
      success_url: returnUrl || `${STRIPE_CONFIG.success_url}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: returnUrl || STRIPE_CONFIG.cancel_url,
      metadata: {
        userId: user.id,
        kinde_id: user.kinde_id || '',
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      subscription_data: {
        metadata: {
          userId: user.id,
          kinde_id: user.kinde_id || '',
        },
        // 7-day free trial
        trial_period_days: 7,
      },
    };

    // If user already has a Stripe customer ID, use it
    // Otherwise, provide email and let Stripe create the customer
    if (user.stripe_customer_id) {
      console.log('[Checkout] Using existing Stripe customer:', user.stripe_customer_id);
      sessionParams.customer = user.stripe_customer_id;
    } else {
      console.log('[Checkout] Will create new Stripe customer during checkout for:', user.email);
      sessionParams.customer_email = user.email;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    console.log('[Checkout] Created checkout session:', session.id, 'for user:', user.id);

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });

  } catch (error) {
    console.error('[Checkout] Error details:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      type: typeof error
    });

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to create checkout session',
        message: error instanceof Error ? error.message : 'Unknown error',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : String(error)) : undefined
      },
      { status: 500 }
    );
  }
}