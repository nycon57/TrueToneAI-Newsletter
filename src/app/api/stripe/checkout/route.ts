import { NextRequest, NextResponse } from 'next/server';
import { stripe, STRIPE_CONFIG } from '@/lib/stripe/config';
import { getApiUser } from '@/lib/api/auth';
import { createClient } from '@/lib/supabase/server';

/**
 * Stripe Checkout Session Creation
 * Creates a checkout session for users to subscribe to paid tier
 */

export async function POST(req: NextRequest) {
  try {
    const user = await getApiUser();
    const { returnUrl } = await req.json();

    if (!process.env.STRIPE_PRICE_ID_PAID_TIER) {
      console.error('[Checkout] STRIPE_PRICE_ID_PAID_TIER not configured');
      return NextResponse.json(
        { error: 'Subscription pricing not configured' },
        { status: 500 }
      );
    }

    const supabase = await createClient();

    // Create or retrieve Stripe customer
    let customer;
    if (user.stripe_customer_id) {
      try {
        customer = await stripe.customers.retrieve(user.stripe_customer_id);

        // If customer was deleted, create a new one
        if (customer.deleted) {
          customer = await stripe.customers.create({
            email: user.email,
            name: user.name,
            metadata: {
              userId: user.id,
              organizationId: user.organization_id || '',
            },
          });

          // Update user with new customer ID
          await supabase
            .from('users')
            .update({ stripe_customer_id: customer.id })
            .eq('id', user.id);
        }
      } catch (error) {
        console.error('[Checkout] Error retrieving customer:', error);
        // Create new customer if retrieval fails
        customer = await stripe.customers.create({
          email: user.email,
          name: user.name,
          metadata: {
            userId: user.id,
            organizationId: user.organization_id || '',
          },
        });

        // Update user with new customer ID
        await supabase
          .from('users')
          .update({ stripe_customer_id: customer.id })
          .eq('id', user.id);
      }
    } else {
      // Create new customer
      customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user.id,
          organizationId: user.organization_id || '',
        },
      });

      // Save customer ID to database
      const { error: updateError } = await supabase
        .from('users')
        .update({ stripe_customer_id: customer.id })
        .eq('id', user.id);

      if (updateError) {
        console.error('[Checkout] Error saving customer ID:', updateError);
      } else {
        console.log('[Checkout] Created and saved Stripe customer:', customer.id, 'for user:', user.id);
      }
    }

    // Create checkout session with price ID
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID_PAID_TIER,
          quantity: 1,
        },
      ],
      success_url: returnUrl || `${STRIPE_CONFIG.success_url}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: STRIPE_CONFIG.cancel_url,
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
        // Optional: Add trial period
        // trial_period_days: 7,
      },
    });

    console.log('[Checkout] Created checkout session:', session.id, 'for user:', user.id);

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });

  } catch (error) {
    console.error('[Checkout] Error:', error);

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to create checkout session',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}