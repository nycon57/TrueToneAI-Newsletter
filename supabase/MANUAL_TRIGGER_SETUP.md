# Manual Trigger Setup Guide

## Why Manual Setup?

Automated database migrations can fail due to:
- Supabase database being paused (auto-pauses after inactivity)
- Network restrictions or firewall rules
- Connection pooling limits

The **easiest and most reliable** way is to apply the SQL through Supabase Dashboard.

---

## ✅ Step-by-Step Instructions

### Step 1: Open Supabase SQL Editor

1. Go to: **https://supabase.com/dashboard/project/rzuhnhnkhfehxaijmgho/sql/new**
2. You'll see a blank SQL editor

### Step 2: Copy the Trigger SQL

1. Open this file in your code editor:
   ```
   supabase/migrations/20250121_stripe_subscription_sync.sql
   ```

2. **Copy the entire contents** (Cmd+A, Cmd+C)

### Step 3: Paste and Run

1. **Paste** the SQL into the Supabase SQL editor
2. Click the **"Run"** button (or press Cmd+Enter)
3. Wait for confirmation message: **"Success. No rows returned"**

### Step 4: Verify the Trigger Was Created

Run this verification query in the SQL editor:

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
- ✅ 1 row for the function `sync_subscription_to_user`
- ✅ 1 row for the trigger `sync_subscription_on_change`

---

## What This Trigger Does

Once applied, here's the automatic flow:

```
1. Stripe webhook arrives
   ↓
2. Edge Function processes webhook
   ↓
3. Stripe Sync Engine updates stripe.subscriptions table
   ↓
4. 🔥 TRIGGER FIRES 🔥
   ↓
5. sync_subscription_to_user() function runs
   ↓
6. Reads userId from subscription metadata
   ↓
7. Updates public.users table:
   - subscription_tier (FREE/PAID)
   - subscription_status (active/trialing/canceled)
   - stripe_customer_id
   - stripe_subscription_id
   - monthly_generation_limit (3 or 25)
   - has_completed_onboarding (true if onboarding session)
   ↓
8. ✅ User automatically gets premium access!
```

---

## Troubleshooting

### Error: "relation stripe.subscriptions does not exist"

**Solution**: The stripe schema wasn't created. Run:
```bash
npx tsx scripts/setup-stripe-sync.ts
```

### Error: "function already exists"

**Solution**: This is OK! It means the trigger was already created. You can safely ignore this.

### Error: "permission denied"

**Solution**: Make sure you're logged into Supabase Dashboard with the correct account that owns this project.

---

## Next Steps After Trigger is Applied

✅ **Phase 1**: Stripe schema created
✅ **Phase 2**: Edge Function created (ready to deploy)
✅ **Phase 3**: Database trigger created

**→ Phase 4**: Fix frontend components
**→ Phase 5**: Test end-to-end flow

See `PROGRESS_SUMMARY.md` for current status and next steps.

---

## Quick Test

After applying the trigger, you can test it manually:

```sql
-- 1. Insert a test subscription
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

-- 2. Check if your user was updated
SELECT
  subscription_tier,
  subscription_status,
  has_completed_onboarding,
  monthly_generation_limit
FROM public.users
WHERE id = 'YOUR_USER_ID_HERE';

-- 3. Clean up test data
DELETE FROM stripe.subscriptions WHERE id = 'sub_test_manual';
```

Replace `YOUR_USER_ID_HERE` with an actual user ID from your database.

---

**Need Help?** See the full documentation in `docs/STRIPE_SYNC_ENGINE_INTEGRATION.md`
