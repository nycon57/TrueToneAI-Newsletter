/**
 * Manual Subscription Sync Script
 *
 * This script manually syncs a user's Stripe subscription to Supabase
 * when webhooks fail to deliver or process.
 *
 * Usage:
 *   npx tsx scripts/sync-stripe-subscription.ts <stripe_customer_id>
 *
 * Example:
 *   npx tsx scripts/sync-stripe-subscription.ts cus_TIBvJDILXyneEA
 */

import 'dotenv/config';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY not found in environment');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function syncSubscription(customerId: string) {
  console.log(`\n🔍 Fetching Stripe data for customer: ${customerId}\n`);

  try {
    // 1. Fetch customer from Stripe
    const customer = await stripe.customers.retrieve(customerId);
    if (customer.deleted) {
      throw new Error('Customer has been deleted in Stripe');
    }
    console.log('✅ Customer found:', customer.email);

    // 2. Fetch active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all',
      limit: 10,
    });

    if (subscriptions.data.length === 0) {
      console.log('⚠️  No subscriptions found for this customer');
      return;
    }

    console.log(`📊 Found ${subscriptions.data.length} subscription(s)\n`);

    // Find active or trialing subscription
    const activeSubscription = subscriptions.data.find(
      sub => sub.status === 'active' || sub.status === 'trialing'
    );

    if (!activeSubscription) {
      console.log('⚠️  No active or trialing subscriptions found');
      console.log('Available subscriptions:', subscriptions.data.map(s => ({
        id: s.id,
        status: s.status,
        created: new Date(s.created * 1000).toISOString(),
      })));
      return;
    }

    const subscription = activeSubscription;
    console.log('Subscription Details:');
    console.log('  ID:', subscription.id);
    console.log('  Status:', subscription.status);
    console.log('  Created:', new Date(subscription.created * 1000).toISOString());
    console.log('  Current Period:', {
      start: new Date(subscription.current_period_start * 1000).toISOString(),
      end: new Date(subscription.current_period_end * 1000).toISOString(),
    });
    if (subscription.trial_end) {
      console.log('  Trial Ends:', new Date(subscription.trial_end * 1000).toISOString());
    }

    // 3. Get price details
    const priceId = subscription.items.data[0].price.id;
    const price = subscription.items.data[0].price;
    console.log('\nPrice Details:');
    console.log('  Price ID:', priceId);
    console.log('  Amount:', price.unit_amount ? `$${price.unit_amount / 100}` : 'N/A');
    console.log('  Interval:', price.recurring?.interval || 'N/A');

    // 4. Determine tier and limits
    const tier = subscription.status === 'active' || subscription.status === 'trialing'
      ? 'paid'
      : 'free';

    const monthlyLimit = tier === 'paid' ? 25 : 3;

    // Calculate next reset date (first of next month)
    const now = new Date();
    const nextReset = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // 5. Find user in Supabase
    const customerEmail = typeof customer.email === 'string' ? customer.email : null;

    if (!customerEmail) {
      throw new Error('Customer email not found in Stripe');
    }

    const { data: users, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', customerEmail);

    if (fetchError) {
      throw new Error(`Error fetching user: ${fetchError.message}`);
    }

    if (!users || users.length === 0) {
      throw new Error(`No user found with email: ${customerEmail}`);
    }

    const user = users[0];
    console.log('\n👤 User found in Supabase:');
    console.log('  ID:', user.id);
    console.log('  Email:', user.email);
    console.log('  Current Tier:', user.subscription_tier);
    console.log('  Current Status:', user.subscription_status || 'none');

    // 6. Update user in Supabase
    console.log('\n🔄 Updating user subscription data...');

    const updateData = {
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      stripe_price_id: priceId,
      subscription_tier: tier,
      subscription_status: subscription.status,
      monthly_generation_limit: monthlyLimit,
      generation_reset_date: tier === 'paid' ? nextReset.toISOString().split('T')[0] : null,
      updatedAt: new Date().toISOString(),
    };

    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Error updating user: ${updateError.message}`);
    }

    console.log('✅ Successfully updated user!\n');
    console.log('Updated Data:');
    console.log('  Subscription Tier:', updatedUser.subscription_tier);
    console.log('  Subscription Status:', updatedUser.subscription_status);
    console.log('  Monthly Limit:', updatedUser.monthly_generation_limit);
    console.log('  Reset Date:', updatedUser.generation_reset_date);
    console.log('  Stripe Customer ID:', updatedUser.stripe_customer_id);
    console.log('  Stripe Subscription ID:', updatedUser.stripe_subscription_id);
    console.log('\n✨ Sync complete!\n');

  } catch (error) {
    console.error('\n❌ Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Main execution
const customerId = process.argv[2];

if (!customerId) {
  console.error('\n❌ Error: Please provide a Stripe customer ID');
  console.log('\nUsage:');
  console.log('  npx tsx scripts/sync-stripe-subscription.ts <stripe_customer_id>\n');
  console.log('Example:');
  console.log('  npx tsx scripts/sync-stripe-subscription.ts cus_TIBvJDILXyneEA\n');
  process.exit(1);
}

if (!customerId.startsWith('cus_')) {
  console.error('\n❌ Error: Invalid customer ID format. Must start with "cus_"\n');
  process.exit(1);
}

syncSubscription(customerId);
