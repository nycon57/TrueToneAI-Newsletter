# Onboarding & Stripe Flow - Quick Summary

Generated: October 21, 2025

## Key Files (22 files mapped)

### Authentication (3 files)
- `src/lib/api/auth.ts` - User auto-creation on first Kinde login
- `src/app/api/auth/[kindeAuth]/route.ts` - Kinde OAuth handler
- `src/app/api/webhooks/kinde/route.ts` - Kinde webhook endpoint

### Onboarding Flow (10 files)
- `src/app/onboarding/page.tsx` - Server component with auth check
- `src/app/onboarding/onboarding-client.tsx` - Client state manager
- `src/app/onboarding/onboarding-constants.ts` - Step definitions
- `src/app/onboarding/success/page.tsx` - Success page
- `src/components/onboarding/providers/onboarding-provider.tsx` - Context API
- `src/components/onboarding/steps/welcome-step.tsx` - Step 1
- `src/components/onboarding/steps/profile-details-step.tsx` - Step 2
- `src/components/onboarding/steps/category-selection.tsx` - Step 3
- `src/components/onboarding/steps/subscription-step.tsx` - Step 4
- `src/components/onboarding/steps/voice-*.tsx` - Optional (not in flow)

### Stripe Integration (3 files)
- `src/lib/stripe/config.ts` - Stripe SDK setup
- `src/app/api/stripe/checkout/route.ts` - Create checkout session
- `src/app/api/stripe/webhook/route.ts` - Handle 5 webhook events

### API Endpoints (2 files)
- `src/app/api/user/route.ts` - GET user data
- `src/app/api/user/onboarding/route.ts` - POST completion

### Route Protection (2 files)
- `src/middleware.ts` - Auth & onboarding checks
- `src/app/dashboard/page.tsx` - Main dashboard

## 4-Step Onboarding Flow

```
Step 1 (Welcome)
    ↓
Step 2 (Profile: phone, jobTitle)
    ↓
Step 3 (Categories: select ≥1 category)
    ↓
Step 4 (Subscription: Free Trial vs Paid)
    ├─→ FREE TRIAL → Completes immediately
    └─→ PAID → Redirects to Stripe → Payment → Webhook → Completes
```

## Critical Database Fields

User table fields set during flow:
- `kinde_id` - Set at signup
- `firstName`, `lastName`, `email` - Set at signup (from Kinde)
- `cell_phone`, `title` - Set at step 2
- `category_preferences` - Set at step 3
- `has_completed_onboarding` - Set at completion
- `subscription_tier` - Set by Stripe webhook (PAID) or step 4 (FREE)
- `stripe_customer_id`, `stripe_subscription_id` - Set by Stripe webhook
- `monthly_generation_limit` - Set to 25 by Stripe webhook (PAID tier)

## Important Files with Line Numbers

| File | Key Section | Lines |
|------|-------------|-------|
| auth.ts | Auto-create user | 22-40 |
| middleware.ts | Route redirects | 40-47 |
| onboarding-provider.tsx | Complete flow | 189-226 |
| subscription-step.tsx | Plan selection | 13-44 |
| checkout/route.ts | Stripe session | 92-118 |
| webhook/route.ts | Event handling | 73-249 |
| onboarding/route.ts | DB save | 19-53 |

## Known Issues to Address

1. No free trial expiration enforcement (14-day limit not enforced)
2. Dashboard doesn't check if subscription is active
3. Voice analysis components exist but not integrated into main flow
4. Webhook error handling is basic (no retry/replay)
5. Hard-coded magic numbers (monthly limit = 25)

## Recommended Next Steps

1. **Implement Trial Expiration**
   - Add `trial_ends_at` field to users table
   - Add cron job to downgrade expired trials

2. **Add Subscription Guards**
   - Check subscription status before allowing paid features
   - Show expiration warnings

3. **Integrate Voice Analysis**
   - Make it an optional Step 5
   - Allow skip option
   - Persist results to database

4. **Improve Error Handling**
   - Add webhook failure tracking
   - Implement manual replay endpoint

5. **Add Monitoring**
   - Track conversion rates
   - Monitor payment failures
   - Log webhook latency

## Testing Quick Links

- Homepage: `http://localhost:3000/`
- Onboarding: `http://localhost:3000/onboarding` (after signup)
- Dashboard: `http://localhost:3000/dashboard` (after completing onboarding)
- Kinde test user setup required

See ONBOARDING_STRIPE_FLOW_MAP.md for complete detailed documentation.
