# Stripe Setup - Quick Start Guide

## 🚨 IMPORTANT: Complete These Steps Before Testing

### Step 1: Get Your Stripe API Keys

1. Go to [Stripe Dashboard → API Keys](https://dashboard.stripe.com/test/apikeys)
2. Click "Reveal test key" for **Secret key**
3. Copy the value (starts with `sk_test_...`)
4. Update `.env` file line 76:
   ```bash
   STRIPE_SECRET_KEY=sk_test_your_actual_key_here
   ```

5. Copy the **Publishable key** (starts with `pk_test_...`)
6. Update `.env` file line 77:
   ```bash
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key_here
   ```

### Step 2: You'll Get Webhook Secret Later

Don't worry about `STRIPE_WEBHOOK_SECRET` yet - we'll get this after deploying the Edge Function.

### Step 3: Verify Price IDs (Optional)

The migration script already found these prices from your Stripe account:
- **Newsletter Plus**: `price_1SAcEpCezhgJ3dc1rGAyaylW` ($19.95/month)
- **TrueTone Pro Monthly**: `price_1RXRURCezhgJ3dc1AQVWSZsu` ($199/month)

These are already configured in `.env` line 89. No action needed unless you want to use a different price.

---

## Current Status

✅ Stripe Sync Engine package installed
✅ Environment variables template created
⏸️ **WAITING**: You need to add your Stripe API keys to `.env`

## Next Steps (After Adding Keys)

1. Run: `npx tsx scripts/setup-stripe-sync.ts`
2. Create Supabase Edge Function
3. Deploy and configure webhook

---

## Where to Find Everything

- **Stripe Dashboard**: https://dashboard.stripe.com
- **API Keys**: https://dashboard.stripe.com/test/apikeys
- **Products**: https://dashboard.stripe.com/test/products
- **Prices**: https://dashboard.stripe.com/test/prices
- **Webhooks**: https://dashboard.stripe.com/test/webhooks (we'll set this up later)

---

## Need Help?

See the full documentation:
- `/docs/STRIPE_SYNC_ENGINE_INTEGRATION.md`
- `/docs/IMPLEMENTATION_MASTER_PLAN.md`
