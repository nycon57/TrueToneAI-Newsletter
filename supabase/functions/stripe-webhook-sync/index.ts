/**
 * Stripe Webhook Sync - Supabase Edge Function
 *
 * This Edge Function receives webhooks from Stripe and automatically syncs
 * all Stripe data (customers, subscriptions, invoices, etc.) to your Postgres
 * database using @supabase/stripe-sync-engine.
 *
 * Webhook URL: https://[PROJECT_REF].supabase.co/functions/v1/stripe-webhook-sync
 *
 * Environment Variables Required:
 * - DATABASE_URL: Postgres connection string
 * - STRIPE_SECRET_KEY: Stripe API secret key
 * - STRIPE_WEBHOOK_SECRET: Webhook signing secret from Stripe Dashboard
 */

import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { StripeSync } from 'npm:@supabase/stripe-sync-engine@0.39.0';

// Load secrets from environment variables
const DATABASE_URL = Deno.env.get('DATABASE_URL');
const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET');
const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY');

// Validate required environment variables
if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set');
}
if (!STRIPE_WEBHOOK_SECRET) {
  console.error('❌ STRIPE_WEBHOOK_SECRET is not set');
}
if (!STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY is not set');
}

// Initialize StripeSync
const stripeSync = new StripeSync({
  databaseUrl: DATABASE_URL!,
  stripeWebhookSecret: STRIPE_WEBHOOK_SECRET!,
  stripeSecretKey: STRIPE_SECRET_KEY!,

  // Automatically fetch related Stripe objects when syncing
  // For example, when syncing a subscription, also fetch the customer
  backfillRelatedEntities: true,

  // Automatically expand list properties in Stripe objects
  // This gives us more complete data in our database
  autoExpandLists: true,

  // Use 'stripe' schema for all Stripe tables
  schema: 'stripe',
});

Deno.serve(async (req) => {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    // Extract raw body as Uint8Array (required for signature verification)
    const rawBody = new Uint8Array(await req.arrayBuffer());

    // Get Stripe signature from headers
    const stripeSignature = req.headers.get('stripe-signature');

    if (!stripeSignature) {
      console.error('❌ Missing stripe-signature header');
      return new Response(
        JSON.stringify({ error: 'Missing stripe-signature header' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Log webhook receipt
    console.log('📨 Received Stripe webhook');
    console.log('Signature:', stripeSignature.substring(0, 20) + '...');

    // Process webhook - this automatically:
    // 1. Verifies the webhook signature
    // 2. Parses the Stripe event
    // 3. Syncs the data to Postgres (stripe.* tables)
    await stripeSync.processWebhook(rawBody, stripeSignature);

    console.log('✅ Webhook processed and synced to Postgres');

    // Return success response
    return new Response(
      JSON.stringify({ received: true }),
      {
        status: 202,
        headers: { 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    // Log error details
    console.error('❌ Webhook processing error:', error);

    // Return error response
    return new Response(
      JSON.stringify({
        error: error.message || 'Unknown error',
        type: error.name || 'Error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});

/**
 * Test this function locally:
 *
 * 1. Start Supabase locally:
 *    supabase start
 *
 * 2. Serve this function:
 *    supabase functions serve stripe-webhook-sync
 *
 * 3. Forward Stripe webhooks:
 *    stripe listen --forward-to http://localhost:54321/functions/v1/stripe-webhook-sync
 *
 * 4. Trigger test events:
 *    stripe trigger checkout.session.completed
 *    stripe trigger customer.subscription.updated
 */
