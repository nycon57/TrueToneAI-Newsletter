# Supabase Edge Function Deployment Guide

## Prerequisites

1. **Install Supabase CLI**
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**
   ```bash
   supabase login
   ```

## Deploying the Stripe Webhook Edge Function

### Step 1: Link to Your Supabase Project

```bash
supabase link --project-ref rzuhnhnkhfehxaijmgho
```

When prompted, enter your database password.

### Step 2: Deploy the Edge Function

```bash
supabase functions deploy stripe-webhook-sync
```

This will:
- Upload the function code to Supabase
- Make it available at: `https://rzuhnhnkhfehxaijmgho.supabase.co/functions/v1/stripe-webhook-sync`

### Step 3: Set Environment Secrets

```bash
cd supabase
supabase secrets set --env-file .env
```

This uploads your Stripe keys and database URL as encrypted secrets.

### Step 4: Verify Deployment

```bash
supabase functions list
```

You should see `stripe-webhook-sync` in the list with status "ACTIVE".

## Configure Stripe Webhook

After deployment, add the webhook endpoint to Stripe:

1. Go to: https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Enter webhook URL:
   ```
   https://rzuhnhnkhfehxaijmgho.supabase.co/functions/v1/stripe-webhook-sync
   ```
4. Select "Select all events" or choose specific events
5. Click "Add endpoint"
6. Copy the webhook signing secret
7. Update `supabase/.env` with the new secret
8. Re-run: `supabase secrets set --env-file supabase/.env`

## Testing Locally

### Option 1: Test with Stripe CLI

```bash
# Forward webhooks to local function
stripe listen --forward-to http://localhost:54321/functions/v1/stripe-webhook-sync

# In another terminal, trigger test events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
```

### Option 2: Test with curl

```bash
# This will fail signature verification but tests the endpoint
curl -X POST https://rzuhnhnkhfehxaijmgho.supabase.co/functions/v1/stripe-webhook-sync \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

## Monitoring

View Edge Function logs:

```bash
supabase functions logs stripe-webhook-sync
```

Or view in Dashboard:
https://supabase.com/dashboard/project/rzuhnhnkhfehxaijmgho/functions/stripe-webhook-sync/logs

## Troubleshooting

### Function not found
- Make sure you've run `supabase functions deploy`
- Check `supabase functions list`

### Webhook signature verification fails
- Ensure `STRIPE_WEBHOOK_SECRET` is set correctly
- Make sure you're using the signing secret from the specific webhook endpoint

### Database connection errors
- Verify `DATABASE_URL` in `supabase/.env`
- Try using the pooler URL (port 6543)

### Environment variables not updating
- Run `supabase secrets set --env-file supabase/.env` after changes
- Wait 1-2 minutes for secrets to propagate

## Next Steps

After deployment:
1. ✅ Edge Function is live
2. ✅ Webhooks are syncing to Postgres
3. → Create database triggers (Phase 3)
4. → Fix frontend components (Phase 4)
5. → Test end-to-end (Phase 5)
