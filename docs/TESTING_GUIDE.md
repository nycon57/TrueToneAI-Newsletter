# End-to-End Testing Guide

This guide walks you through testing the complete Stripe Sync Engine integration and subscription flow.

## Prerequisites

Before testing, ensure you've completed:

- ✅ Phase 1: Stripe schema created in database
- ✅ Phase 2: Edge Function created
- ✅ Phase 3: Database trigger created
- ✅ Phase 4: Frontend components updated
- ⏳ **USER ACTION REQUIRED**: Deploy Edge Function
- ⏳ **USER ACTION REQUIRED**: Apply database trigger
- ⏳ **USER ACTION REQUIRED**: Configure Stripe webhook

---

## Pre-Deployment Checklist

### 1. Verify Environment Variables

**In `.env`:**
```bash
# Stripe (using test keys for development!)
STRIPE_SECRET_KEY=sk_test_... # Should start with sk_test_ for development
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... # Should start with pk_test_
STRIPE_WEBHOOK_SECRET=whsec_... # Get after creating webhook
STRIPE_PRICE_ID_PAID_TIER=price_... # Your subscription price ID

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://rzuhnhnkhfehxaijmgho.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
DATABASE_URL=postgres://...
DIRECT_URL=postgresql://...
```

**In `supabase/.env`:**
```bash
DATABASE_URL=postgres://postgres.rzuhnhnkhfehxaijmgho:JSttai2023!!@aws-1-us-east-1.pooler.supabase.com:5432/postgres
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

### 2. Deploy Edge Function

```bash
# Link your Supabase project (first time only)
supabase link --project-ref rzuhnhnkhfehxaijmgho

# Deploy the Edge Function
supabase functions deploy stripe-webhook-sync

# Set environment variables
supabase secrets set --env-file supabase/.env
```

**Expected output:**
```
Deploying Function stripe-webhook-sync (project ref: rzuhnhnkhfehxaijmgho)
✓ Function successfully deployed!
```

**Get the function URL:**
```
https://rzuhnhnkhfehxaijmgho.supabase.co/functions/v1/stripe-webhook-sync
```

---

### 3. Apply Database Trigger

**Option A: Via Supabase Dashboard (Recommended)**

1. Go to: https://supabase.com/dashboard/project/rzuhnhnkhfehxaijmgho/sql/new
2. Open: `supabase/migrations/20250121_stripe_subscription_sync.sql`
3. Copy the entire contents
4. Paste into SQL editor
5. Click "Run"

**Verify it worked:**
```sql
-- Check if the trigger function exists
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_name = 'sync_subscription_to_user';

-- Check if the trigger exists
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'sync_subscription_on_change';
```

You should see:
- ✅ 1 row for function: `sync_subscription_to_user`
- ✅ 1 row for trigger: `sync_subscription_on_change`

**Option B: Via Script (if database is accessible)**
```bash
npx tsx scripts/apply-trigger-migration.ts
```

---

### 4. Configure Stripe Webhook

1. Go to: https://dashboard.stripe.com/test/webhooks
2. Click "Add endpoint"
3. **Endpoint URL:** `https://rzuhnhnkhfehxaijmgho.supabase.co/functions/v1/stripe-webhook-sync`
4. **Events to send:** Select "Select all events"
5. Click "Add endpoint"
6. Copy the **Signing secret** (starts with `whsec_`)
7. Update both `.env` and `supabase/.env` with the new webhook secret
8. Re-run: `supabase secrets set --env-file supabase/.env`

---

## Testing Methods

### Method 1: Local Testing with Stripe CLI (Fastest)

**Install Stripe CLI:**
```bash
brew install stripe/stripe-cli/stripe
```

**Login to Stripe:**
```bash
stripe login
```

**Forward webhooks to your Edge Function:**
```bash
stripe listen --forward-to https://rzuhnhnkhfehxaijmgho.supabase.co/functions/v1/stripe-webhook-sync
```

**Expected output:**
```
> Ready! Your webhook signing secret is whsec_xxxxx (^C to quit)
```

**Trigger a test checkout session:**
```bash
stripe trigger checkout.session.completed
```

**Watch the console for:**
- ✅ Webhook received by Edge Function
- ✅ Stripe Sync Engine processing event
- ✅ Database trigger firing
- ✅ User record updated

---

### Method 2: End-to-End Testing with Real Checkout

#### Step 1: Start Development Server
```bash
npm run dev
```

#### Step 2: Create a Test User in Kinde

1. Go to your Kinde dashboard
2. Create a test user or use an existing one
3. Note the user's ID

#### Step 3: Add Test User to Supabase

Run this SQL in Supabase Dashboard:
```sql
INSERT INTO public.users (
  id,
  email,
  name,
  subscription_tier,
  monthly_generation_limit,
  has_completed_onboarding
) VALUES (
  'YOUR_KINDE_USER_ID',
  'test@example.com',
  'Test User',
  'FREE',
  3,
  false
) ON CONFLICT (id) DO NOTHING;
```

#### Step 4: Test the Onboarding Flow

1. **Navigate to:** `http://localhost:3000/onboarding`
2. **Complete steps 1-4** (profile, preferences, voice, etc.)
3. **On subscription step**, click "Choose Pro Plan"
4. **Verify:** You're redirected to Stripe Checkout
5. **Use test card:** `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits
6. **Complete payment**
7. **Verify:** Redirected to `/onboarding/success?session_id=cs_xxx`
8. **Check:** Success page shows "Welcome to TrueTone Newsletter! 🎉"

---

### Method 3: Database Verification

After completing a test checkout, verify the database was updated:

```sql
-- 1. Check if subscription was created in stripe.subscriptions
SELECT
  id,
  customer,
  status,
  metadata,
  created
FROM stripe.subscriptions
WHERE metadata->>'userId' = 'YOUR_KINDE_USER_ID'
ORDER BY created DESC
LIMIT 1;

-- 2. Check if user was updated in public.users
SELECT
  id,
  email,
  subscription_tier,
  subscription_status,
  stripe_customer_id,
  stripe_subscription_id,
  stripe_price_id,
  monthly_generation_limit,
  has_completed_onboarding,
  onboarding_step
FROM public.users
WHERE id = 'YOUR_KINDE_USER_ID';
```

**Expected results:**

**stripe.subscriptions:**
- ✅ `status`: `active` or `trialing`
- ✅ `metadata.userId`: Your Kinde user ID
- ✅ `metadata.onboarding_session`: `true`

**public.users:**
- ✅ `subscription_tier`: `PAID`
- ✅ `subscription_status`: `active` or `trialing`
- ✅ `stripe_customer_id`: `cus_xxxxx`
- ✅ `stripe_subscription_id`: `sub_xxxxx`
- ✅ `monthly_generation_limit`: `25`
- ✅ `has_completed_onboarding`: `true`
- ✅ `onboarding_step`: `6`

---

## Testing Edge Cases

### Test 1: Free Trial Selection

1. Complete onboarding
2. Select "Start Free Trial" instead of paid plan
3. **Verify:** Success page shows immediately (no Stripe redirect)
4. **Verify:** User record shows `subscription_tier: 'FREE'`

### Test 2: Payment Failure

1. Complete onboarding
2. Select paid plan
3. Use test card: `4000 0000 0000 0002` (declined)
4. **Verify:** Error shown on Stripe Checkout
5. **Verify:** User can retry payment

### Test 3: Webhook Retry

1. Complete a successful checkout
2. In Stripe Dashboard → Webhooks → Select your endpoint
3. Click on a recent event → Click "Resend"
4. **Verify:** Database doesn't create duplicate records

### Test 4: Session Verification

1. Complete checkout
2. Copy the `session_id` from URL
3. Manually call: `http://localhost:3000/api/stripe/verify-session?session_id=cs_xxx`
4. **Verify:** Returns `{ status: 'success', subscriptionId: 'sub_xxx' }`

---

## Monitoring & Debugging

### Check Edge Function Logs

```bash
supabase functions logs stripe-webhook-sync --limit 20
```

Or in Supabase Dashboard:
1. Go to: https://supabase.com/dashboard/project/rzuhnhnkhfehxaijmgho/functions/stripe-webhook-sync/logs
2. Filter by recent errors

### Check Stripe Webhook Logs

1. Go to: https://dashboard.stripe.com/test/webhooks
2. Click on your webhook endpoint
3. View "Event logs" for delivery status

### Check Supabase Logs

1. Go to: https://supabase.com/dashboard/project/rzuhnhnkhfehxaijmgho/logs/postgres-logs
2. Filter by "stripe" or "users"

---

## Common Issues

### Issue 1: "Tenant or user not found" Error

**Cause:** Database is paused (auto-pauses after inactivity)

**Fix:**
1. Go to Supabase Dashboard
2. Click "Restore project"
3. Wait 1-2 minutes for it to resume
4. Re-run your script/query

### Issue 2: Webhook Not Receiving Events

**Check:**
1. Edge Function deployed: `supabase functions list`
2. Webhook endpoint URL correct in Stripe Dashboard
3. Webhook secret correct in `supabase/.env`
4. Secrets uploaded: `supabase secrets list`

**Fix:**
```bash
supabase secrets set --env-file supabase/.env
```

### Issue 3: Trigger Not Firing

**Check if trigger exists:**
```sql
SELECT trigger_name
FROM information_schema.triggers
WHERE trigger_name = 'sync_subscription_on_change';
```

**Manually test trigger:**
```sql
-- Insert a test subscription
INSERT INTO stripe.subscriptions (
  id,
  customer,
  status,
  metadata,
  items,
  created,
  current_period_end
) VALUES (
  'sub_test_manual',
  'cus_test_manual',
  'active',
  '{"userId": "YOUR_USER_ID_HERE", "onboarding_session": "true"}'::jsonb,
  '[{"price": "price_test"}]'::jsonb,
  EXTRACT(EPOCH FROM NOW())::bigint,
  EXTRACT(EPOCH FROM (NOW() + INTERVAL '30 days'))::bigint
);

-- Check if user was updated
SELECT
  subscription_tier,
  subscription_status,
  has_completed_onboarding
FROM public.users
WHERE id = 'YOUR_USER_ID_HERE';

-- Clean up
DELETE FROM stripe.subscriptions WHERE id = 'sub_test_manual';
```

### Issue 4: Success Page Shows Error

**Check:**
1. `stripe.checkout_sessions` table exists: `SELECT * FROM stripe.checkout_sessions LIMIT 1;`
2. Session ID in URL is correct
3. API route `/api/stripe/verify-session` is accessible
4. Check browser console for errors

---

## Production Deployment Checklist

Before deploying to production:

1. **Switch to Live Stripe Keys**
   - Update `.env` with `sk_live_` and `pk_live_` keys
   - Update `supabase/.env` with live keys
   - Re-run: `supabase secrets set --env-file supabase/.env`

2. **Update Webhook Endpoint**
   - Go to: https://dashboard.stripe.com/webhooks (live mode)
   - Add production endpoint
   - Update `STRIPE_WEBHOOK_SECRET` with live webhook secret

3. **Test in Production**
   - Use real credit card or test mode
   - Verify webhook delivery
   - Check database updates
   - Monitor Edge Function logs

4. **Monitor for Errors**
   - Set up Sentry alerts
   - Monitor Supabase logs
   - Check Stripe webhook delivery success rate

---

## Next Steps

After successful testing:

1. ✅ Test end-to-end flow works
2. ✅ Verify database triggers update users correctly
3. ✅ Confirm webhook delivery is reliable
4. → Deploy to production
5. → Monitor initial users
6. → Set up analytics and tracking

---

## Support

- **Stripe Sync Engine Docs:** https://supabase.com/docs/guides/integrations/stripe
- **Edge Functions Docs:** https://supabase.com/docs/guides/functions
- **Stripe Testing:** https://stripe.com/docs/testing
- **Project Docs:** See `docs/STRIPE_SYNC_ENGINE_INTEGRATION.md`

---

**Need Help?** See:
- `supabase/MANUAL_TRIGGER_SETUP.md` - Database trigger setup
- `supabase/DEPLOYMENT_GUIDE.md` - Edge Function deployment
- `PROGRESS_SUMMARY.md` - Implementation status
