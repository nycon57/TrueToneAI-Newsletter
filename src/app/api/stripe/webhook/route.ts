import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/config';
import { createClient } from '@/lib/supabase/server';
import Stripe from 'stripe';
import {
  sendSubscriptionCreated,
  sendPaymentSuccessful,
  sendPaymentFailed,
  sendSubscriptionCancelled,
} from '@/emails/service/send';

/**
 * Stripe Webhook Handler
 * Handles subscription lifecycle events and syncs data to database
 *
 * Events handled:
 * - checkout.session.completed: New subscription created
 * - customer.subscription.created: Subscription created (sends welcome email)
 * - customer.subscription.updated: Subscription status/plan changed
 * - customer.subscription.deleted: Subscription canceled (sends cancellation email)
 * - invoice.payment_succeeded: Successful recurring payment (sends receipt)
 * - invoice.payment_failed: Failed payment (sends alert email)
 */

// Helper function to get user data from customer
async function getUserFromCustomer(
  customerId: string,
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<{ id: string; email: string; name: string } | null> {
  const { data: user, error } = await supabase
    .from('users')
    .select('id, email, name')
    .eq('stripe_customer_id', customerId)
    .maybeSingle();

  if (error) {
    console.error('[Webhook] Error fetching user by customer ID:', error);
    return null;
  }

  return user || null;
}

// Helper function to get user ID from customer (for backwards compatibility)
async function getUserIdFromCustomer(
  customerId: string,
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<string | null> {
  const user = await getUserFromCustomer(customerId, supabase);
  return user?.id || null;
}

// Helper function to get plan name from price ID
function getPlanNameFromPrice(priceId: string): string {
  // Map common price IDs to plan names
  // Customize this based on your Stripe price IDs
  const planNames: Record<string, string> = {
    [process.env.STRIPE_PRICE_ID_PAID_TIER || '']: 'Pro',
    // Add more price IDs here as needed
  };

  return planNames[priceId] || 'TrueTone Insights';
}

// Helper function to get monthly limit based on price ID
function getMonthlyLimitFromPrice(priceId: string): number {
  // Build price limits map only when env var is configured
  const priceLimits: Record<string, number> = {};

  if (process.env.STRIPE_PRICE_ID_PAID_TIER) {
    priceLimits[process.env.STRIPE_PRICE_ID_PAID_TIER] = 25;
  }

  // Add more price tiers as needed
  // if (process.env.STRIPE_PRICE_ID_PREMIUM_TIER) {
  //   priceLimits[process.env.STRIPE_PRICE_ID_PREMIUM_TIER] = 100;
  // }

  const limit = priceLimits[priceId];

  if (!limit) {
    console.warn(`[Webhook] Unknown price ID: ${priceId}, using default limit of 25`);
    return 25; // Default to 25 for paid tier
  }

  return limit;
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

          // Calculate next reset date for PAID tier (first of next month)
          const now = new Date();
          const nextReset = new Date(now.getFullYear(), now.getMonth() + 1, 1);

          // Update user with subscription info
          const { error: updateError } = await supabase
            .from('users')
            .update({
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: session.subscription as string,
              subscription_tier: 'paid',
              subscription_status: subscription.status,
              monthly_generation_limit: monthlyLimit,
              monthly_generations_used: 0,
              generation_reset_date: nextReset.toISOString().split('T')[0], // Set monthly reset for paid tier (date only)
              updatedAt: new Date().toISOString(),
            })
            .eq('id', userId);

          if (updateError) {
            console.error('[Webhook] Error updating user:', updateError);
          } else {
            console.log('[Webhook] User upgraded to paid tier with monthly reset:', userId);
          }
        }
        break;
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('[Webhook] Subscription created:', subscription.id);

        // Get user data from customer
        const user = await getUserFromCustomer(subscription.customer as string, supabase);

        if (!user) {
          console.error('[Webhook] No user found for subscription:', subscription.id);
          break;
        }

        // Get plan details
        const priceId = subscription.items.data[0].price.id;
        const planName = getPlanNameFromPrice(priceId);
        const amount = subscription.items.data[0].price.unit_amount || 0;
        const nextBillingDate = new Date(subscription.current_period_end * 1000);

        // Send subscription created email (non-blocking)
        sendSubscriptionCreated({
          to: user.email,
          name: user.name || user.email.split('@')[0],
          planName,
          price: amount,
          nextBillingDate,
        }).catch((error) => {
          console.error('[Webhook] Failed to send subscription created email:', error);
          // Don't fail webhook on email error
        });

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
        const tier = subscription.status === 'active' ? 'paid' :
                     subscription.status === 'trialing' ? 'paid' : 'free';

        const priceId = subscription.items.data[0].price.id;
        const monthlyLimit = subscription.status === 'active' || subscription.status === 'trialing'
          ? getMonthlyLimitFromPrice(priceId)
          : 3; // Free tier lifetime limit

        // Prepare update data
        const updateData: any = {
          subscription_status: subscription.status,
          subscription_tier: tier,
          monthly_generation_limit: monthlyLimit,
        };

        // Set generation_reset_date based on tier
        if (tier === 'paid') {
          // paid tier: set next reset date if not already set
          const now = new Date();
          const nextReset = new Date(now.getFullYear(), now.getMonth() + 1, 1);
          updateData.generation_reset_date = nextReset.toISOString().split('T')[0];
        } else {
          // free tier: null reset date (lifetime limit)
          updateData.generation_reset_date = null;
        }

        // Update subscription status and tier
        const { error: updateError } = await supabase
          .from('users')
          .update(updateData)
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

        // Get user data from customer
        const user = await getUserFromCustomer(subscription.customer as string, supabase);

        if (!user) {
          console.error('[Webhook] No user found for subscription:', subscription.id);
          break;
        }

        // Get plan details for email
        const priceId = subscription.items.data[0]?.price.id;
        const planName = priceId ? getPlanNameFromPrice(priceId) : undefined;
        const endDate = new Date(subscription.current_period_end * 1000);

        // Downgrade to free tier with FRESH 3 generations
        const { error: updateError } = await supabase
          .from('users')
          .update({
            subscription_tier: 'free',
            subscription_status: 'canceled',
            monthly_generation_limit: 3, // Lifetime limit for free tier
            monthly_generations_used: 0, // Fresh start with 3 generations
            generation_reset_date: null, // No reset for free tier (lifetime limit)
            stripe_subscription_id: null,
            updatedAt: new Date().toISOString(),
          })
          .eq('id', user.id);

        if (updateError) {
          console.error('[Webhook] Error downgrading user:', updateError);
        } else {
          console.log('[Webhook] User downgraded to free tier:', user.id);

          // Send subscription cancelled email (non-blocking)
          sendSubscriptionCancelled({
            to: user.email,
            name: user.name || user.email.split('@')[0],
            endDate,
            planName,
            feedback: true,
          }).catch((error) => {
            console.error('[Webhook] Failed to send subscription cancelled email:', error);
            // Don't fail webhook on email error
          });
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('[Webhook] Payment succeeded:', invoice.id);

        // Only send emails for paid invoices (not $0 invoices from trials)
        const isPaidInvoice = invoice.total > 0;

        // Get user data from customer
        if (invoice.customer) {
          const user = await getUserFromCustomer(invoice.customer as string, supabase);

          if (user && invoice.subscription) {
            // Calculate next reset date for PAID tier (first of next month)
            const now = new Date();
            const nextReset = new Date(now.getFullYear(), now.getMonth() + 1, 1);

            // Check if this is a renewal (reset generation counter if reset date has passed)
            const { data: currentUser } = await supabase
              .from('users')
              .select('generation_reset_date')
              .eq('id', user.id)
              .single();

            const shouldResetGenerations =
              !currentUser?.generation_reset_date ||
              new Date(currentUser.generation_reset_date) <= now;

            // Ensure subscription is active with proper reset date AND counter reset
            const { error: updateError } = await supabase
              .from('users')
              .update({
                subscription_status: 'active',
                subscription_tier: 'paid',
                generation_reset_date: nextReset.toISOString().split('T')[0], // Ensure monthly reset for paid tier (date only)
                monthly_generations_used: shouldResetGenerations ? 0 : undefined, // Reset counter if due
                updatedAt: new Date().toISOString(),
              })
              .eq('id', user.id);

            if (updateError) {
              console.error('[Webhook] Error updating after payment:', updateError);
            } else {
              console.log('[Webhook] Payment processed for user:', user.id,
                shouldResetGenerations ? '(generations reset)' : '(no reset needed)');

              // Send payment successful email only for paid invoices (non-blocking)
              if (isPaidInvoice) {
                // Get next billing date from subscription
                let nextBillingDate: Date | null = null;
                if (invoice.subscription) {
                  try {
                    const subscription = await stripe.subscriptions.retrieve(
                      invoice.subscription as string
                    );
                    nextBillingDate = new Date(subscription.current_period_end * 1000);
                  } catch (error) {
                    console.error('[Webhook] Error fetching subscription for next billing:', error);
                  }
                }

                sendPaymentSuccessful({
                  to: user.email,
                  name: user.name || user.email.split('@')[0],
                  amount: invoice.total,
                  invoiceUrl: invoice.hosted_invoice_url,
                  nextBillingDate,
                  receiptNumber: invoice.number || undefined,
                }).catch((error) => {
                  console.error('[Webhook] Failed to send payment successful email:', error);
                  // Don't fail webhook on email error
                });
              }
            }
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('[Webhook] Payment failed:', invoice.id);

        // Get user data from customer
        if (invoice.customer) {
          const user = await getUserFromCustomer(invoice.customer as string, supabase);

          if (user) {
            // Mark subscription as past_due
            const { error: updateError } = await supabase
              .from('users')
              .update({
                subscription_status: 'past_due',
              })
              .eq('id', user.id);

            if (updateError) {
              console.error('[Webhook] Error updating after failed payment:', updateError);
            } else {
              console.log('[Webhook] Subscription marked past_due for user:', user.id);

              // Get next retry date from invoice
              let nextRetryDate: Date | null = null;
              if (invoice.next_payment_attempt) {
                nextRetryDate = new Date(invoice.next_payment_attempt * 1000);
              }

              // Get attempt count from invoice
              const attemptCount = invoice.attempt_count || 1;

              // Generate update payment URL
              const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://truetone.ai';
              const updatePaymentUrl = `${baseUrl}/billing`;

              // Send payment failed email (non-blocking)
              sendPaymentFailed({
                to: user.email,
                name: user.name || user.email.split('@')[0],
                amount: invoice.amount_due,
                attemptCount,
                nextRetryDate,
                updatePaymentUrl,
              }).catch((error) => {
                console.error('[Webhook] Failed to send payment failed email:', error);
                // Don't fail webhook on email error
              });
            }
          }
        }
        break;
      }

      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }

    // Return 200 only when event handling completed successfully
    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error('[Webhook] Error:', error);

    // Check if this is a signature verification error (already handled above)
    if (error instanceof Error && error.message.includes('signature')) {
      // Return 400 for signature verification failures (permanent errors)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Check for permanent errors that should return 4xx
    if (error instanceof Error) {
      // Permanent validation errors
      if (error.message.includes('Invalid') || error.message.includes('required')) {
        return NextResponse.json(
          {
            error: 'Invalid request data',
            message: error.message
          },
          { status: 400 }
        );
      }

      // Resource not found errors
      if (error.message.includes('not found') || error.message.includes('No user')) {
        return NextResponse.json(
          {
            error: 'Resource not found',
            message: error.message
          },
          { status: 404 }
        );
      }
    }

    // Return 500 for transient failures (database errors, network issues, etc.)
    return NextResponse.json(
      {
        error: 'Webhook handler failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}