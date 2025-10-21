-- ============================================================================
-- Stripe Subscription Sync to Users Table
-- ============================================================================
--
-- This migration creates a trigger that automatically syncs subscription data
-- from stripe.subscriptions (managed by Stripe Sync Engine) to public.users
--
-- How it works:
-- 1. Stripe webhook arrives → Sync Engine updates stripe.subscriptions
-- 2. Postgres trigger fires → sync_subscription_to_user() function runs
-- 3. Function extracts userId from subscription metadata
-- 4. Function updates public.users with subscription details
-- 5. User's tier, status, and limits are updated automatically
--
-- Created: 2025-01-21
-- ============================================================================

-- Function to sync stripe.subscriptions to public.users
CREATE OR REPLACE FUNCTION sync_subscription_to_user()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id uuid;
  v_tier text;
  v_monthly_limit int;
  v_price_id text;
BEGIN
  -- Log the trigger event
  RAISE NOTICE 'Stripe subscription trigger fired for subscription: %', NEW.id;

  -- Get user_id from subscription metadata
  -- Stripe Sync Engine stores metadata as JSONB
  v_user_id := (NEW.metadata->>'userId')::uuid;

  IF v_user_id IS NULL THEN
    RAISE WARNING 'No userId found in subscription metadata for subscription: %', NEW.id;
    RETURN NEW;
  END IF;

  RAISE NOTICE 'Processing subscription % for user %', NEW.id, v_user_id;

  -- Extract price ID from subscription items
  -- items is a JSONB array, get the first item's price
  SELECT (items->0->>'price')::text
  INTO v_price_id
  FROM jsonb_array_elements(NEW.items) AS items
  LIMIT 1;

  -- Determine tier based on subscription status
  -- During trial period, users get PAID access
  -- When active, users get PAID access
  -- When canceled/past_due, we keep access during grace period
  v_tier := CASE
    WHEN NEW.status IN ('active', 'trialing') THEN 'PAID'
    WHEN NEW.status IN ('past_due', 'unpaid') THEN 'PAID'  -- Keep access during grace period
    ELSE 'FREE'
  END;

  -- Determine monthly limit based on status and price
  -- TODO: Make this dynamic based on price_id from Stripe
  -- For now, PAID = 25 generations, FREE = 3 generations
  v_monthly_limit := CASE
    WHEN NEW.status IN ('active', 'trialing') THEN 25
    ELSE 3
  END;

  -- Update user record with subscription details
  UPDATE public.users
  SET
    -- Subscription tier and status
    subscription_tier = v_tier,
    subscription_status = NEW.status,

    -- Stripe identifiers
    stripe_customer_id = NEW.customer,
    stripe_subscription_id = NEW.id,
    stripe_price_id = v_price_id,

    -- Monthly generation limits
    monthly_generation_limit = v_monthly_limit,

    -- Subscription timestamps
    subscription_created_at = TO_TIMESTAMP(NEW.created),
    subscription_expires_at = CASE
      WHEN NEW.current_period_end IS NOT NULL
      THEN TO_TIMESTAMP(NEW.current_period_end)
      ELSE NULL
    END,

    -- Mark onboarding complete for new paid subscriptions
    -- Only update if not already completed AND this is an onboarding session
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
    END,

    -- Update timestamp
    updated_at = NOW()

  WHERE id = v_user_id;

  -- Check if update was successful
  IF NOT FOUND THEN
    RAISE WARNING 'User not found for userId: %', v_user_id;
  ELSE
    RAISE NOTICE '✅ Synced subscription % to user %: tier=%, status=%',
      NEW.id, v_user_id, v_tier, NEW.status;

    -- Log onboarding completion if it happened
    IF NEW.metadata->>'onboarding_session' = 'true' AND NEW.status IN ('active', 'trialing') THEN
      RAISE NOTICE '🎉 Onboarding completed for user: %', v_user_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS sync_subscription_on_change ON stripe.subscriptions;

-- Create trigger on stripe.subscriptions table
-- This fires AFTER any INSERT or UPDATE on stripe.subscriptions
CREATE TRIGGER sync_subscription_on_change
  AFTER INSERT OR UPDATE ON stripe.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION sync_subscription_to_user();

-- ============================================================================
-- Test the trigger (optional)
-- ============================================================================
--
-- To test this trigger manually:
--
-- 1. Insert a test subscription:
--    INSERT INTO stripe.subscriptions (id, customer, status, metadata, items, created)
--    VALUES (
--      'sub_test_123',
--      'cus_test_123',
--      'active',
--      '{"userId": "your-user-id-here", "onboarding_session": "true"}'::jsonb,
--      '[{"price": "price_test_123"}]'::jsonb,
--      EXTRACT(EPOCH FROM NOW())::bigint
--    );
--
-- 2. Check if user was updated:
--    SELECT subscription_tier, subscription_status, has_completed_onboarding
--    FROM public.users
--    WHERE id = 'your-user-id-here';
--
-- 3. Clean up:
--    DELETE FROM stripe.subscriptions WHERE id = 'sub_test_123';
--
-- ============================================================================

COMMENT ON FUNCTION sync_subscription_to_user() IS 'Automatically syncs Stripe subscription changes to public.users table';
COMMENT ON TRIGGER sync_subscription_on_change ON stripe.subscriptions IS 'Fires when Stripe Sync Engine updates subscription data';
