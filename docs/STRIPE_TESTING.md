# Stripe Integration Testing Guide

This guide covers testing the Stripe subscription integration locally and in production.

## Table of Contents

1. [Setup](#setup)
2. [Testing Webhooks Locally](#testing-webhooks-locally)
3. [Test Scenarios](#test-scenarios)
4. [Troubleshooting](#troubleshooting)
5. [Production Checklist](#production-checklist)

---

## Setup

### Environment Variables

Ensure these environment variables are set in your `.env` file:

```bash
# Stripe Keys (get from https://dashboard.stripe.com/test/apikeys)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Webhook Secret (get from Stripe CLI or webhook dashboard)
STRIPE_WEBHOOK_SECRET=whsec_...

# Price ID for paid tier (create in Stripe Dashboard)
STRIPE_PRICE_ID_PAID_TIER=price_...

# Your app URL
NEXT_PUBLIC_URL=http://localhost:3000
```

### Install Stripe CLI

The Stripe CLI is required for local webhook testing.

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Other platforms
# See: https://stripe.com/docs/stripe-cli
```

### Login to Stripe CLI

```bash
stripe login
```

---

## Testing Webhooks Locally

### 1. Start Your Development Server

```bash
npm run dev
```

### 2. Forward Webhooks to Local Server

In a separate terminal, run:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

This will output a webhook signing secret like:
```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

**Important:** Copy this secret and update your `.env` file:
```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

Restart your dev server after updating the environment variable.

### 3. Trigger Test Events

You can trigger webhook events using the Stripe CLI:

```bash
# Successful checkout
stripe trigger checkout.session.completed

# Subscription updated
stripe trigger customer.subscription.updated

# Subscription deleted (cancellation)
stripe trigger customer.subscription.deleted

# Payment failed
stripe trigger invoice.payment_failed

# Payment succeeded
stripe trigger invoice.payment_succeeded
```

### 4. Monitor Webhook Events

Watch your terminal running `stripe listen` to see events being forwarded:

```
2025-01-15 10:30:15   --> checkout.session.completed [evt_xxx]
2025-01-15 10:30:15  <--  [200] POST http://localhost:3000/api/stripe/webhook [evt_xxx]
```

Check your dev server logs for webhook processing:

```
[Webhook] Checkout session completed: cs_test_xxx
[Webhook] User upgraded to PAID tier: user-uuid
```

---

## Test Scenarios

### Scenario 1: New Subscription

**Test the complete checkout flow and webhook processing**

#### Steps:

1. **Create a test product in Stripe Dashboard** (if not already done):
   - Go to https://dashboard.stripe.com/test/products
   - Create a product: "Pro Subscription"
   - Add a recurring price: $29/month
   - Copy the price ID and set it in `.env` as `STRIPE_PRICE_ID_PAID_TIER`

2. **Test the checkout flow**:
   ```bash
   # In your browser, navigate to the upgrade page
   # Click "Upgrade to Pro" button
   # This will call POST /api/stripe/checkout
   ```

3. **Complete checkout with test card**:
   - Use test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVC
   - Any ZIP code

4. **Verify webhook processing**:
   - Check terminal for `checkout.session.completed` event
   - Verify user record in database:
     ```sql
     SELECT
       id,
       email,
       subscription_tier,
       subscription_status,
       stripe_customer_id,
       stripe_subscription_id,
       monthly_generation_limit
     FROM users
     WHERE email = 'test@example.com';
     ```

5. **Expected database state**:
   ```
   subscription_tier: PAID
   subscription_status: active
   stripe_customer_id: cus_xxx
   stripe_subscription_id: sub_xxx
   monthly_generation_limit: 25
   ```

---

### Scenario 2: Subscription Cancellation

**Test subscription cancellation and downgrade to free tier**

#### Steps:

1. **Cancel subscription in Stripe Dashboard**:
   - Go to https://dashboard.stripe.com/test/subscriptions
   - Find the test subscription
   - Click "Cancel subscription"
   - Choose "Cancel immediately"

2. **Verify webhook**:
   - Watch for `customer.subscription.deleted` event
   - Check logs: `[Webhook] User downgraded to FREE tier: user-uuid`

3. **Verify database**:
   ```sql
   SELECT subscription_tier, subscription_status, monthly_generation_limit
   FROM users
   WHERE stripe_subscription_id = 'sub_xxx';
   ```

4. **Expected state**:
   ```
   subscription_tier: FREE
   subscription_status: canceled
   monthly_generation_limit: 3
   stripe_subscription_id: null
   ```

---

### Scenario 3: Failed Payment

**Test handling of failed recurring payments**

#### Steps:

1. **Trigger payment failure**:
   ```bash
   stripe trigger invoice.payment_failed
   ```

2. **Verify webhook processing**:
   - Check logs: `[Webhook] Subscription marked past_due for user: user-uuid`

3. **Verify database**:
   ```sql
   SELECT subscription_status FROM users WHERE id = 'user-uuid';
   ```

4. **Expected state**:
   ```
   subscription_status: past_due
   ```

5. **Test that user still has access** (grace period):
   - Navigate to `/api/articles`
   - Verify user can still access paid features during dunning period

---

### Scenario 4: Subscription Updated

**Test plan changes or subscription updates**

#### Steps:

1. **Update subscription in Stripe**:
   - Change the subscription quantity, or
   - Add/remove items, or
   - Change the price

2. **Trigger event**:
   ```bash
   stripe trigger customer.subscription.updated
   ```

3. **Verify webhook**:
   - Check logs: `[Webhook] Subscription updated for user: user-uuid Status: active`

4. **Verify database reflects changes**

---

### Scenario 5: Billing Portal

**Test customer portal for subscription management**

#### Steps:

1. **Access billing portal**:
   ```bash
   # Make API request or use UI button
   POST /api/stripe/portal
   ```

2. **Verify portal creation**:
   - Should receive URL to Stripe hosted portal
   - Should redirect user to portal

3. **Test portal actions**:
   - Update payment method
   - View invoices
   - Cancel subscription
   - Verify webhooks fire for each action

---

## Test Cards

Stripe provides test cards for various scenarios:

| Card Number         | Scenario               |
|---------------------|------------------------|
| 4242 4242 4242 4242 | Success                |
| 4000 0025 0000 3155 | Requires authentication (3D Secure) |
| 4000 0000 0000 9995 | Declined               |
| 4000 0000 0000 0341 | Attach fails           |
| 4000 0000 0000 0002 | Charge declined        |

See full list: https://stripe.com/docs/testing

---

## Webhook Security

### Verify Signature Verification is Working

1. **Test with invalid signature**:
   ```bash
   curl -X POST http://localhost:3000/api/stripe/webhook \
     -H "Content-Type: application/json" \
     -H "stripe-signature: invalid" \
     -d '{"type": "test"}'
   ```

2. **Expected response**: 400 Bad Request
   ```json
   {
     "error": "Invalid signature"
   }
   ```

3. **Check logs**: Should see "Webhook signature verification failed"

---

## Database Queries for Testing

### Check User Subscription Status

```sql
SELECT
  id,
  email,
  subscription_tier,
  subscription_status,
  monthly_generation_limit,
  monthly_generations_used,
  stripe_customer_id,
  stripe_subscription_id,
  subscription_created_at
FROM users
WHERE email = 'test@example.com';
```

### Find Users by Subscription Status

```sql
SELECT COUNT(*), subscription_status
FROM users
GROUP BY subscription_status;
```

### Check Recent Subscription Changes

```sql
SELECT
  email,
  subscription_tier,
  subscription_status,
  subscription_created_at
FROM users
WHERE subscription_created_at > NOW() - INTERVAL '24 hours'
ORDER BY subscription_created_at DESC;
```

---

## Troubleshooting

### Webhook Not Receiving Events

**Problem**: Stripe CLI shows events sent, but webhook handler not logging

**Solutions**:
1. Verify webhook secret in `.env` matches CLI output
2. Restart dev server after updating `.env`
3. Check webhook URL is correct: `/api/stripe/webhook`
4. Verify Next.js API route is not being cached

### Database Not Updating

**Problem**: Webhook logs show success, but database unchanged

**Solutions**:
1. Check Supabase connection in logs
2. Verify user ID exists in metadata
3. Check for database permission errors
4. Verify column names match schema:
   ```sql
   \d users
   ```

### Customer ID Not Found

**Problem**: `[Webhook] No user ID found for subscription`

**Solutions**:
1. Ensure checkout session includes metadata:
   ```javascript
   metadata: {
     userId: user.id,
   },
   subscription_data: {
     metadata: {
       userId: user.id,
     },
   }
   ```
2. Check that customer ID was saved during checkout
3. Manually update user record:
   ```sql
   UPDATE users
   SET stripe_customer_id = 'cus_xxx'
   WHERE id = 'user-uuid';
   ```

### Subscription Status Not Syncing

**Problem**: Stripe shows "active" but database shows "canceled"

**Solutions**:
1. Manually trigger sync:
   ```bash
   stripe trigger customer.subscription.updated
   ```
2. Check webhook event history in Stripe Dashboard
3. Look for failed webhook deliveries
4. Verify webhook endpoint is responding with 200

---

## Production Checklist

Before deploying to production:

### 1. Update Environment Variables

Replace test keys with live keys:

```bash
# Live Stripe Keys
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Production webhook secret (from Stripe Dashboard)
STRIPE_WEBHOOK_SECRET=whsec_...

# Live price ID
STRIPE_PRICE_ID_PAID_TIER=price_live_...

# Production URL
NEXT_PUBLIC_URL=https://yourdomain.com
```

### 2. Configure Webhook in Stripe Dashboard

1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Enter URL: `https://yourdomain.com/api/stripe/webhook`
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy webhook signing secret
6. Update `STRIPE_WEBHOOK_SECRET` in production environment

### 3. Test Production Webhooks

1. Complete a real test subscription in production
2. Monitor webhook delivery in Stripe Dashboard
3. Verify database updates correctly
4. Test cancellation flow
5. Test payment failure handling

### 4. Enable Stripe Billing Portal

1. Go to https://dashboard.stripe.com/settings/billing/portal
2. Configure portal settings:
   - Enable customer portal
   - Configure cancellation behavior
   - Set email receipt preferences
   - Customize branding
3. Test portal in production

### 5. Monitor Production

- Set up Stripe webhook alerts for failures
- Monitor error logs for webhook processing
- Track subscription metrics in Stripe Dashboard
- Set up alerts for:
  - Failed payments
  - Cancellations
  - Webhook delivery failures

### 6. Security Review

- [ ] Webhook signature verification enabled
- [ ] HTTPS enforced on webhook endpoint
- [ ] Rate limiting on sensitive endpoints
- [ ] Proper error handling (no sensitive data in responses)
- [ ] Database queries use parameterized queries
- [ ] Stripe keys stored securely (environment variables only)

---

## Useful Stripe CLI Commands

```bash
# List recent events
stripe events list --limit 10

# Get details of specific event
stripe events retrieve evt_xxx

# List all customers
stripe customers list --limit 10

# Get customer details
stripe customers retrieve cus_xxx

# List subscriptions
stripe subscriptions list --limit 10

# Get subscription details
stripe subscriptions retrieve sub_xxx

# Cancel subscription
stripe subscriptions cancel sub_xxx

# View webhook endpoints
stripe webhook-endpoints list

# Test webhook endpoint
stripe trigger checkout.session.completed
```

---

## API Response Examples

### Successful Checkout Response

```json
{
  "sessionId": "cs_test_xxx",
  "url": "https://checkout.stripe.com/c/pay/cs_test_xxx"
}
```

### Billing Portal Response

```json
{
  "url": "https://billing.stripe.com/p/session/live_xxx"
}
```

### Subscription Status in Articles API

```json
{
  "articles": [...],
  "user_tier": "PAID",
  "subscription_status": "active",
  "monthly_generations_used": 5,
  "monthly_generation_limit": 25,
  "total_count": 50
}
```

---

## Additional Resources

- [Stripe Testing Docs](https://stripe.com/docs/testing)
- [Stripe CLI Docs](https://stripe.com/docs/stripe-cli)
- [Webhook Best Practices](https://stripe.com/docs/webhooks/best-practices)
- [Stripe Billing Docs](https://stripe.com/docs/billing)
