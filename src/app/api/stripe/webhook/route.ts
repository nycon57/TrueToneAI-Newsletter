import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/config';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: 'Missing signature or webhook secret' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    const supabase = createClient();

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('Checkout session completed:', session.id);

        // Update user with subscription info
        if (session.metadata?.userId) {
          await supabase
            .from('users')
            .update({
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: session.subscription as string,
              subscription_status: 'active',
              subscription_created_at: new Date().toISOString(),
            })
            .eq('id', session.metadata.userId);
        }
        break;

      case 'customer.subscription.updated':
        const subscription = event.data.object;
        console.log('Subscription updated:', subscription.id);

        // Update subscription status
        if (subscription.metadata?.userId) {
          await supabase
            .from('users')
            .update({
              subscription_status: subscription.status,
            })
            .eq('id', subscription.metadata.userId);
        }
        break;

      case 'customer.subscription.deleted':
        const canceledSubscription = event.data.object;
        console.log('Subscription canceled:', canceledSubscription.id);

        // Update subscription status to canceled
        if (canceledSubscription.metadata?.userId) {
          await supabase
            .from('users')
            .update({
              subscription_status: 'canceled',
            })
            .eq('id', canceledSubscription.metadata.userId);
        }
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object;
        console.log('Payment succeeded:', invoice.id);
        // Handle successful payment if needed
        break;

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object;
        console.log('Payment failed:', failedInvoice.id);
        // Handle failed payment if needed
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}