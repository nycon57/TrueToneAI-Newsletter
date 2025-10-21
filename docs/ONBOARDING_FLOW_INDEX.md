# Onboarding & Stripe Integration - Complete Documentation Index

**Last Updated:** October 21, 2025  
**Project:** TrueTone Newsletter  
**Scope:** User signup through Kinde auth, 4-step onboarding, Stripe payment, dashboard activation

---

## Quick Links

### New to this flow?
Start with **FLOW_MAP_SUMMARY.md** (4 min read) for a quick overview of all 22 mapped files.

### Need visual diagrams?
See **FLOW_DIAGRAMS.md** for 7 ASCII diagrams showing the complete user journey, both payment paths, and webhook events.

### Need deep technical details?
Read **ONBOARDING_STRIPE_FLOW_MAP.md** for comprehensive documentation including:
- Line-by-line code references
- Database schema details
- API request/response formats
- Known issues and missing pieces

---

## Documentation Files

| File | Size | Purpose | Audience |
|------|------|---------|----------|
| **FLOW_MAP_SUMMARY.md** | 4 KB | High-level overview of all components | Product managers, new developers |
| **FLOW_DIAGRAMS.md** | 21 KB | ASCII flow diagrams for all paths | Visual learners, system architects |
| **ONBOARDING_STRIPE_FLOW_MAP.md** | 21 KB | Complete technical documentation | Backend engineers, integrators |
| **ONBOARDING_FLOW_INDEX.md** (this file) | - | Navigation guide | Everyone |

---

## The Complete Flow (One Sentence Each)

1. User clicks "Sign Up" → Redirected to Kinde OAuth
2. Kinde authenticates user → Redirects back to app
3. Middleware checks auth and onboarding status
4. If new user: Auto-created in Supabase with Kinde ID
5. If onboarding incomplete: User sent to /onboarding
6. 4-step onboarding: Welcome → Profile → Categories → Subscription
7. If free trial: Completes immediately, redirects to success page
8. If paid plan: Redirected to Stripe checkout
9. User completes payment on Stripe
10. Stripe sends webhook to /api/stripe/webhook
11. Webhook updates database with subscription details
12. User redirected to dashboard
13. Middleware allows access to /dashboard now that onboarding is complete

---

## 22 Files Mapped

### Authentication (3 files)
```
src/lib/api/auth.ts                          ← User auto-creation on first login
src/app/api/auth/[kindeAuth]/route.ts        ← Kinde OAuth handler
src/app/api/webhooks/kinde/route.ts          ← Kinde webhook (for future use)
```

### Onboarding (10 files)
```
src/app/onboarding/page.tsx                  ← Server component, auth check
src/app/onboarding/onboarding-client.tsx     ← Client component, step manager
src/app/onboarding/onboarding-constants.ts   ← Step definitions
src/app/onboarding/success/page.tsx          ← Completion confirmation
src/components/onboarding/providers/onboarding-provider.tsx  ← Context API
src/components/onboarding/steps/welcome-step.tsx           ← Step 1
src/components/onboarding/steps/profile-details-step.tsx   ← Step 2
src/components/onboarding/steps/category-selection.tsx     ← Step 3
src/components/onboarding/steps/subscription-step.tsx      ← Step 4
src/components/onboarding/steps/voice-*.tsx                ← Optional voice (not in flow)
```

### Stripe (3 files)
```
src/lib/stripe/config.ts                     ← Stripe SDK initialization
src/app/api/stripe/checkout/route.ts         ← Create checkout session
src/app/api/stripe/webhook/route.ts          ← Handle 5 webhook events
```

### API & Routes (4 files)
```
src/app/api/user/route.ts                    ← GET user (with caching)
src/app/api/user/onboarding/route.ts         ← POST complete onboarding
src/middleware.ts                            ← Route protection logic
src/app/dashboard/page.tsx                   ← Main dashboard (protected)
```

### Database (1 schema)
```
prisma/schema.prisma                         ← PostgreSQL schema (User table key)
```

---

## Critical Code Locations (Quick Reference)

| Function | File | Lines | Purpose |
|----------|------|-------|---------|
| `getApiUser()` | auth.ts | 4-44 | Auto-create user on first Kinde login |
| Middleware checks | middleware.ts | 40-47 | Route protection based on onboarding |
| `completeOnboarding()` | onboarding-provider.tsx | 189-226 | Post profile data to API |
| `handleSelectPlan()` | subscription-step.tsx | 13-35 | Route to Stripe or complete trial |
| Checkout creation | checkout/route.ts | 92-118 | Create Stripe session with customer |
| Webhook handler | webhook/route.ts | 73-249 | Handle 5 Stripe events |
| DB save | user/onboarding/route.ts | 19-53 | Save all onboarding data |

---

## Key Data Movement

### What data gets collected in onboarding?

| Field | Step | Required | Stored In |
|-------|------|----------|-----------|
| firstName | Kinde | No | users.firstName |
| lastName | Kinde | No | users.lastName |
| email | Kinde | No | users.email |
| phone | Step 2 | YES | users.cell_phone |
| jobTitle | Step 2 | YES | users.title |
| categories | Step 3 | YES | users.category_preferences |
| plan | Step 4 | YES | (not stored - only reflects UI choice) |

### What happens after payment?

| Field | Set By | Value | Purpose |
|-------|--------|-------|---------|
| subscription_tier | Stripe webhook | 'PAID' | Determines dashboard access level |
| subscription_status | Stripe webhook | 'active' or 'trialing' | Current subscription state |
| stripe_customer_id | Stripe webhook | cus_* | Track customer in Stripe |
| stripe_subscription_id | Stripe webhook | sub_* | Track subscription in Stripe |
| monthly_generation_limit | Stripe webhook | 25 | AI generation quota for month |
| has_completed_onboarding | Onboarding API | true | Unlock dashboard access |

---

## Two Payment Paths

### Path 1: Free Trial (Simple)
```
Step 4: Select "Start Free Trial"
    ↓
POST /api/user/onboarding (with billingType: 'free_trial')
    ↓
Database updated: has_completed_onboarding = true
    ↓
Redirect to /onboarding/success
    ↓
User can access /dashboard
```

### Path 2: Paid Plan (Complex)
```
Step 4: Select "Choose Pro" or "Choose Enterprise"
    ↓
Redirect to Stripe checkout page
    ↓
User enters payment details on Stripe.com
    ↓
Stripe redirects back to /dashboard
    ↓
Stripe sends webhook: checkout.session.completed
    ↓
Webhook handler updates database (subscription_tier = 'PAID')
    ↓
User can access /dashboard with premium features
    ↓
Optionally: POST /api/user/onboarding to finalize profile
```

---

## 5 Stripe Webhook Events Handled

| Event | What Happens | Line Range |
|-------|-----------|------------|
| `checkout.session.completed` | New subscription created, set to PAID | 73-115 |
| `customer.subscription.updated` | Status/plan changed, update tier | 118-159 |
| `customer.subscription.deleted` | Subscription canceled, downgrade to FREE | 161-194 |
| `invoice.payment_succeeded` | Recurring payment successful, confirm PAID | 196-222 |
| `invoice.payment_failed` | Payment failed, mark as past_due | 224-249 |

---

## Middleware Route Protection

Protected routes: `/dashboard` and `/onboarding`

| Scenario | Middleware Action |
|----------|-------------------|
| User not authenticated | Redirect to / (homepage) |
| User authenticated but onboarding incomplete | Redirect to /onboarding |
| User authenticated AND onboarding complete, accessing /onboarding | Redirect to /dashboard |
| User authenticated AND onboarding complete, accessing /dashboard | Allow access |
| Onboarding status check fails (DB error) | Log error, allow pass-through (graceful) |

---

## Missing Pieces (Known Gaps)

### Critical Issues
1. **No Free Trial Expiration Enforcement**
   - Free trial is set but never expires after 14 days
   - No field tracking trial end date
   - Solution: Add `trial_ends_at` field, implement cron job

2. **Dashboard Doesn't Check Active Subscription**
   - Users with expired/canceled subscriptions still see premium features
   - No "subscription expired" messaging
   - Solution: Add subscription status check middleware

3. **Voice Analysis Not Integrated**
   - Components exist but not included in main 4-step flow
   - Voice transcript not saved to database
   - Solution: Make it optional Step 5 with skip option

4. **Weak Webhook Error Handling**
   - No retry logic for failed webhooks
   - No way to manually replay failed webhooks
   - Solution: Store failed events, add replay endpoint

### Recommended Next Steps
1. Implement trial expiration logic
2. Add subscription guards middleware
3. Integrate optional voice analysis step
4. Improve webhook reliability
5. Add analytics tracking for conversions

---

## Environment Variables Required

### Kinde
- `KINDE_ISSUER_URL`
- `KINDE_CLIENT_ID`
- `KINDE_CLIENT_SECRET`
- `KINDE_REDIRECT_URL`

### Stripe
- `STRIPE_SECRET_KEY`
- `STRIPE_PRICE_ID_PAID_TIER`
- `STRIPE_WEBHOOK_SECRET`

### Database
- `DATABASE_URL`
- `DIRECT_URL`

### Application
- `NEXT_PUBLIC_URL`
- `NEXT_PUBLIC_BASE_URL`

---

## Testing Scenarios

- [ ] New user signup → User auto-created in DB
- [ ] Complete all 4 onboarding steps
- [ ] Select free trial → No Stripe redirect
- [ ] Select paid plan → Stripe checkout
- [ ] Complete Stripe payment
- [ ] Verify webhook received and processed
- [ ] Dashboard loads with premium features
- [ ] Try accessing /onboarding after completion → Redirects to /dashboard
- [ ] Try accessing /dashboard before onboarding → Redirects to /onboarding
- [ ] Logout and login again → Still at dashboard (persisted onboarding status)

---

## File Organization

```
docs/
├── ONBOARDING_FLOW_INDEX.md           ← Start here (this file)
├── FLOW_MAP_SUMMARY.md                ← Quick 4-min overview
├── FLOW_DIAGRAMS.md                   ← 7 ASCII flow diagrams
└── ONBOARDING_STRIPE_FLOW_MAP.md      ← Complete technical details

src/
├── lib/
│   ├── api/auth.ts                    ← User creation
│   └── stripe/config.ts               ← Stripe setup
├── app/
│   ├── api/
│   │   ├── auth/[kindeAuth]/route.ts  ← Kinde OAuth
│   │   ├── stripe/checkout/route.ts   ← Checkout
│   │   ├── stripe/webhook/route.ts    ← Webhooks
│   │   └── user/onboarding/route.ts   ← Save profile
│   ├── onboarding/
│   │   ├── page.tsx
│   │   ├── onboarding-client.tsx
│   │   ├── onboarding-constants.ts
│   │   └── success/page.tsx
│   ├── dashboard/page.tsx             ← Main app
│   └── middleware.ts                  ← Route protection
└── components/onboarding/
    ├── providers/onboarding-provider.tsx
    └── steps/
        ├── welcome-step.tsx
        ├── profile-details-step.tsx
        ├── category-selection.tsx
        └── subscription-step.tsx

prisma/
└── schema.prisma                      ← User table schema
```

---

## For Questions or Clarifications

Refer to:
- **"How does the user get created?"** → See `src/lib/api/auth.ts` lines 22-40
- **"What happens after payment?"** → See `src/app/api/stripe/webhook/route.ts` lines 73-115
- **"Where is onboarding saved?"** → See `src/app/api/user/onboarding/route.ts` lines 19-53
- **"How does middleware protect routes?"** → See `src/middleware.ts` lines 40-47
- **"What are the 4 onboarding steps?"** → See `src/app/onboarding/onboarding-constants.ts`
- **"What database fields are used?"** → See section "Database Schema (Relevant Fields)" in ONBOARDING_STRIPE_FLOW_MAP.md

---

**Document Version:** 1.0  
**Thoroughly Mapped Files:** 22  
**API Endpoints Documented:** 6  
**Webhook Events:** 5  
**Database Tables:** 1 (User table)

