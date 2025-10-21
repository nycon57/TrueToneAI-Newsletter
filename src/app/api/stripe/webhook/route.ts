import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/config';
import { createClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

/**
 * Stripe Webhook Handler
 * Handles subscription lifecycle events and syncs data to database
 *
 * Events handled:
 * - checkout.session.completed: New subscription created
 * - customer.subscription.updated: Subscription status/plan changed
 * - customer.subscription.deleted: Subscription canceled
 * - invoice.payment_succeeded: Successful recurring payment
 * - invoice.payment_failed: Failed payment (marks past_due)
 */

// Helper function to get user ID from customer
async function getUserIdFromCustomer(customerId: string, supabase: any): Promise<string | null> {
  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  return user?.id || null;
}

// Helper function to get monthly limit based on price ID
function getMonthlyLimitFromPrice(priceId: string): number {
  // Default limits based on price
  // TODO: Update with your actual Stripe price IDs
  const priceLimits: Record<string, number> = {
    [process.env.STRIPE_PRICE_ID_PAID_TIER || '']: 25,
    // Add more price tiers as needed
  };

  return priceLimits[priceId] || 25; // Default to 25 for paid tier
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('Missing signature or webhook secret');
      return NextResponse.json(
        { error: 'Missing signature or webhook secret' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('[Webhook] Checkout session completed:', session.id);

        // Get user ID from metadata or customer
        let userId = session.metadata?.userId;

        if (!userId && session.customer) {
          userId = await getUserIdFromCustomer(session.customer as string, supabase);
        }

        if (!userId) {
          console.error('[Webhook] No user ID found for session:', session.id);
          break;
        }

        // Only process subscription mode checkouts
        if (session.mode === 'subscription' && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          const priceId = subscription.items.data[0].price.id;
          const monthlyLimit = getMonthlyLimitFromPrice(priceId);

          // Update user with subscription info
          const { error: updateError } = await supabase
            .from('users')
            .update({
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: session.subscription as string,
              subscription_tier: 'PAID',
              subscription_status: subscription.status,
              monthly_generation_limit: monthlyLimit,
              monthly_generations_used: 0,
              subscription_created_at: new Date().toISOString(),
            })
            .eq('id', userId);

          if (updateError) {
            console.error('[Webhook] Error updating user:', updateError);
          } else {
            console.log('[Webhook] User upgraded to PAID tier:', userId);
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('[Webhook] Subscription updated:', subscription.id);

        // Get user ID from metadata or customer
        let userId = subscription.metadata?.userId;

        if (!userId) {
          userId = await getUserIdFromCustomer(subscription.customer as string, supabase);
        }

        if (!userId) {
          console.error('[Webhook] No user ID found for subscription:', subscription.id);
          break;
        }

        // Determine tier based on status
        const tier = subscription.status === 'active' ? 'PAID' :
                     subscription.status === 'trialing' ? 'PAID' : 'FREE';

        const priceId = subscription.items.data[0].price.id;
        const monthlyLimit = subscription.status === 'active' || subscription.status === 'trialing'
          ? getMonthlyLimitFromPrice(priceId)
          : 3; // Free tier limit

        // Update subscription status and tier
        const { error: updateError } = await supabase
          .from('users')
          .update({
            subscription_status: subscription.status,
            subscription_tier: tier,
            monthly_generation_limit: monthlyLimit,
          })
          .eq('id', userId);

        if (updateError) {
          console.error('[Webhook] Error updating subscription:', updateError);
        } else {
          console.log('[Webhook] Subscription updated for user:', userId, 'Status:', subscription.status);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('[Webhook] Subscription deleted:', subscription.id);

        // Get user ID from metadata or customer
        let userId = subscription.metadata?.userId;

        if (!userId) {
          userId = await getUserIdFromCustomer(subscription.customer as string, supabase);
        }

        if (!userId) {
          console.error('[Webhook] No user ID found for subscription:', subscription.id);
          break;
        }

        // Downgrade to free tier
        const { error: updateError } = await supabase
          .from('users')
          .update({
            subscription_tier: 'FREE',
            subscription_status: 'canceled',
            monthly_generation_limit: 3,
            stripe_subscription_id: null,
          })
          .eq('id', userId);

        if (updateError) {
          console.error('[Webhook] Error downgrading user:', updateError);
        } else {
          console.log('[Webhook] User downgraded to FREE tier:', userId);
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('[Webhook] Payment succeeded:', invoice.id);

        // Get user ID from customer
        if (invoice.customer) {
          const userId = await getUserIdFromCustomer(invoice.customer as string, supabase);

          if (userId && invoice.subscription) {
            // Ensure subscription is active
            const { error: updateError } = await supabase
              .from('users')
              .update({
                subscription_status: 'active',
                subscription_tier: 'PAID',
              })
              .eq('id', userId);

            if (updateError) {
              console.error('[Webhook] Error updating after payment:', updateError);
            } else {
              console.log('[Webhook] Payment processed for user:', userId);
            }
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('[Webhook] Payment failed:', invoice.id);

        // Get user ID from customer
        if (invoice.customer) {
          const userId = await getUserIdFromCustomer(invoice.customer as string, supabase);

          if (userId) {
            // Mark subscription as past_due
            const { error: updateError } = await supabase
              .from('users')
              .update({
                subscription_status: 'past_due',
              })
              .eq('id', userId);

            if (updateError) {
              console.error('[Webhook] Error updating after failed payment:', updateError);
            } else {
              console.log('[Webhook] Subscription marked past_due for user:', userId);
            }
          }
        }
        break;
      }

      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('[Webhook] Error:', error);

    // Return 500 for actual errors (not signature verification)
    return NextResponse.json(
      {
        error: 'Webhook handler failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}