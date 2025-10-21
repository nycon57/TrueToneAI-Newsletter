# Stripe Integration - Quick Test Guide

**Time to test:** ~10 minutes

---

## Prerequisites

```bash
# 1. Install Stripe CLI (one time)
brew install stripe/stripe-cli/stripe

# 2. Login to Stripe (one time)
stripe login
```

---

## Test in 3 Steps

### Step 1: Setup (2 minutes)

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Forward webhooks
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Copy the webhook secret from Terminal 2:
# > Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx

# Update .env file
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Restart dev server (Terminal 1)
# Ctrl+C, then npm run dev
```

### Step 2: Test Subscription (5 minutes)

```bash
# 1. In browser: http://localhost:3000
# 2. Login or create account
# 3. Click "Upgrade to Pro" (wherever that button is)
# 4. Use test card: 4242 4242 4242 4242
#    - Expiry: Any future date
#    - CVC: Any 3 digits
#    - ZIP: Any 5 digits
# 5. Complete checkout
```

**Expected Results:**
- Terminal 2 shows: `checkout.session.completed` event
- Terminal 1 shows: `[Webhook] User upgraded to PAID tier`
- Database shows:
  ```sql
  SELECT subscription_tier, subscription_status
  FROM users WHERE email = 'your@email.com';
  -- Should show: PAID, active
  ```

### Step 3: Test Cancellation (3 minutes)

```bash
# Option A: Via Stripe Dashboard
# 1. Go to: https://dashboard.stripe.com/test/subscriptions
# 2. Find your subscription
# 3. Click "Cancel subscription"
# 4. Choose "Cancel immediately"

# Option B: Trigger via CLI
stripe trigger customer.subscription.deleted
```

**Expected Results:**
- Terminal 2 shows: `customer.subscription.deleted` event
- Terminal 1 shows: `[Webhook] User downgraded to FREE tier`
- Database shows:
  ```sql
  SELECT subscription_tier, subscription_status
  FROM users WHERE email = 'your@email.com';
  -- Should show: FREE, canceled
  ```

---

## Quick Troubleshooting

### Webhook not working?

```bash
# 1. Check .env has webhook secret
cat .env | grep STRIPE_WEBHOOK_SECRET

# 2. Restart dev server
# 3. Check stripe listen is running
# 4. Try triggering test event
stripe trigger checkout.session.completed
```

### Database not updating?

```sql
-- Check user has customer ID
SELECT id, email, stripe_customer_id, subscription_tier
FROM users WHERE email = 'your@email.com';

-- If stripe_customer_id is null, that's the problem
-- Webhook can't find user without customer ID
```

### Customer ID not saving?

```bash
# Check checkout logs in Terminal 1
# Should see: [Checkout] Created and saved Stripe customer: cus_xxx

# If not appearing, check Supabase connection
```

---

## Test Commands

```bash
# Trigger new subscription
stripe trigger checkout.session.completed

# Trigger cancellation
stripe trigger customer.subscription.deleted

# Trigger failed payment
stripe trigger invoice.payment_failed

# Trigger successful payment
stripe trigger invoice.payment_succeeded

# View recent events
stripe events list --limit 5

# View specific event
stripe events retrieve evt_xxxxxxxxxxxxx
```

---

## Database Queries

```sql
-- Check subscription status
SELECT
  email,
  subscription_tier,
  subscription_status,
  monthly_generation_limit,
  stripe_customer_id,
  stripe_subscription_id
FROM users
WHERE email = 'your@email.com';

-- Check all paid users
SELECT COUNT(*), subscription_tier
FROM users
GROUP BY subscription_tier;

-- Check recent subscriptions
SELECT email, subscription_tier, subscription_created_at
FROM users
WHERE subscription_created_at IS NOT NULL
ORDER BY subscription_created_at DESC
LIMIT 10;
```

---

## Success Criteria

- [x] Checkout creates Stripe customer
- [x] Customer ID saved to database
- [x] Webhook upgrades user to PAID
- [x] Subscription status syncs correctly
- [x] Cancellation downgrades to FREE
- [x] Failed payment marks past_due
- [x] User can access paid features when active
- [x] User loses access when canceled

---

## Next Steps

Once basic flow works:

1. Test billing portal: POST `/api/stripe/portal`
2. Test failed payment handling
3. Test subscription updates
4. Review full testing guide: `/docs/STRIPE_TESTING.md`

---

**Quick Reference:**

- Test Card: `4242 4242 4242 4242`
- Webhook URL: `http://localhost:3000/api/stripe/webhook`
- Stripe Dashboard: https://dashboard.stripe.com/test
- Full Guide: `/docs/STRIPE_TESTING.md`
