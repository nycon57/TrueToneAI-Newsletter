import { NextRequest, NextResponse } from 'next/server';
import { stripe, STRIPE_CONFIG } from '@/lib/stripe/config';
import { getKindeUserOnly, getApiUserWithoutAccessCheck } from '@/lib/api/auth';
import { obfuscateId } from '@/lib/utils';

/**
 * Stripe Checkout Session Creation
 * Creates a checkout session for users to subscribe to paid tier
 *
 * Uses lightweight auth that doesn't require newsletter access or DB user,
 * since this is used during onboarding before user has access.
 */

export async function POST(req: NextRequest) {
  try {
    console.log('[Checkout] Starting checkout process...');

    // Get Kinde user (doesn't require DB user or newsletter access)
    const kindeUser = await getKindeUserOnly();
    console.log('[Checkout] Kinde user authenticated:', {
      kinde_id: obfuscateId(kindeUser.kinde_id),
      email: kindeUser.email,
    });

    // Try to get DB user if they exist (for existing customers)
    const dbUser = await getApiUserWithoutAccessCheck();
    console.log('[Checkout] DB user:', dbUser ? {
      id: dbUser.id,
      stripe_customer_id: dbUser.stripe_customer_id,
      subscription_tier: dbUser.subscription_tier
    } : 'Not found (onboarding user)');

    const { returnUrl, cancelUrl } = await req.json();
    console.log('[Checkout] Return URL:', returnUrl);
    console.log('[Checkout] Cancel URL:', cancelUrl);

    if (!process.env.STRIPE_PRICE_ID_PAID_TIER) {
      console.error('[Checkout] STRIPE_PRICE_ID_PAID_TIER not configured');
      return NextResponse.json(
        { error: 'Subscription pricing not configured' },
        { status: 500 }
      );
    }

    // Create checkout session
    // For onboarding users without DB record, use kinde_id as identifier
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      cancel_url: cancelUrl || STRIPE_CONFIG.cancel_url,
      metadata: {
        userId: dbUser?.id || '',
        kinde_id: kindeUser.kinde_id,
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      subscription_data: {
        metadata: {
          userId: dbUser?.id || '',
          kinde_id: kindeUser.kinde_id,
        },
        // 7-day free trial
        trial_period_days: 7,
      },
    };

    // If user already has a Stripe customer ID, use it
    // Otherwise, provide email and let Stripe create the customer
    if (dbUser?.stripe_customer_id) {
      console.log('[Checkout] Using existing Stripe customer:', dbUser.stripe_customer_id);
      sessionParams.customer = dbUser.stripe_customer_id;
    } else {
      console.log('[Checkout] Will create new Stripe customer during checkout for:', kindeUser.email);
      sessionParams.customer_email = kindeUser.email;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    console.log('[Checkout] Created checkout session:', session.id, 'for kinde_id:', obfuscateId(kindeUser.kinde_id));

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