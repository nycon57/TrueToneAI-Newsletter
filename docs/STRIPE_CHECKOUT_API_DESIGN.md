# Stripe Checkout API Design & Analysis

## Executive Summary

The current Stripe implementation has a **broken payment flow** where users can complete onboarding without actually paying. The subscription step redirects to a Kinde auth endpoint instead of Stripe Checkout, bypassing the payment process entirely.

### Critical Issues Found:
1. **No actual Stripe Checkout flow** - Users are redirected to Kinde auth, not Stripe
2. **No payment verification** - Success page doesn't verify payment completion
3. **Missing session verification endpoint** - No way to validate Stripe session on success
4. **Disconnected checkout endpoint** - The `/api/stripe/checkout` endpoint exists but is never called
5. **Plan ID mismatch** - UI references plans like `newsletter_pro` but checkout uses `STRIPE_PRICE_ID_PAID_TIER`

---

## Current State Analysis

### File: `/src/components/onboarding/steps/subscription-step.tsx`

**What's Broken:**

```typescript
// Lines 33-34: This is the PROBLEM - redirects to Kinde auth, NOT Stripe
const billingUrl = `${baseUrl}/api/auth/login?${billingParams.toString()}&post_login_redirect_url=${encodeURIComponent(`${baseUrl}/onboarding/success`)}`;
window.location.href = billingUrl;
```

**What it should do:** Call `/api/stripe/checkout` to create a Stripe Checkout session, then redirect to Stripe's hosted checkout page.

**Current Flow (BROKEN):**
1. User clicks "Choose Pro Plan"
2. `handleSelectPlan('newsletter_pro')` is called
3. Sets `selectedPlan` and `billingType` in state
4. Redirects to Kinde auth login endpoint
5. After Kinde auth, redirects to `/onboarding/success`
6. **NO PAYMENT HAPPENS**

---

### File: `/src/app/api/stripe/checkout/route.ts`

**What Works:**
- ✅ Proper authentication with `getApiUser()`
- ✅ Stripe customer creation/retrieval logic
- ✅ Checkout session creation with metadata
- ✅ Returns `sessionId` and `url` for redirect
- ✅ Uses environment variable `STRIPE_PRICE_ID_PAID_TIER`

**What's Missing:**
- ❌ **This endpoint is NEVER CALLED** by the frontend
- ❌ No support for multiple price IDs (Pro vs Enterprise)
- ❌ Hardcoded to `STRIPE_PRICE_ID_PAID_TIER` (only one plan)

**Current Implementation:**
```typescript
price: process.env.STRIPE_PRICE_ID_PAID_TIER, // Single price ID
```

---

### File: `/src/app/api/stripe/webhook/route.ts`

**What Works:**
- ✅ Webhook signature verification
- ✅ Handles `checkout.session.completed` event
- ✅ Updates user subscription status in database
- ✅ Handles subscription lifecycle events
- ✅ Proper error handling and logging

**What's Missing:**
- ❌ No distinction between different subscription tiers (Pro vs Enterprise)
- ❌ Monthly limits are hardcoded to 25 for all paid plans
- ❌ Price ID mapping only supports `STRIPE_PRICE_ID_PAID_TIER`

---

### File: `/src/app/onboarding/success/page.tsx`

**What's Broken:**
- ❌ **No session verification** - just shows success message
- ❌ Doesn't check if payment actually completed
- ❌ Doesn't verify `session_id` parameter
- ❌ Simulated 1.5s loading delay for no reason
- ❌ Anyone can navigate to this page and see success

**Current Implementation:**
```typescript
// Lines 14-20: Fake loading, no actual verification
const timer = setTimeout(() => {
  setLoading(false);
}, 1500);
```

---

### File: `/src/app/api/user/onboarding/route.ts`

**What Works:**
- ✅ Saves onboarding data to database
- ✅ Updates user profile with preferences
- ✅ Marks onboarding as complete

**What's Missing:**
- ❌ No verification that user has paid subscription
- ❌ No check for Stripe subscription status
- ❌ Billing data is saved but never validated

---

## Current Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     CURRENT FLOW (BROKEN)                        │
└─────────────────────────────────────────────────────────────────┘

User on Subscription Step
        │
        ▼
Click "Choose Pro Plan"
        │
        ▼
handleSelectPlan('newsletter_pro')
        │
        ├─ updateData('selectedPlan', 'newsletter_pro')
        ├─ updateData('billingType', 'paid_plan')
        │
        ▼
Redirect to: /api/auth/login?plan=newsletter_pro
        │
        ▼
Kinde Authentication (NO PAYMENT)
        │
        ▼
Redirect to: /onboarding/success
        │
        ▼
Success page shows (NO VERIFICATION)
        │
        ▼
User clicks "Go to Dashboard"
        │
        ▼
Dashboard loads (USER NEVER PAID!)

┌─────────────────────────────────────────────────────────────────┐
│                  UNUSED ENDPOINTS                                │
└─────────────────────────────────────────────────────────────────┘

/api/stripe/checkout (POST) ───► NEVER CALLED
                                  (Properly implemented but unused)

/api/stripe/webhook (POST) ────► CONFIGURED
                                  (Works but never receives events
                                   because no checkouts happen)
```

---

## Proposed Architecture

### New API Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     PROPOSED FLOW (FIXED)                        │
└─────────────────────────────────────────────────────────────────┘

User on Subscription Step
        │
        ▼
Click "Choose Pro Plan"
        │
        ▼
handleSelectPlan('newsletter_pro')
        │
        ├─ Map plan to Stripe Price ID
        │  • newsletter_pro → price_1SAcEpCezhgJ3dc1rGAyaylW ($19.95/mo)
        │  • newsletter_enterprise → price_1RXRURCezhgJ3dc1AQVWSZsu ($199/mo)
        │
        ▼
POST /api/stripe/checkout
        │
        ├─ Body: { priceId, returnUrl }
        │
        ▼
Create Stripe Checkout Session
        │
        ├─ Associate with user
        ├─ Set success_url with {CHECKOUT_SESSION_ID}
        ├─ Set cancel_url back to onboarding
        │
        ▼
Return { sessionId, url }
        │
        ▼
Redirect to Stripe Checkout (session.url)
        │
        ▼
User enters payment details on Stripe
        │
        ├─ Success ──────────┬─► Stripe webhook → /api/stripe/webhook
        │                     │   ├─ Event: checkout.session.completed
        │                     │   ├─ Update user subscription in DB
        │                     │   └─ Set tier, status, limits
        │                     │
        │                     └─► Redirect to success_url
        │                         (/onboarding/success?session_id=xxx)
        │                              │
        │                              ▼
        │                         GET /api/stripe/verify-session?session_id=xxx
        │                              │
        │                              ├─ Retrieve session from Stripe
        │                              ├─ Verify payment_status = 'paid'
        │                              ├─ Verify customer matches user
        │                              └─ Return session details
        │                              │
        │                              ▼
        │                         Show success page with verification
        │                              │
        │                              ▼
        │                         Complete onboarding
        │                              │
        │                              ▼
        │                         POST /api/user/onboarding
        │                              │
        │                              ▼
        │                         Redirect to dashboard
        │
        └─ Cancel ───────────► Redirect to cancel_url
                                (/onboarding?step=4)
```

---

## Proposed Endpoints

### 1. **POST /api/stripe/checkout** (UPDATE EXISTING)

**Purpose:** Create Stripe Checkout session for subscription purchase

**Request Schema:**
```typescript
{
  priceId: string;          // Stripe Price ID
  returnUrl?: string;       // Optional custom return URL
}
```

**Response Schema:**
```typescript
{
  sessionId: string;        // Stripe session ID
  url: string;              // Stripe Checkout URL to redirect to
}
```

**Example Request:**
```bash
POST /api/stripe/checkout
Content-Type: application/json

{
  "priceId": "price_1SAcEpCezhgJ3dc1rGAyaylW",
  "returnUrl": "/onboarding/success"
}
```

**Example Response:**
```json
{
  "sessionId": "cs_test_a1b2c3d4e5f6g7h8i9j0",
  "url": "https://checkout.stripe.com/c/pay/cs_test_a1b2c3d4e5f6g7h8i9j0"
}
```

**Error Responses:**
- `401 Unauthorized` - User not authenticated
- `400 Bad Request` - Missing or invalid priceId
- `500 Internal Server Error` - Stripe API error

**Implementation Changes Needed:**
```typescript
// Accept priceId in request body instead of env var
const { priceId, returnUrl } = await req.json();

// Validate priceId against allowed price IDs
const ALLOWED_PRICE_IDS = [
  process.env.STRIPE_PRICE_ID_PRO,      // Newsletter Pro
  process.env.STRIPE_PRICE_ID_ENTERPRISE, // Enterprise
];

if (!ALLOWED_PRICE_IDS.includes(priceId)) {
  return NextResponse.json(
    { error: 'Invalid price ID' },
    { status: 400 }
  );
}

// Use priceId from request
line_items: [
  {
    price: priceId,
    quantity: 1,
  },
],
```

---

### 2. **GET /api/stripe/verify-session** (NEW ENDPOINT)

**Purpose:** Verify a Stripe Checkout session and confirm payment

**Query Parameters:**
```typescript
session_id: string;       // Stripe Checkout Session ID
```

**Response Schema:**
```typescript
{
  verified: boolean;
  session: {
    id: string;
    status: string;           // 'complete' | 'open' | 'expired'
    payment_status: string;   // 'paid' | 'unpaid' | 'no_payment_required'
    customer: string;         // Stripe customer ID
    subscription: string;     // Stripe subscription ID
    amount_total: number;     // Amount in cents
    currency: string;         // 'usd'
    customer_email: string;
  };
  userSubscription: {
    tier: string;             // 'FREE' | 'PAID'
    status: string;           // 'active' | 'trialing' | etc.
    priceId: string;
    monthlyLimit: number;
  };
}
```

**Example Request:**
```bash
GET /api/stripe/verify-session?session_id=cs_test_a1b2c3d4e5f6g7h8i9j0
```

**Example Response:**
```json
{
  "verified": true,
  "session": {
    "id": "cs_test_a1b2c3d4e5f6g7h8i9j0",
    "status": "complete",
    "payment_status": "paid",
    "customer": "cus_abc123",
    "subscription": "sub_xyz789",
    "amount_total": 1995,
    "currency": "usd",
    "customer_email": "user@example.com"
  },
  "userSubscription": {
    "tier": "PAID",
    "status": "active",
    "priceId": "price_1SAcEpCezhgJ3dc1rGAyaylW",
    "monthlyLimit": 25
  }
}
```

**Error Responses:**
- `401 Unauthorized` - User not authenticated
- `400 Bad Request` - Missing session_id parameter
- `404 Not Found` - Session not found or doesn't belong to user
- `402 Payment Required` - Session exists but payment not completed
- `500 Internal Server Error` - Stripe API error

**Verification Logic:**
```typescript
// 1. Retrieve session from Stripe
const session = await stripe.checkout.sessions.retrieve(sessionId);

// 2. Verify session belongs to authenticated user
const user = await getApiUser();
if (session.customer !== user.stripe_customer_id) {
  return NextResponse.json(
    { error: 'Session does not belong to user' },
    { status: 404 }
  );
}

// 3. Verify payment completed
if (session.payment_status !== 'paid') {
  return NextResponse.json(
    {
      verified: false,
      error: 'Payment not completed',
      payment_status: session.payment_status
    },
    { status: 402 }
  );
}

// 4. Get subscription details from database
const { data: dbUser } = await supabase
  .from('users')
  .select('subscription_tier, subscription_status, monthly_generation_limit')
  .eq('id', user.id)
  .single();

// 5. Return verified session details
return NextResponse.json({
  verified: true,
  session: {
    id: session.id,
    status: session.status,
    payment_status: session.payment_status,
    customer: session.customer,
    subscription: session.subscription,
    amount_total: session.amount_total,
    currency: session.currency,
    customer_email: session.customer_email,
  },
  userSubscription: {
    tier: dbUser.subscription_tier,
    status: dbUser.subscription_status,
    priceId: session.subscription ?
      (await stripe.subscriptions.retrieve(session.subscription)).items.data[0].price.id :
      null,
    monthlyLimit: dbUser.monthly_generation_limit,
  }
});
```

---

### 3. **POST /api/stripe/webhook** (UPDATE EXISTING)

**Purpose:** Handle Stripe webhook events for subscription lifecycle

**Changes Needed:**

1. **Support multiple price IDs:**
```typescript
// Update price limits mapping
function getMonthlyLimitFromPrice(priceId: string): number {
  const priceLimits: Record<string, number> = {
    [process.env.STRIPE_PRICE_ID_PRO || '']: 25,          // Newsletter Pro
    [process.env.STRIPE_PRICE_ID_ENTERPRISE || '']: 100,   // Enterprise
  };
  return priceLimits[priceId] || 25;
}
```

2. **Store price ID in database:**
```typescript
case 'checkout.session.completed': {
  const subscription = await stripe.subscriptions.retrieve(session.subscription);
  const priceId = subscription.items.data[0].price.id;
  const monthlyLimit = getMonthlyLimitFromPrice(priceId);

  await supabase
    .from('users')
    .update({
      stripe_customer_id: session.customer,
      stripe_subscription_id: session.subscription,
      stripe_price_id: priceId,              // NEW: Store price ID
      subscription_tier: 'PAID',
      subscription_status: subscription.status,
      monthly_generation_limit: monthlyLimit,
      monthly_generations_used: 0,
      subscription_created_at: new Date().toISOString(),
    })
    .eq('id', userId);
}
```

---

### 4. **POST /api/user/onboarding** (UPDATE EXISTING)

**Purpose:** Complete onboarding and save user preferences

**Changes Needed:**

1. **Verify subscription before completion (for paid plans):**
```typescript
export async function POST(request: NextRequest) {
  try {
    const { profileData, categoryPreferences, billingData } = await request.json();

    const supabase = await createClient();

    // Get current user from database
    const { data: user } = await supabase
      .from('users')
      .select('subscription_tier, subscription_status, stripe_subscription_id')
      .eq('kinde_id', kindeUser.id)
      .single();

    // If billing data indicates paid plan, verify subscription
    if (billingData?.billingType === 'paid_plan' || billingData?.billingType === 'enterprise') {
      if (!user?.stripe_subscription_id) {
        return NextResponse.json(
          { error: 'Subscription not found. Please complete payment first.' },
          { status: 400 }
        );
      }

      if (user.subscription_status !== 'active' && user.subscription_status !== 'trialing') {
        return NextResponse.json(
          { error: 'Subscription is not active. Please contact support.' },
          { status: 400 }
        );
      }
    }

    // Proceed with onboarding completion...
  }
}
```

---

## Complete Payment Flow Documentation

### User Journey: Selecting a Paid Plan

```
Step 1: User on Subscription Step (/onboarding?step=4)
├─ Displays plan options: Free Trial, Newsletter Pro, Enterprise
└─ User clicks "Choose Pro Plan"

Step 2: Frontend - handleSelectPlan()
├─ Map plan name to Stripe Price ID
│  • newsletter_pro → price_1SAcEpCezhgJ3dc1rGAyaylW
│  • newsletter_enterprise → price_1RXRURCezhgJ3dc1AQVWSZsu
│
├─ Call POST /api/stripe/checkout
│  {
│    priceId: "price_1SAcEpCezhgJ3dc1rGAyaylW",
│    returnUrl: "/onboarding/success"
│  }
│
└─ Receive response
   {
     sessionId: "cs_test_...",
     url: "https://checkout.stripe.com/..."
   }

Step 3: Redirect to Stripe Checkout
├─ window.location.href = session.url
├─ User sees Stripe-hosted checkout page
├─ User enters payment details
└─ User clicks "Subscribe"

Step 4A: Payment Success - Stripe Webhook (Async)
├─ Stripe sends webhook to /api/stripe/webhook
├─ Event: checkout.session.completed
├─ Verify webhook signature
├─ Extract userId from session.metadata
├─ Retrieve subscription details
├─ Update database:
│  {
│    stripe_customer_id: "cus_...",
│    stripe_subscription_id: "sub_...",
│    stripe_price_id: "price_...",
│    subscription_tier: "PAID",
│    subscription_status: "active",
│    monthly_generation_limit: 25,
│    monthly_generations_used: 0,
│    subscription_created_at: timestamp
│  }
└─ Return 200 OK to Stripe

Step 4B: Payment Success - User Redirect (Sync)
├─ Stripe redirects to: /onboarding/success?session_id=cs_test_...
├─ Success page loads
├─ useEffect hook detects session_id parameter
├─ Call GET /api/stripe/verify-session?session_id=cs_test_...
├─ Backend:
│  ├─ Retrieve session from Stripe
│  ├─ Verify payment_status === 'paid'
│  ├─ Verify customer matches authenticated user
│  ├─ Get subscription details from database
│  └─ Return verification result
│
├─ If verified === true:
│  ├─ Show success message
│  ├─ Display subscription details
│  └─ Enable "Complete Onboarding" button
│
├─ If verified === false:
│  ├─ Show error message
│  ├─ Display retry options
│  └─ Provide support link
│
└─ User clicks "Complete Onboarding"

Step 5: Complete Onboarding
├─ Call POST /api/user/onboarding
│  {
│    profileData: {...},
│    categoryPreferences: [...],
│    billingData: {
│      selectedPlan: "newsletter_pro",
│      billingType: "paid_plan"
│    }
│  }
│
├─ Backend verifies subscription exists and is active
├─ Save onboarding preferences
├─ Mark has_completed_onboarding = true
├─ Return success
│
└─ Redirect to /dashboard

Step 6: User sees Dashboard
├─ Subscription tier: PAID
├─ Monthly generations: 0/25 used
└─ Access to pro features enabled
```

---

### User Journey: Selecting Free Trial

```
Step 1: User on Subscription Step
└─ User clicks "Start Free Trial"

Step 2: Frontend - handleCompleteFreeTrial()
├─ updateData('selectedPlan', 'free_trial')
├─ updateData('billingType', 'free_trial')
├─ Call completeOnboarding()
│
└─ POST /api/user/onboarding
   {
     profileData: {...},
     categoryPreferences: [...],
     billingData: {
       selectedPlan: "free_trial",
       billingType: "free_trial"
     }
   }

Step 3: Backend - No Stripe verification needed
├─ Save onboarding data
├─ Keep subscription_tier: "FREE" (default)
├─ Set monthly_generation_limit: 3 (free tier)
└─ Mark onboarding complete

Step 4: Redirect to /onboarding/success
├─ No session_id parameter
├─ Show free trial success message
└─ User clicks "Go to Dashboard"

Step 5: User sees Dashboard
├─ Subscription tier: FREE
├─ Monthly generations: 0/3 used
└─ Upgrade prompts visible
```

---

### Webhook Event Handling

**Event: `checkout.session.completed`**
```typescript
Triggered when: User completes Stripe Checkout
Action: Create subscription, update user to PAID tier
Database updates:
  - stripe_customer_id
  - stripe_subscription_id
  - stripe_price_id
  - subscription_tier = 'PAID'
  - subscription_status = 'active' | 'trialing'
  - monthly_generation_limit = 25 or 100
  - monthly_generations_used = 0
  - subscription_created_at = now()
```

**Event: `customer.subscription.updated`**
```typescript
Triggered when: Subscription status changes
Action: Update subscription status and limits
Database updates:
  - subscription_status (active, past_due, canceled, etc.)
  - subscription_tier (active/trialing → PAID, else → FREE)
  - monthly_generation_limit (based on status)
```

**Event: `customer.subscription.deleted`**
```typescript
Triggered when: Subscription is canceled
Action: Downgrade user to free tier
Database updates:
  - subscription_tier = 'FREE'
  - subscription_status = 'canceled'
  - monthly_generation_limit = 3
  - stripe_subscription_id = null
```

**Event: `invoice.payment_succeeded`**
```typescript
Triggered when: Recurring payment succeeds
Action: Ensure subscription remains active
Database updates:
  - subscription_status = 'active'
  - subscription_tier = 'PAID'
```

**Event: `invoice.payment_failed`**
```typescript
Triggered when: Recurring payment fails
Action: Mark subscription as past due
Database updates:
  - subscription_status = 'past_due'
```

---

## Environment Variables Required

```bash
# Existing
STRIPE_SECRET_KEY=sk_test_...                    # Stripe secret key
STRIPE_WEBHOOK_SECRET=whsec_...                  # Webhook signing secret
NEXT_PUBLIC_URL=https://yourdomain.com           # Base URL

# New/Updated
STRIPE_PRICE_ID_PRO=price_1SAcEpCezhgJ3dc1rGAyaylW          # Newsletter Pro ($19.95/mo)
STRIPE_PRICE_ID_ENTERPRISE_MONTHLY=price_1RXRURCezhgJ3dc1AQVWSZsu  # Enterprise ($199/mo)
STRIPE_PRICE_ID_ENTERPRISE_YEARLY=price_1RXRURCezhgJ3dc1hLtHu8Vd   # Enterprise ($1,990/yr)

# Remove (deprecated)
# STRIPE_PRICE_ID_PAID_TIER - replaced with specific tier IDs
```

---

## Database Schema Updates

```sql
-- Add new column to users table
ALTER TABLE users
ADD COLUMN stripe_price_id VARCHAR(255);

-- Add index for faster lookups
CREATE INDEX idx_users_stripe_subscription_id
ON users(stripe_subscription_id);

CREATE INDEX idx_users_subscription_status
ON users(subscription_status);
```

---

## Frontend Changes Required

### Update: `/src/components/onboarding/steps/subscription-step.tsx`

```typescript
// Price ID mapping
const PLAN_PRICE_IDS = {
  newsletter_pro: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO || '',
  newsletter_enterprise: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE_MONTHLY || '',
} as const;

const handleSelectPlan = async (planId: keyof typeof PLAN_PRICE_IDS) => {
  try {
    setIsSubmitting(true);

    // Get price ID for selected plan
    const priceId = PLAN_PRICE_IDS[planId];

    if (!priceId) {
      throw new Error('Invalid plan selected');
    }

    // Create checkout session
    const response = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        priceId,
        returnUrl: '/onboarding/success',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const { url } = await response.json();

    // Save plan selection to context
    updateData('selectedPlan', planId);
    updateData('billingType', planId === 'newsletter_enterprise' ? 'enterprise' : 'paid_plan');

    // Redirect to Stripe Checkout
    window.location.href = url;

  } catch (error) {
    console.error('Error creating checkout session:', error);
    setError('general', 'Failed to start checkout. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};
```

---

### Update: `/src/app/onboarding/success/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface VerificationResult {
  verified: boolean;
  session?: {
    id: string;
    payment_status: string;
    amount_total: number;
    currency: string;
  };
  userSubscription?: {
    tier: string;
    status: string;
    monthlyLimit: number;
  };
  error?: string;
}

export default function OnboardingSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [verification, setVerification] = useState<VerificationResult | null>(null);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    async function verifySession() {
      if (!sessionId) {
        // Free trial flow - no session to verify
        setLoading(false);
        setVerification({ verified: true });
        return;
      }

      try {
        const response = await fetch(
          `/api/stripe/verify-session?session_id=${sessionId}`
        );

        const data = await response.json();

        if (response.ok && data.verified) {
          setVerification(data);
        } else {
          setVerification({
            verified: false,
            error: data.error || 'Payment verification failed',
          });
        }
      } catch (error) {
        console.error('Error verifying session:', error);
        setVerification({
          verified: false,
          error: 'Unable to verify payment. Please contact support.',
        });
      } finally {
        setLoading(false);
      }
    }

    verifySession();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <CardContent className="space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-orchid" />
            <h2 className="text-xl font-heading font-semibold text-center">
              {sessionId ? 'Verifying Your Payment...' : 'Completing Your Setup...'}
            </h2>
            <p className="text-muted-foreground text-center text-sm">
              This will only take a moment.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!verification?.verified) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <CardHeader>
            <XCircleIcon className="h-16 w-16 text-destructive mx-auto mb-4" />
            <CardTitle className="text-2xl font-heading text-center">
              Payment Verification Failed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-center">
              {verification?.error || 'We couldn\'t verify your payment.'}
            </p>
            <div className="flex flex-col gap-2">
              <Button onClick={() => router.push('/onboarding?step=4')}>
                Try Again
              </Button>
              <Button variant="outline" onClick={() => router.push('/support')}>
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="p-8 max-w-2xl">
        <CardHeader>
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-2xl font-heading text-center">
            {sessionId ? 'Payment Successful! 🎉' : 'Welcome to TrueTone Newsletter! 🎉'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {sessionId && verification.session && (
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Subscription Confirmed</h3>
              <div className="text-sm space-y-1">
                <p>Plan: {verification.userSubscription?.tier}</p>
                <p>Status: {verification.userSubscription?.status}</p>
                <p>Monthly Limit: {verification.userSubscription?.monthlyLimit} generations</p>
              </div>
            </div>
          )}

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
            <h3 className="font-heading font-semibold mb-4">What's Next:</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <span>Access your personalized newsletter content</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <span>Get AI-powered content recommendations</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <span>Copy content easily for your communications</span>
              </div>
            </div>
          </div>

          <Button
            onClick={() => router.push('/dashboard')}
            className="w-full"
            size="lg"
          >
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## Implementation Plan

### Phase 1: Backend API Setup (Priority: HIGH)

**Tasks:**
1. ✅ Create `/api/stripe/verify-session/route.ts` endpoint
2. ✅ Update `/api/stripe/checkout/route.ts` to accept `priceId` parameter
3. ✅ Update `/api/stripe/webhook/route.ts` price mapping for multiple tiers
4. ✅ Update `/api/user/onboarding/route.ts` to verify subscription
5. ✅ Add database migration for `stripe_price_id` column

**Acceptance Criteria:**
- [ ] Verify session endpoint returns correct data for valid sessions
- [ ] Verify session endpoint returns 404 for invalid sessions
- [ ] Verify session endpoint returns 402 for unpaid sessions
- [ ] Checkout endpoint accepts and validates price IDs
- [ ] Webhook updates database with correct tier limits
- [ ] Onboarding endpoint blocks completion without valid subscription

---

### Phase 2: Frontend Integration (Priority: HIGH)

**Tasks:**
1. ✅ Update `subscription-step.tsx` to call `/api/stripe/checkout`
2. ✅ Update success page to verify session
3. ✅ Add error handling for failed payments
4. ✅ Add loading states during verification
5. ✅ Update environment variables

**Acceptance Criteria:**
- [ ] Clicking "Choose Pro Plan" redirects to Stripe Checkout
- [ ] Success page shows loading state during verification
- [ ] Success page shows error if payment failed
- [ ] Success page shows subscription details when verified
- [ ] Free trial flow still works without Stripe

---

### Phase 3: Testing (Priority: HIGH)

**Test Cases:**

1. **Happy Path - Pro Plan:**
   - [ ] User selects Newsletter Pro plan
   - [ ] Redirects to Stripe Checkout
   - [ ] Completes payment with test card
   - [ ] Webhook updates database
   - [ ] Success page verifies session
   - [ ] Onboarding completes
   - [ ] Dashboard shows PAID tier with 25 limit

2. **Happy Path - Enterprise Plan:**
   - [ ] User selects Enterprise plan
   - [ ] Redirects to Stripe Checkout
   - [ ] Completes payment
   - [ ] Database updated with 100 limit
   - [ ] Success page shows verification

3. **Happy Path - Free Trial:**
   - [ ] User selects Free Trial
   - [ ] Onboarding completes immediately
   - [ ] No Stripe interaction
   - [ ] Dashboard shows FREE tier with 3 limit

4. **Error Path - Payment Declined:**
   - [ ] User enters declined test card
   - [ ] Stripe shows error
   - [ ] User can retry
   - [ ] Cancel returns to onboarding

5. **Error Path - Session Manipulation:**
   - [ ] User tries to access success page with invalid session_id
   - [ ] Shows error message
   - [ ] Provides retry option
   - [ ] User cannot complete onboarding

6. **Edge Case - Webhook Delay:**
   - [ ] User completes payment
   - [ ] Webhook hasn't processed yet
   - [ ] Verify session still works (queries Stripe directly)
   - [ ] Shows success even if DB not updated yet

---

### Phase 4: Monitoring & Observability (Priority: MEDIUM)

**Tasks:**
1. ✅ Add logging for all checkout sessions created
2. ✅ Add logging for all session verifications
3. ✅ Add error tracking for failed checkouts
4. ✅ Add webhook event logging
5. ✅ Create dashboard for subscription metrics

**Metrics to Track:**
- Checkout sessions created
- Successful payments
- Failed payments
- Abandoned checkouts
- Verification failures
- Webhook processing time

---

## Security Considerations

### 1. **Webhook Signature Verification**
- ✅ Already implemented in webhook endpoint
- Prevents spoofed webhook events
- Uses `STRIPE_WEBHOOK_SECRET`

### 2. **Session Verification**
- ✅ Proposed in new endpoint
- Validates session belongs to authenticated user
- Prevents session ID reuse by different users

### 3. **Price ID Validation**
- ✅ Proposed in updated checkout endpoint
- Whitelist allowed price IDs
- Prevents arbitrary price manipulation

### 4. **User Authentication**
- ✅ Already implemented via `getApiUser()`
- All endpoints require authentication
- Metadata links sessions to users

### 5. **Idempotency**
- Webhook events may be sent multiple times
- Database updates should be idempotent
- Use `stripe_subscription_id` as unique constraint

---

## Migration Strategy

### Step 1: Deploy Backend Changes
1. Add database migration
2. Deploy new API endpoints
3. Update webhook handler
4. Test with Stripe CLI

### Step 2: Update Environment Variables
1. Add new Stripe price ID variables
2. Verify webhook secret is configured
3. Update success/cancel URLs

### Step 3: Deploy Frontend Changes
1. Update subscription step component
2. Update success page
3. Test in staging environment

### Step 4: Enable in Production
1. Deploy to production
2. Monitor webhook events
3. Monitor checkout sessions
4. Watch for errors in logs

### Step 5: Cleanup
1. Remove old unused code
2. Update documentation
3. Archive old price IDs

---

## Testing with Stripe CLI

```bash
# 1. Install Stripe CLI
brew install stripe/stripe-cli/stripe

# 2. Login to Stripe
stripe login

# 3. Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/stripe/webhook

# 4. Trigger test events
stripe trigger checkout.session.completed

# 5. Create test checkout session
curl -X POST http://localhost:3000/api/stripe/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "priceId": "price_1SAcEpCezhgJ3dc1rGAyaylW",
    "returnUrl": "/onboarding/success"
  }'

# 6. Test payment with test cards
# Success: 4242 4242 4242 4242
# Decline: 4000 0000 0000 0002
# Insufficient funds: 4000 0000 0000 9995
```

---

## Support & Troubleshooting

### Common Issues

**Issue: "Session not found"**
- Check that `session_id` parameter is in URL
- Verify session wasn't expired (sessions expire after 24 hours)
- Check that user is authenticated
- Verify session belongs to authenticated user

**Issue: "Payment verification failed"**
- Check webhook is configured correctly
- Verify webhook secret matches
- Check Stripe dashboard for webhook delivery status
- Manually verify payment in Stripe dashboard

**Issue: "Subscription not active after payment"**
- Wait a few seconds for webhook to process
- Check webhook logs for errors
- Verify database was updated
- Contact user to retry if still failing

**Issue: "User can access paid features without paying"**
- This is the current bug! Fix by implementing this design.
- Verify all endpoints check subscription status
- Add middleware to protect paid routes

---

## Additional Resources

- [Stripe Checkout Documentation](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

---

## Conclusion

The current implementation has a **critical security flaw** where users can complete onboarding and access the platform without paying. The proposed solution:

1. **Connects the existing Stripe checkout endpoint** to the frontend
2. **Adds session verification** to confirm payment before completion
3. **Implements proper error handling** for failed payments
4. **Supports multiple subscription tiers** (Pro and Enterprise)
5. **Maintains the free trial flow** without Stripe integration

**Estimated Implementation Time:** 1-2 days
**Risk Level:** Medium (requires careful testing)
**Impact:** High (fixes critical payment bypass)

**Next Steps:**
1. Review and approve this design
2. Implement Phase 1 (Backend APIs)
3. Implement Phase 2 (Frontend Integration)
4. Test with Stripe test mode
5. Deploy to production with monitoring
