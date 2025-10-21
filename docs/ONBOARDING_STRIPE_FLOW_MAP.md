# TrueTone Newsletter: User Onboarding & Stripe Integration Flow Map

## Executive Summary

This document maps the complete user journey from signup through Kinde authentication, multi-step onboarding, Stripe payment integration, and dashboard activation. The system uses Kinde for authentication, Supabase for data persistence, and Stripe for subscription management.

---

## 1. File Structure Map (By Feature)

### 1.1 Authentication & User Creation
```
src/lib/api/auth.ts
├── getApiUser() - Retrieves Kinde user and creates DB user on first login
├── ApiUser interface - Type definitions for user data
└── Auto-creates user in Supabase on first Kinde login

src/app/api/auth/[kindeAuth]/route.ts
└── Kinde OAuth handler (minimal - delegates to Kinde library)

src/app/api/webhooks/kinde/route.ts
└── Kinde webhook endpoint (for future sync events)
```

### 1.2 Onboarding Flow
```
src/app/onboarding/
├── page.tsx - Server component that checks auth & onboarding status
├── layout.tsx - Layout wrapper for onboarding pages
├── onboarding-client.tsx - Client component managing step transitions
├── onboarding-layout-wrapper.tsx - Visual layout wrapper
├── onboarding-constants.ts - Step definitions (1-4)
└── success/page.tsx - Success page after completion

src/components/onboarding/
├── providers/
│   └── onboarding-provider.tsx - Context provider for state management
├── steps/
│   ├── welcome-step.tsx - Step 1: Introduction
│   ├── profile-details-step.tsx - Step 2: Phone & job title
│   ├── category-selection.tsx - Step 3: Loan category preferences
│   ├── subscription-step.tsx - Step 4: Plan selection
│   ├── voice-interview-step.tsx - Optional voice analysis
│   └── voice-analysis-results-step.tsx - Voice profile display
```

### 1.3 Stripe Integration
```
src/lib/stripe/
├── config.ts - Stripe SDK initialization & configuration
└── (subscription-guards.ts - Not yet implemented)

src/app/api/stripe/
├── checkout/route.ts - Create checkout session
├── webhook/route.ts - Handle Stripe events
└── portal/route.ts - Billing portal access (exists but not shown)
```

### 1.4 API Endpoints
```
src/app/api/user/
├── route.ts - GET user data (authenticated)
└── onboarding/route.ts - POST to complete onboarding

src/app/api/articles/
├── route.ts - GET articles for authenticated user
└── [id]/save/route.ts - Save article preference
```

### 1.5 Dashboard & Protected Routes
```
src/app/dashboard/
├── page.tsx - Main dashboard (displays user profile & articles)
└── (Protected by middleware)

src/middleware.ts - Route protection logic
```

---

## 2. User Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER SIGNUP → DASHBOARD                     │
└─────────────────────────────────────────────────────────────────┘

PHASE 1: AUTHENTICATION
=======================
1. User lands on homepage (/)
   └─> Click "Sign Up" → Redirected to Kinde login
   
2. Kinde OAuth Flow
   ├─> User authenticates with Kinde
   └─> Redirected back to app with auth token
   
3. First Access to Protected Route
   ├─> Middleware checks authentication
   ├─> Calls getApiUser() from /api/user
   ├─> If user doesn't exist in Supabase:
   │   └─> Create new user record with Kinde ID
   └─> Returns user object with onboarding status


PHASE 2: ONBOARDING (Steps 1-4)
================================
Middleware Routes: /onboarding → /dashboard based on status

Step 1: WELCOME SCREEN
├─ Route: /onboarding?step=1
├─ Component: WelcomeStep
├─ User Action: Click "Get Started"
└─ Next: Step 2

Step 2: PROFILE DETAILS
├─ Route: /onboarding?step=2
├─ Component: ProfileDetailsStep
├─ Form Fields:
│  ├─ firstName (disabled - from Kinde)
│  ├─ lastName (disabled - from Kinde)
│  ├─ email (disabled - from Kinde)
│  ├─ phone (required)
│  └─ jobTitle (required)
├─ Validation: Phone & jobTitle required
├─ User Action: Click "Continue"
└─ Next: Step 3

Step 3: CATEGORY PREFERENCES
├─ Route: /onboarding?step=3
├─ Component: CategorySelection
├─ Categories: Purchase, Refinance, FHA, VA, Conventional, Jumbo, First-Time Buyer, Investment
├─ Validation: At least one category required
├─ User Action: Click "Continue"
└─ Next: Step 4

Step 4: SUBSCRIPTION PLAN
├─ Route: /onboarding?step=4
├─ Component: SubscriptionStep
├─ Plan Options:
│  ├─ Free Trial ($0, 14 days)
│  ├─ Newsletter Pro ($29/month) ← Most popular
│  └─ Enterprise ($99/month)
└─ User Actions:
   ├─ "Start Free Trial" → completeOnboarding() → /onboarding/success
   ├─ "Choose Pro" → Creates Stripe checkout → Payment → /dashboard
   └─ "Choose Enterprise" → Creates Stripe checkout → Payment → /dashboard


PHASE 3: COMPLETION
====================

PATH A: FREE TRIAL
├─ Call: POST /api/user/onboarding
├─ Payload:
│  ├─ profileData (phone, jobTitle)
│  ├─ categoryPreferences
│  └─ billingData (billingType: 'free_trial')
├─ DB Update:
│  ├─ has_completed_onboarding = true
│  ├─ onboarding_step = 6
│  └─ onboarding_completed_at = now()
├─ Redirect: /onboarding/success
└─ Next: Go to Dashboard

PATH B: PAID PLAN
├─ Step 4a: Stripe Checkout Session
│  ├─ Call: POST /api/stripe/checkout
│  ├─ Create/Retrieve Stripe customer
│  ├─ Response: sessionId + checkout URL
│  └─ Redirect to Stripe checkout
│
├─ Step 4b: User Completes Payment (on Stripe.com)
│  ├─ Enters payment details
│  ├─ Confirms subscription
│  └─ Stripe redirects to success_url: /dashboard?session_id=...
│
├─ Step 4c: Stripe Webhook Handler
│  ├─ Event: checkout.session.completed
│  ├─ Webhook Handler: POST /api/stripe/webhook
│  ├─ Extracts userId from metadata or customer lookup
│  ├─ DB Updates (users table):
│  │  ├─ stripe_customer_id
│  │  ├─ stripe_subscription_id
│  │  ├─ subscription_tier = 'PAID'
│  │  ├─ subscription_status (from Stripe)
│  │  ├─ monthly_generation_limit = 25 (default)
│  │  └─ monthly_generations_used = 0
│  └─ Webhook returns 200 OK
│
└─ Complete onboarding via POST /api/user/onboarding
   ├─ Payload includes billingData (billingType: 'paid_plan')
   ├─ Sets has_completed_onboarding = true
   └─ User can now access dashboard


PHASE 4: DASHBOARD ACCESS
==========================
Middleware Check:
├─ User authenticated? YES
├─ has_completed_onboarding? YES
└─ Allow access to /dashboard

Dashboard Features (if user.subscription_tier !== 'FREE'):
├─ Article Feed
├─ TrueTone Profile Summary
│  ├─ tone_of_voice
│  ├─ formality
│  ├─ detail_orientation
│  ├─ vocabulary
│  └─ [8 total TrueTone settings]
└─ Monthly Generation Limit Display
```

---

## 3. Critical Code Locations (With Line Numbers)

### 3.1 User Authentication & Auto-Creation

**File:** `/Users/jarrettstanley/Desktop/websites/TrueToneAI-Newsletter/src/lib/api/auth.ts`

| Function | Lines | Purpose |
|----------|-------|---------|
| `getApiUser()` | 4-44 | Retrieves Kinde user from session, creates DB user if new |
| `ApiUser interface` | 46-95 | Type definitions for user data structure |

Key Logic (Lines 22-40):
```typescript
// Line 22-40: Auto-create user on first login
if (!user) {
  const { data: newUser } = await supabase
    .from('users')
    .insert({
      kinde_id: kindeUser.id,
      email: kindeUser.email,
      firstName: kindeUser.given_name || 'Not Set',
      lastName: kindeUser.family_name || 'Not Set',
      name: `${kindeUser.given_name || ''} ${kindeUser.family_name || ''}`.trim() || 'Not Set',
      status: 'pending'
    })
    .select()
    .single();
  return newUser;
}
```

### 3.2 Middleware Route Protection

**File:** `/Users/jarrettstanley/Desktop/websites/TrueToneAI-Newsletter/src/middleware.ts`

| Section | Lines | Purpose |
|---------|-------|---------|
| Protected Routes Config | 8-9 | Defines which routes require auth & onboarding |
| Auth Check | 17-24 | Verifies Kinde authentication |
| Onboarding Status Check | 28-48 | Redirects based on `has_completed_onboarding` |

Key Logic (Lines 40-47):
```typescript
// Line 40-42: If completed onboarding, redirect to dashboard
if (pathname.startsWith('/onboarding') && userData.has_completed_onboarding) {
  return NextResponse.redirect(new URL('/dashboard', req.url));
}

// Line 44-47: If not completed onboarding, redirect to onboarding
if (pathname.startsWith('/dashboard') && !userData.has_completed_onboarding) {
  return NextResponse.redirect(new URL('/onboarding', req.url));
}
```

### 3.3 Onboarding State Management

**File:** `/Users/jarrettstanley/Desktop/websites/TrueToneAI-Newsletter/src/components/onboarding/providers/onboarding-provider.tsx`

| Element | Lines | Purpose |
|---------|-------|---------|
| `OnboardingData interface` | 6-22 | Data structure for all onboarding fields |
| `OnboardingContextType` | 28-50 | Context API type definition |
| `completeOnboarding()` | 189-226 | POST to `/api/user/onboarding` endpoint |

Key Logic (Lines 189-226):
```typescript
// Line 192-213: API call to complete onboarding
const response = await fetch('/api/user/onboarding', {
  method: 'POST',
  body: JSON.stringify({
    profileData: { firstName, lastName, phone, title: jobTitle, company },
    transcript: data.transcript,
    analysisResults: data.voiceAnalysis,
    categoryPreferences: data.categoryPreferences,
    billingData: { selectedPlan, billingType },
  }),
});

// Line 216: Redirect to success page
if (response.ok) {
  router.push('/onboarding/success');
}
```

### 3.4 Onboarding API Completion

**File:** `/Users/jarrettstanley/Desktop/websites/TrueToneAI-Newsletter/src/app/api/user/onboarding/route.ts`

| Section | Lines | Purpose |
|---------|-------|---------|
| Auth Check | 6-12 | Verifies Kinde authentication |
| Request Parsing | 14-14 | Extracts onboarding data |
| DB Update | 19-53 | Updates user with profile & onboarding data |

Key Update Fields (Lines 38-48):
```typescript
has_completed_onboarding: true,
onboarding_step: 6,
onboarding_completed_at: new Date().toISOString(),
```

### 3.5 Subscription Step Flow

**File:** `/Users/jarrettstanley/Desktop/websites/TrueToneAI-Newsletter/src/components/onboarding/steps/subscription-step.tsx`

| Function | Lines | Purpose |
|----------|-------|---------|
| `handleSelectPlan()` | 13-35 | Routes to Stripe checkout or billing URL |
| `handleCompleteFreeTrial()` | 37-44 | Calls completeOnboarding() for free tier |

Key Logic (Lines 20-34):
```typescript
// Lines 20-34: For paid plans, redirect to Stripe checkout
if (planId) {
  updateData('selectedPlan', planId);
  updateData('billingType', planId === 'newsletter_enterprise' ? 'enterprise' : 'paid_plan');
}

const billingUrl = `${baseUrl}/api/auth/login?${billingParams.toString()}&post_login_redirect_url=...`;
window.location.href = billingUrl;
```

### 3.6 Stripe Checkout Session Creation

**File:** `/Users/jarrettstanley/Desktop/websites/TrueToneAI-Newsletter/src/app/api/stripe/checkout/route.ts`

| Section | Lines | Purpose |
|---------|-------|---------|
| Auth Check | 13-14 | Verifies user authentication |
| Customer Creation/Retrieval | 26-89 | Gets or creates Stripe customer |
| Checkout Session | 92-118 | Creates Stripe checkout session |

Key Session Creation (Lines 92-118):
```typescript
const session = await stripe.checkout.sessions.create({
  customer: customer.id,
  payment_method_types: ['card'],
  mode: 'subscription',
  line_items: [{
    price: process.env.STRIPE_PRICE_ID_PAID_TIER,
    quantity: 1,
  }],
  success_url: returnUrl || `${STRIPE_CONFIG.success_url}?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: STRIPE_CONFIG.cancel_url,
  metadata: {
    userId: user.id,
    kinde_id: user.kinde_id || '',
  },
});
```

### 3.7 Stripe Webhook Handler

**File:** `/Users/jarrettstanley/Desktop/websites/TrueToneAI-Newsletter/src/app/api/stripe/webhook/route.ts`

| Event Type | Lines | Purpose |
|-----------|-------|---------|
| `checkout.session.completed` | 73-115 | New subscription created - sets tier to PAID |
| `customer.subscription.updated` | 118-159 | Status/plan changed - updates tier |
| `customer.subscription.deleted` | 161-194 | Subscription canceled - downgrades to FREE |
| `invoice.payment_succeeded` | 196-222 | Recurring payment successful - confirms PAID |
| `invoice.payment_failed` | 224-249 | Payment failed - marks as past_due |

Key Update Logic (Lines 95-107):
```typescript
// Line 96-107: Update user with subscription info
const { error: updateError } = await supabase
  .from('users')
  .update({
    stripe_customer_id: session.customer as string,
    stripe_subscription_id: session.subscription as string,
    subscription_tier: 'PAID',
    subscription_status: subscription.status,
    monthly_generation_limit: monthlyLimit,
  })
  .eq('id', userId);
```

### 3.8 Success Page

**File:** `/Users/jarrettstanley/Desktop/websites/TrueToneAI-Newsletter/src/app/onboarding/success/page.tsx`

| Section | Lines | Purpose |
|---------|-------|---------|
| Loading State | 14-21 | Shows loader for 1.5 seconds |
| Success Display | 43-108 | Shows completion message & next steps |
| Dashboard Navigation | 89-95 | Button to navigate to dashboard |

---

## 4. Database Schema (Relevant Fields)

### User Table (`users`)

| Field | Type | Purpose | Set By |
|-------|------|---------|--------|
| `id` | UUID | Primary key | DB (auto-generated) |
| `kinde_id` | String | Kinde authentication ID | `getApiUser()` on signup |
| `firstName` | String | User's first name | Kinde (pre-filled) |
| `lastName` | String | User's last name | Kinde (pre-filled) |
| `email` | String | User's email (unique) | Kinde (pre-filled) |
| `name` | String | Full name | `getApiUser()` on signup |
| `cell_phone` | String | Phone number | Onboarding Step 2 |
| `title` | String | Job title | Onboarding Step 2 |
| `company` | String | Company name | Currently unused |
| `category_preferences` | String[] | Loan categories selected | Onboarding Step 3 |
| `has_completed_onboarding` | Boolean | Onboarding completion flag | POST `/api/user/onboarding` |
| `onboarding_step` | Int | Current step (1-6) | Onboarding flow |
| `onboarding_completed_at` | DateTime | Completion timestamp | Onboarding completion |
| `subscription_tier` | Enum | FREE / PAID / PREMIUM | Stripe webhook |
| `subscription_status` | String | Active / past_due / canceled | Stripe webhook |
| `monthly_generation_limit` | Int | AI generations per month | Stripe webhook (25 for PAID) |
| `monthly_generations_used` | Int | AI gens used this month | AI endpoint |
| `stripe_customer_id` | String | Stripe customer ID | POST `/api/stripe/checkout` |
| `stripe_subscription_id` | String | Stripe subscription ID | Stripe webhook |
| `stripe_price_id` | String | Stripe price ID | Stripe webhook |
| `tone_of_voice` | String | TrueTone setting | Voice analysis or manual |
| `formality` | String | TrueTone setting | Voice analysis or manual |
| `humor` | String | TrueTone setting | Voice analysis or manual |
| `emotional_expression` | String | TrueTone setting | Voice analysis or manual |
| `detail_orientation` | String | TrueTone setting | Voice analysis or manual |
| `vocabulary` | String | TrueTone setting | Voice analysis or manual |
| `content_length` | String | TrueTone setting | Voice analysis or manual |
| `engagement_style` | String | TrueTone setting | Voice analysis or manual |

---

## 5. State Flow & Data Movement

### 5.1 Onboarding State (Client-Side)

```typescript
OnboardingContext {
  data: OnboardingData {
    firstName: string (from Kinde)
    lastName: string (from Kinde)
    email: string (from Kinde)
    phone: string (user input - step 2)
    jobTitle: string (user input - step 2)
    categoryPreferences: string[] (user input - step 3)
    selectedPlan?: string (user input - step 4)
    billingType?: 'free_trial' | 'paid_plan' | 'enterprise' (step 4)
  }
  
  currentStep: number (1-4)
  isSubmitting: boolean
  errors: FormErrors
}
```

### 5.2 API Request: Complete Onboarding

```javascript
POST /api/user/onboarding
{
  profileData: {
    firstName: string,
    lastName: string,
    phone: string,
    title: string,
    company: string
  },
  transcript: string?,
  analysisResults: {
    persona: string,
    truetone_settings: Record<string, string>,
    key_insights: string[],
    confidence_score: number
  }?,
  categoryPreferences: string[],
  billingData: {
    selectedPlan: string?,
    billingType: 'free_trial' | 'paid_plan' | 'enterprise'
  }
}
```

### 5.3 Stripe Webhook Event: checkout.session.completed

```json
{
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_...",
      "customer": "cus_...",
      "subscription": "sub_...",
      "metadata": {
        "userId": "user-uuid",
        "kinde_id": "kinde-id"
      },
      "mode": "subscription"
    }
  }
}
```

---

## 6. Missing Pieces & Gaps

### 6.1 Critical Issues

1. **No Free Trial Enforcement**
   - Free trial billing type is set but never enforced
   - No field tracking trial expiration date
   - No logic to downgrade after 14 days

2. **Subscription Status Not Checked for Dashboard**
   - Dashboard doesn't verify active subscription
   - Paid users can access full features even if subscription expired
   - No "subscription expired" flow

3. **Voice Analysis Not Integrated**
   - Voice recording components exist (VoiceOnboardingInterview.tsx)
   - But NOT included in main onboarding flow (only 4 steps)
   - Voice analysis results not persisted to database

4. **Incomplete Stripe Error Handling**
   - No retry logic for failed webhook events
   - No manual webhook replay mechanism
   - Customer deletion edge case exists but might not be robust

### 6.2 Recommended Additions

1. **Onboarding Step 5: Voice Analysis (Optional)**
   - Move voice interview to full step with skip option
   - Persist voice_transcript & analysis results to DB
   - Show confidence score to user

2. **Subscription Guards Middleware**
   - Check subscription_status before allowing paid features
   - Show "Subscription Expired" message
   - Redirect to billing portal for renewal

3. **Trial Expiration Logic**
   - Add `trial_ends_at` field to users table
   - Cron job to downgrade users after 14 days
   - Email notifications 3 days & 1 day before expiry

4. **Webhook Failure Handling**
   - Store failed webhook events in database
   - Implement manual replay endpoint
   - Add exponential backoff retry logic

5. **Analytics & Monitoring**
   - Track conversion rate: signup → completed onboarding
   - Track plan selection distribution
   - Track payment success/failure rates
   - Monitor webhook latency

### 6.3 Code Quality Gaps

1. **No TypeScript Error in Stripe Checkout**
   - Line 4: `createClient()` is from Supabase but code uses it like database client
   - Should have type checking for customer object

2. **Hard-coded Magic Numbers**
   - Webhook: Monthly limit hardcoded as 25
   - Should be environment variable or subscription plan config

3. **No Payment Validation**
   - POST /api/stripe/checkout doesn't verify user balance
   - No price/plan validation before creating session

---

## 7. Key API Endpoints Reference

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/api/user` | Kinde | Get current user data |
| POST | `/api/user/onboarding` | Kinde | Complete onboarding |
| GET | `/api/articles` | Public | Get newsletter articles |
| POST | `/api/stripe/checkout` | Kinde | Create Stripe checkout |
| POST | `/api/stripe/webhook` | Stripe Signature | Handle Stripe events |
| GET | `/api/auth/[kindeAuth]` | N/A | Kinde OAuth handler |

---

## 8. Environment Variables Required

```bash
# Kinde Authentication
KINDE_ISSUER_URL=https://{your-org}.kinde.com
KINDE_CLIENT_ID={client-id}
KINDE_CLIENT_SECRET={client-secret}
KINDE_REDIRECT_URL=http://localhost:3000/api/auth/callback
KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_{key}
STRIPE_PRICE_ID_PAID_TIER=price_{id}
STRIPE_WEBHOOK_SECRET=whsec_{secret}

# Database
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# Application
NEXT_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

## 9. Testing Checklist

- [ ] Create Kinde account and authenticate
- [ ] First login auto-creates user in Supabase
- [ ] Complete all 4 onboarding steps without voice analysis
- [ ] Free trial path: No Stripe checkout
- [ ] Paid plan path: Redirect to Stripe checkout
- [ ] Complete payment in Stripe test mode
- [ ] Webhook received and user updated to PAID tier
- [ ] Redirect to success page then dashboard
- [ ] Dashboard shows TrueTone profile (empty initially)
- [ ] Try accessing /onboarding when already completed (redirect to /dashboard)
- [ ] Try accessing /dashboard before onboarding (redirect to /onboarding)

