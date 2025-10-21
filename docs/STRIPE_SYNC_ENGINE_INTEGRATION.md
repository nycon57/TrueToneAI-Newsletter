# Stripe Sync Engine Integration Guide

## Executive Summary

**Recommendation**: Integrate `@supabase/stripe-sync-engine` to replace manual webhook parsing and enable real-time Stripe data sync to Postgres.

**Benefits**:
- ✅ Automatic webhook processing (all events, not just 5)
- ✅ Normalized Stripe data in Postgres (customers, subscriptions, invoices)
- ✅ Lower latency (local queries vs API calls)
- ✅ Built-in resilience and retry logic
- ✅ Simplified codebase (~200 lines removed)
- ✅ Better analytics and reporting capabilities

**Effort**: 3-4 hours to implement

---

## Architecture Comparison

### Current Architecture (Manual Webhooks)

```
Stripe Webhook → /api/stripe/webhook → Manual parsing → Update public.users
                                     → 5 event handlers
                                     → Custom logic for each event
                                     → Error handling per event
```

### Proposed Architecture (Stripe Sync Engine)

```
Stripe Webhook → Edge Function (Sync Engine) → Automatic parsing → stripe.* tables
                                                                  → Postgres trigger
                                                                  → Update public.users
```

**Key Difference**: Sync Engine handles ALL Stripe data automatically, we just add business logic via database triggers.

---

## Implementation Plan

### Phase 1: Install and Configure Sync Engine (1 hour)

#### Step 1.1: Install Package

```bash
npm install @supabase/stripe-sync-engine
```

#### Step 1.2: Run Schema Migrations

Create migration script:

```typescript
// scripts/setup-stripe-sync.ts
import { runMigrations } from '@supabase/stripe-sync-engine';

(async () => {
  await runMigrations({
    databaseUrl: process.env.DATABASE_URL || '',
    schema: 'stripe',
    logger: console,
  });

  console.log('✅ Stripe sync schema created');
})();
```

Run migration:

```bash
npx tsx scripts/setup-stripe-sync.ts
```

This creates tables:
- `stripe.customers`
- `stripe.subscriptions`
- `stripe.invoices`
- `stripe.payment_intents`
- `stripe.charges`
- And more...

#### Step 1.3: Add Environment Variables

```bash
# .env.local
DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:6543/postgres"
STRIPE_SECRET_KEY="sk_test_xxx"
STRIPE_WEBHOOK_SECRET="whsec_xxx"
```

**Note**: Use Supabase pooler URL (port 6543) for better performance.

---

### Phase 2: Create Stripe Webhook Edge Function (1 hour)

#### Step 2.1: Create Edge Function

```bash
supabase functions new stripe-webhook-sync
```

#### Step 2.2: Implement Edge Function

**File**: `supabase/functions/stripe-webhook-sync/index.ts`

```typescript
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { StripeSync } from 'npm:@supabase/stripe-sync-engine@0.39.0';

// Load secrets from environment variables
const databaseUrl = Deno.env.get('DATABASE_URL')!;
const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;
const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')!;

// Initialize StripeSync
const stripeSync = new StripeSync({
  databaseUrl,
  stripeWebhookSecret,
  stripeSecretKey,
  backfillRelatedEntities: true,  // Automatically fetch related objects
  autoExpandLists: true,          // Expand list properties
  schema: 'stripe',               // Use 'stripe' schema
});

Deno.serve(async (req) => {
  try {
    // Extract raw body as Uint8Array (buffer)
    const rawBody = new Uint8Array(await req.arrayBuffer());
    const stripeSignature = req.headers.get('stripe-signature');

    if (!stripeSignature) {
      return new Response('Missing stripe-signature header', { status: 400 });
    }

    // Process webhook (this syncs data to Postgres automatically)
    await stripeSync.processWebhook(rawBody, stripeSignature);

    console.log('✅ Webhook processed and synced to Postgres');

    return new Response(null, {
      status: 202,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ Webhook processing error:', error);

    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
```

#### Step 2.3: Deploy Edge Function

```bash
# Deploy
supabase functions deploy stripe-webhook-sync

# Set secrets
supabase secrets set --env-file ./supabase/.env
```

#### Step 2.4: Configure Stripe Webhook

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter URL: `https://xxx.supabase.co/functions/v1/stripe-webhook-sync`
4. Select events (or choose "Select all events")
5. Save webhook secret to environment

---

### Phase 3: Create Database Triggers (1 hour)

Now that Stripe data is syncing to `stripe.*` tables, we need to update `public.users` when subscriptions change.

#### Step 3.1: Create Trigger Function

**File**: `supabase/migrations/20250121_stripe_subscription_sync.sql`

```sql
-- Function to sync stripe.subscriptions to public.users
CREATE OR REPLACE FUNCTION sync_subscription_to_user()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id uuid;
  v_tier text;
  v_monthly_limit int;
BEGIN
  -- Get user_id from subscription metadata
  v_user_id := (NEW.metadata->>'userId')::uuid;

  IF v_user_id IS NULL THEN
    RAISE WARNING 'No userId found in subscription metadata: %', NEW.id;
    RETURN NEW;
  END IF;

  -- Determine tier based on subscription status
  v_tier := CASE
    WHEN NEW.status IN ('active', 'trialing') THEN 'PAID'
    WHEN NEW.status IN ('past_due', 'unpaid') THEN 'PAID'  -- Keep access during grace period
    ELSE 'FREE'
  END;

  -- Determine monthly limit based on price
  v_monthly_limit := CASE
    WHEN NEW.status IN ('active', 'trialing') THEN 25
    ELSE 3
  END;

  -- Update user record
  UPDATE public.users
  SET
    subscription_tier = v_tier,
    subscription_status = NEW.status,
    stripe_customer_id = NEW.customer,
    stripe_subscription_id = NEW.id,
    stripe_price_id = (
      SELECT (items->0->>'price')::text
      FROM jsonb_array_elements(NEW.items) AS items
      LIMIT 1
    ),
    monthly_generation_limit = v_monthly_limit,
    subscription_created_at = TO_TIMESTAMP(NEW.created),
    subscription_expires_at = CASE
      WHEN NEW.current_period_end IS NOT NULL
      THEN TO_TIMESTAMP(NEW.current_period_end)
      ELSE NULL
    END,
    updated_at = NOW()
  WHERE id = v_user_id;

  -- Log the sync
  RAISE NOTICE 'Synced subscription % to user %: tier=%, status=%',
    NEW.id, v_user_id, v_tier, NEW.status;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on stripe.subscriptions
DROP TRIGGER IF EXISTS sync_subscription_on_change ON stripe.subscriptions;

CREATE TRIGGER sync_subscription_on_change
  AFTER INSERT OR UPDATE ON stripe.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION sync_subscription_to_user();
```

#### Step 3.2: Apply Migration

```bash
supabase db push
```

**How it works**:
1. Stripe webhook arrives → Sync Engine updates `stripe.subscriptions`
2. Postgres trigger fires → `sync_subscription_to_user()` function runs
3. Function reads subscription metadata → Finds `userId`
4. Function updates `public.users` with subscription details
5. User's tier, status, and limits are updated automatically

---

### Phase 4: Handle Onboarding Completion (30 minutes)

We still need custom logic for onboarding completion (marking `has_completed_onboarding: true`).

#### Option A: Add to Trigger Function (Simple)

Update the trigger function to also mark onboarding complete:

```sql
-- Add to sync_subscription_to_user() function
UPDATE public.users
SET
  subscription_tier = v_tier,
  subscription_status = NEW.status,
  -- ... other fields ...

  -- Mark onboarding complete on first subscription
  has_completed_onboarding = CASE
    WHEN has_completed_onboarding = false
      AND NEW.metadata->>'onboarding_session' = 'true'
      AND NEW.status IN ('active', 'trialing')
    THEN true
    ELSE has_completed_onboarding
  END,

  onboarding_step = CASE
    WHEN has_completed_onboarding = false
      AND NEW.metadata->>'onboarding_session' = 'true'
      AND NEW.status IN ('active', 'trialing')
    THEN 6
    ELSE onboarding_step
  END,

  onboarding_completed_at = CASE
    WHEN has_completed_onboarding = false
      AND NEW.metadata->>'onboarding_session' = 'true'
      AND NEW.status IN ('active', 'trialing')
    THEN NOW()
    ELSE onboarding_completed_at
  END
WHERE id = v_user_id;
```

#### Option B: Keep Minimal Custom Webhook (Advanced)

Keep a lightweight webhook handler just for onboarding:

**File**: `src/app/api/stripe/webhook-onboarding/route.ts`

```typescript
import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Only handle onboarding-specific logic
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // Check if this is an onboarding session
    if (session.metadata?.onboarding_session === 'true') {
      const userId = session.metadata.userId;

      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      await supabase
        .from('users')
        .update({
          has_completed_onboarding: true,
          onboarding_step: 6,
          onboarding_completed_at: new Date().toISOString(),
        })
        .eq('id', userId);

      console.log('✅ Onboarding completed for user:', userId);
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
```

**Then set up TWO webhooks in Stripe**:
1. Main webhook → Edge Function (syncs all data)
2. Onboarding webhook → `/api/stripe/webhook-onboarding` (marks onboarding complete)

---

### Phase 5: Update Existing Code (30 minutes)

#### Step 5.1: Remove Old Webhook Handler

**Option 1**: Delete entirely (if using Option A from Phase 4)

```bash
rm src/app/api/stripe/webhook/route.ts
```

**Option 2**: Keep minimal version (if using Option B from Phase 4)

Simplify to only handle onboarding completion.

#### Step 5.2: Query Stripe Data from Postgres

Now you can query Stripe data directly! Update any code that calls Stripe API:

**Before (API calls)**:
```typescript
const subscription = await stripe.subscriptions.retrieve(subscriptionId);
```

**After (Postgres queries)**:
```typescript
const { data: subscription } = await supabase
  .from('stripe.subscriptions')
  .select('*')
  .eq('id', subscriptionId)
  .single();
```

#### Step 5.3: Update Success Page

**File**: `src/app/onboarding/success/page.tsx`

```typescript
// Query subscription from Postgres instead of Stripe API
const { data: session } = await supabase
  .from('stripe.checkout_sessions')
  .select('*, subscription:stripe.subscriptions(*)')
  .eq('id', sessionId)
  .single();

if (session?.status === 'complete') {
  // Payment successful, show success UI
}
```

---

## Benefits Summary

### What You Gain:

1. **Reduced Code Complexity**
   - Remove ~200 lines of webhook parsing
   - No more manual event handlers
   - Database triggers handle business logic

2. **Better Data Access**
   - Query Stripe data with SQL joins
   - No rate limits (it's your database)
   - Real-time data (updated via webhooks)

3. **Improved Analytics**
   ```sql
   -- Example: Get subscription MRR by plan
   SELECT
     p.nickname AS plan_name,
     COUNT(*) AS active_subs,
     SUM(p.unit_amount / 100.0) AS mrr
   FROM stripe.subscriptions s
   JOIN stripe.prices p ON p.id = (s.items->0->>'price')
   WHERE s.status = 'active'
   GROUP BY p.nickname;
   ```

4. **Built-in Resilience**
   - Automatic retry on webhook failures
   - Webhook signature verification
   - Error logging

5. **Future-Proof**
   - New Stripe events auto-sync
   - No code changes needed for new webhook types
   - Schema updates handled by library

---

## Migration Checklist

- [ ] Install `@supabase/stripe-sync-engine`
- [ ] Run schema migrations (create `stripe.*` tables)
- [ ] Create Edge Function for webhook sync
- [ ] Deploy Edge Function
- [ ] Set environment secrets
- [ ] Configure Stripe webhook endpoint
- [ ] Create Postgres trigger for user sync
- [ ] Test webhook with Stripe CLI
- [ ] Update success page to query Postgres
- [ ] Remove/simplify old webhook handler
- [ ] Test end-to-end flow
- [ ] Monitor Edge Function logs

---

## Testing

### Test Webhook Sync

```bash
# Forward webhooks to local Edge Function
stripe listen --forward-to http://localhost:54321/functions/v1/stripe-webhook-sync

# Trigger test events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
stripe trigger invoice.paid

# Check Postgres tables
psql $DATABASE_URL -c "SELECT * FROM stripe.subscriptions;"
psql $DATABASE_URL -c "SELECT * FROM public.users WHERE stripe_subscription_id IS NOT NULL;"
```

### Verify Trigger Function

```sql
-- Check if trigger is firing
SELECT * FROM stripe.subscriptions ORDER BY created DESC LIMIT 5;
SELECT * FROM public.users WHERE subscription_tier = 'PAID';

-- Manual trigger test
UPDATE stripe.subscriptions
SET status = 'active'
WHERE id = 'sub_xxx';  -- Should update public.users
```

---

## Cost Considerations

**Edge Function Costs**:
- Free tier: 500K function invocations/month
- Webhooks are lightweight (~1-2ms processing time)
- Estimated cost: $0 for most startups (under free tier)

**Database Storage**:
- Stripe data is relatively small
- Estimated: ~100-500 MB for 10K subscriptions
- Cost: Negligible on Supabase free tier

**Total Additional Cost**: $0/month for most use cases

---

## Rollback Plan

If integration fails or causes issues:

1. **Disable Edge Function**:
   ```bash
   supabase functions delete stripe-webhook-sync
   ```

2. **Remove Stripe webhook**:
   - Delete webhook endpoint in Stripe Dashboard

3. **Drop Trigger**:
   ```sql
   DROP TRIGGER sync_subscription_on_change ON stripe.subscriptions;
   DROP FUNCTION sync_subscription_to_user();
   ```

4. **Keep or Drop Schema**:
   ```sql
   -- Optional: Remove stripe schema
   DROP SCHEMA stripe CASCADE;
   ```

5. **Re-enable old webhook handler**:
   - Restore `src/app/api/stripe/webhook/route.ts`

---

## Recommendation

**✅ PROCEED with Stripe Sync Engine integration**

**Recommended Approach**: Option A (Database Trigger for Everything)
- Simplest implementation
- Least code to maintain
- Most robust long-term

**Timeline**: 3-4 hours total
- Phase 1: 1 hour (setup)
- Phase 2: 1 hour (Edge Function)
- Phase 3: 1 hour (triggers)
- Phase 4: 30 min (onboarding)
- Phase 5: 30 min (cleanup)

**Risk**: Low - Easy to rollback if needed

---

## Next Steps

1. **Approve this plan**
2. **Install and run migrations** (Phase 1)
3. **Create and deploy Edge Function** (Phase 2)
4. **Create database triggers** (Phase 3)
5. **Test end-to-end** (Testing section)
6. **Deploy to production**

Would you like me to proceed with implementation?
