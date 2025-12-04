import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';

interface KindeUser {
  id: string;
  email: string;
  given_name: string;
  family_name: string;
  picture?: string;
}

interface KindeWebhookEvent {
  type: string;
  data: {
    user?: KindeUser;
    subscription?: {
      id: string;
      status: string;
      plan_id: string;
      user_id: string;
    };
  };
}

function verifyKindeSignature(payload: string, signature: string, secret: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = headers();
    const signature = headersList.get('x-kinde-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    const webhookSecret = process.env.KINDE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    // Verify the webhook signature
    if (!verifyKindeSignature(body, signature, webhookSecret)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event: KindeWebhookEvent = JSON.parse(body);

    switch (event.type) {
      case 'user.created':
        await handleUserCreated(event.data.user!);
        break;

      case 'user.updated':
        await handleUserUpdated(event.data.user!);
        break;

      case 'subscription.created':
        await handleSubscriptionCreated(event.data.subscription!);
        break;

      case 'subscription.updated':
        await handleSubscriptionUpdated(event.data.subscription!);
        break;

      case 'subscription.cancelled':
        await handleSubscriptionCancelled(event.data.subscription!);
        break;

      default:
        console.log(`Unhandled webhook event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handleUserCreated(user: KindeUser) {
  try {
    const supabase = await createClient();

    // Create user in your database
    const { error } = await supabase.from('users').insert({
      kinde_id: user.id,
      email: user.email,
      name: `${user.given_name} ${user.family_name}`.trim(),
      firstName: user.given_name || 'Not Set',
      lastName: user.family_name || 'Not Set',
      updatedAt: new Date().toISOString(),
    });

    if (error) {
      throw error;
    }

    console.log(`User created: ${user.email}`);

    // You can add onboarding logic here:
    // - Send welcome email
    // - Create default settings
    // - Trigger onboarding flow

  } catch (error) {
    console.error('Error creating user:', error);
  }
}

async function handleUserUpdated(user: KindeUser) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('users')
      .update({
        email: user.email,
        name: `${user.given_name} ${user.family_name}`.trim(),
        firstName: user.given_name || 'Not Set',
        lastName: user.family_name || 'Not Set',
        updatedAt: new Date().toISOString(),
      })
      .eq('kinde_id', user.id);

    if (error) {
      throw error;
    }

    console.log(`User updated: ${user.email}`);
  } catch (error) {
    console.error('Error updating user:', error);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleSubscriptionCreated(subscription: any) {
  try {
    const supabase = await createClient();

    // Update user with subscription info
    const { error } = await supabase
      .from('users')
      .update({
        // Add subscription fields to your User model
        // subscriptionId: subscription.id,
        // subscriptionStatus: subscription.status,
        // planId: subscription.plan_id,
        updatedAt: new Date().toISOString(),
      })
      .eq('kinde_id', subscription.user_id);

    if (error) {
      throw error;
    }

    console.log(`Subscription created for user: ${subscription.user_id}`);

    // You can add billing logic here:
    // - Upgrade user permissions
    // - Send confirmation email
    // - Enable premium features

  } catch (error) {
    console.error('Error handling subscription creation:', error);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleSubscriptionUpdated(subscription: any) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('users')
      .update({
        // Update subscription fields
        // subscriptionStatus: subscription.status,
        // planId: subscription.plan_id,
        updatedAt: new Date().toISOString(),
      })
      .eq('kinde_id', subscription.user_id);

    if (error) {
      throw error;
    }

    console.log(`Subscription updated for user: ${subscription.user_id}`);
  } catch (error) {
    console.error('Error handling subscription update:', error);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleSubscriptionCancelled(subscription: any) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('users')
      .update({
        // Handle cancellation
        // subscriptionStatus: 'cancelled',
        updatedAt: new Date().toISOString(),
      })
      .eq('kinde_id', subscription.user_id);

    if (error) {
      throw error;
    }

    console.log(`Subscription cancelled for user: ${subscription.user_id}`);

    // You can add cancellation logic here:
    // - Downgrade user permissions
    // - Send cancellation email
    // - Schedule account deactivation

  } catch (error) {
    console.error('Error handling subscription cancellation:', error);
  }
}