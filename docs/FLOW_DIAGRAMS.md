# User Flow Diagrams - Visual Reference

## 1. Complete User Journey (Signup to Dashboard)

```
┌─────────────────────────────────────────────────────────────────────┐
│                   TRUETONE NEWSLETTER USER JOURNEY                  │
└─────────────────────────────────────────────────────────────────────┘

                            [HOMEPAGE]
                                │
                         Click "Sign Up"
                                │
                  ┌─────────────▼──────────────┐
                  │   Kinde OAuth Login        │
                  │   (External Auth Provider) │
                  └─────────────┬──────────────┘
                                │
                         User Authenticates
                                │
                  ┌─────────────▼──────────────┐
                  │   Redirect to App          │
                  │   Auth Token Created       │
                  └─────────────┬──────────────┘
                                │
                   ┌────────────▼─────────────┐
                   │  Middleware Check        │
                   │  (Auth Protected Routes) │
                   └────────────┬─────────────┘
                                │
                  ┌─────────────▼──────────────┐
                  │  GET /api/user            │
                  │  (Fetch from Supabase)    │
                  └─────────────┬──────────────┘
                                │
                        ┌───────▼────────┐
                        │  User Exists?  │
                        └───┬────────┬───┘
                            │        │
                          YES│       │NO
                            │        │
                    ┌────────▼──┐  ┌─▼──────────┐
                    │ Existing  │  │ CREATE NEW │
                    │ User      │  │ USER       │
                    └────────────┘  └─┬──────────┘
                            │         │
                            └────┬────┘
                                 │
                    ┌────────────▼────────────┐
                    │ Check onboarding_status │
                    │ (Database Field)        │
                    └────────────┬────────────┘
                                 │
                        ┌────────▼────────┐
                        │ Completed Yet?  │
                        └───┬─────────┬───┘
                            │         │
                         YES│        │NO
                            │         │
                    ┌───────▼──┐   ┌─▼────────────┐
                    │ Dashboard│   │ ONBOARDING   │
                    │ Allowed  │   │ Flow (4 steps)
                    └──────────┘   └──────────────┘
```

## 2. Onboarding Flow (4 Steps)

```
                         [ONBOARDING START]
                                │
                ┌───────────────▼────────────────┐
                │  STEP 1: Welcome Screen        │
                │  ┌──────────────────────────┐  │
                │  │ Info on what's upcoming  │  │
                │  │ Click "Get Started"      │  │
                │  └──────────────────────────┘  │
                └───────────────┬────────────────┘
                                │
                ┌───────────────▼────────────────┐
                │  STEP 2: Profile Details       │
                │  ┌──────────────────────────┐  │
                │  │ First Name (disabled)    │  │
                │  │ Last Name (disabled)     │  │
                │  │ Email (disabled)         │  │
                │  │ Phone (required)         │  │
                │  │ Job Title (required)     │  │
                │  │ [Back] [Continue]        │  │
                │  └──────────────────────────┘  │
                │  Validation: Both required     │
                └───────────────┬────────────────┘
                                │
                ┌───────────────▼────────────────┐
                │  STEP 3: Category Preferences  │
                │  ┌──────────────────────────┐  │
                │  │ [x] Purchase             │  │
                │  │ [x] Refinance            │  │
                │  │ [ ] FHA                  │  │
                │  │ [x] VA                   │  │
                │  │ [ ] Conventional         │  │
                │  │ [ ] Jumbo                │  │
                │  │ [x] First-Time Buyer     │  │
                │  │ [ ] Investment Property  │  │
                │  │ [Back] [Continue]        │  │
                │  └──────────────────────────┘  │
                │  Validation: ≥1 category      │
                └───────────────┬────────────────┘
                                │
                ┌───────────────▼────────────────┐
                │  STEP 4: Select Plan           │
                │  ┌──────────────────────────┐  │
                │  │ Free Trial: $0 (14 days) │  │
                │  │ [Start Free Trial]       │  │
                │  │                          │  │
                │  │ Pro: $29/month ⭐        │  │
                │  │ [Choose Pro]             │  │
                │  │                          │  │
                │  │ Enterprise: $99/month    │  │
                │  │ [Choose Enterprise]      │  │
                │  │ [Back]                   │  │
                │  └──────────────────────────┘  │
                └───────────┬──────────────┬─────┘
                            │              │
                  ┌─────────▼──┐  ┌──────▼─────────┐
                  │ FREE TRIAL │  │  PAID PLAN     │
                  └──────┬─────┘  └────────┬────────┘
```

## 3. Free Trial Path

```
    [Free Trial Selected]
           │
    ┌──────▼──────┐
    │ POST /api/  │
    │ user/       │
    │ onboarding  │
    └──────┬──────┘
           │
    ┌──────▼──────────────────┐
    │ DB Update:              │
    │ ├─ Phone & Job Title    │
    │ ├─ Categories           │
    │ ├─ has_completed_       │
    │ │  onboarding = true    │
    │ └─ onboarding_completed_│
    │    at = now()           │
    └──────┬──────────────────┘
           │
    ┌──────▼──────────┐
    │ Redirect to     │
    │ /onboarding/    │
    │ success         │
    └──────┬──────────┘
           │
    ┌──────▼──────────────┐
    │ Success Page        │
    │ [Go to Dashboard]   │
    └──────┬──────────────┘
           │
    ┌──────▼──────────┐
    │ /dashboard      │
    │ (USER ACTIVE)   │
    └─────────────────┘
```

## 4. Paid Plan Path (Complex)

```
    [Paid Plan Selected]
           │
           ├─> Pro ($29/month)
           │    updateData('selectedPlan', 'newsletter_pro')
           │    updateData('billingType', 'paid_plan')
           │
           └─> Enterprise ($99/month)
                updateData('selectedPlan', 'newsletter_enterprise')
                updateData('billingType', 'enterprise')
           │
    ┌──────▼────────────────────────┐
    │ Redirect to Kinde Billing URL  │
    │ /api/auth/login?               │
    │  plan=newsletter_pro&           │
    │  post_login_redirect_url=/      │
    │  onboarding/success            │
    └──────┬───────────────────────────┘
           │
    ┌──────▼────────────────────────┐
    │ USER TAKEN TO STRIPE.COM       │
    │ (Stripe Checkout Page)         │
    │ ├─ Customer created/retrieved  │
    │ ├─ Checkout session created    │
    │ └─ Payment details entered     │
    └──────┬────────────────────────────┘
           │
    ┌──────▼────────────────────────┐
    │ Payment Processing            │
    │ (Card validation, authorization)
    └──────┬────────────────────────────┘
           │
    ┌──────┴────────────────────────┐
    │                               │
 ✓ SUCCESS                       ✗ FAILED
 │                                │
┌▼──────────────────┐    ┌────────▼──────┐
│ Stripe creates:   │    │ Redirect to   │
│ ├─ Customer       │    │ cancel_url    │
│ ├─ Subscription   │    │ (onboarding)  │
│ └─ Redirects to:  │    └───────────────┘
│  success_url      │
│ /dashboard?       │
│ session_id=...    │
└──────┬────────────┘
       │
┌──────▼──────────────────────────┐
│ WEBHOOK EVENT FIRED:            │
│ checkout.session.completed      │
│ (From Stripe → Our Server)      │
│                                 │
│ POST /api/stripe/webhook        │
└──────┬──────────────────────────┘
       │
┌──────▼──────────────────────────┐
│ Verify Webhook Signature        │
│ (Security Check)                │
└──────┬──────────────────────────┘
       │
┌──────▼──────────────────────────┐
│ Extract:                        │
│ ├─ userId from metadata         │
│ ├─ customer_id from Stripe      │
│ └─ subscription_id from Stripe  │
└──────┬──────────────────────────┘
       │
┌──────▼──────────────────────────┐
│ UPDATE DATABASE (users):        │
│ ├─ stripe_customer_id           │
│ ├─ stripe_subscription_id       │
│ ├─ subscription_tier = 'PAID'   │
│ ├─ subscription_status          │
│ └─ monthly_generation_limit=25  │
└──────┬──────────────────────────┘
       │
┌──────▼──────────────────────────┐
│ Return 200 OK to Stripe         │
│ (Confirm Receipt)               │
└──────┬──────────────────────────┘
       │
       └─> User still on /dashboard
           (Page loads showing new tier)
           
           OR user completes onboarding:
           
┌──────────────────────────────────┐
│ POST /api/user/onboarding        │
│ (Client submits profile data)    │
└──────┬───────────────────────────┘
       │
┌──────▼───────────────────────────┐
│ UPDATE DATABASE (users):         │
│ ├─ Phone & Job Title             │
│ ├─ Categories                    │
│ ├─ has_completed_onboarding=true │
│ └─ TrueTone settings             │
└──────┬───────────────────────────┘
       │
┌──────▼───────────────────────────┐
│ Redirect to                      │
│ /onboarding/success              │
└──────┬───────────────────────────┘
       │
┌──────▼───────────────────────────┐
│ Success Page                     │
│ [Go to Dashboard]                │
└──────┬───────────────────────────┘
       │
┌──────▼──────────────────────────┐
│ /dashboard                       │
│ (Fully Active - PAID TIER)       │
└────────────────────────────────┘
```

## 5. Middleware Route Protection

```
┌────────────────────────────────────────┐
│ User Accesses Any Route                │
└────────────────┬───────────────────────┘
                 │
         ┌───────▼────────┐
         │ Is Protected?  │
         │ (/dashboard,   │
         │  /onboarding)  │
         └───┬────────┬───┘
             │        │
            YES      NO
             │        │
       ┌─────▼─┐  ┌──▼─────────┐
       │ Check │  │ Allow Pass  │
       │ Auth  │  │ (public)    │
       └──┬────┘  └─────────────┘
          │
   ┌──────▼───────┐
   │ Authenticated?
   └──┬────┬──────┘
      │    │
     YES   NO
      │    └──> Redirect to /
      │        (Homepage)
      │
   ┌──▼────────────────────┐
   │ Check onboarding      │
   │ status in DB          │
   └──┬───┬────┬──────┬───┘
      │   │    │      │
      │   │    │      └─> Error → Log & Redirect /
      │   │    │
      │   │    └─> Error on API call → Assume incomplete → Pass through
      │   │
      │   └─> Status = incomplete
      │
      └─> Status = complete
             │
    ┌────────┴─────────┐
    │                  │
 On /onboarding     On /dashboard
    │                  │
    └─> Redirect to ─┬─▼────────────┐
       /dashboard    │ Allow Access  │
                     │ (Premium!)    │
                     └───────────────┘
```

## 6. Stripe Webhook Events Handled

```
Stripe → POST /api/stripe/webhook

┌─────────────────────────────────────┐
│ 1. checkout.session.completed       │
│    (New subscription started)        │
│    Action: Set tier='PAID'           │
│    Webhook: Lines 73-115             │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 2. customer.subscription.updated     │
│    (Plan changed/renewed)            │
│    Action: Update status & tier      │
│    Webhook: Lines 118-159            │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 3. customer.subscription.deleted     │
│    (Subscription canceled)           │
│    Action: Downgrade to FREE         │
│    Webhook: Lines 161-194            │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 4. invoice.payment_succeeded         │
│    (Recurring payment successful)    │
│    Action: Confirm PAID status       │
│    Webhook: Lines 196-222            │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 5. invoice.payment_failed            │
│    (Payment failed)                  │
│    Action: Mark as past_due          │
│    Webhook: Lines 224-249            │
└─────────────────────────────────────┘
```

## 7. Data Flow: Onboarding → Database

```
OnboardingContext (Client)
    │
    ├─ firstName: string (from Kinde)
    ├─ lastName: string (from Kinde)
    ├─ email: string (from Kinde)
    ├─ phone: string ◄── User input (Step 2)
    ├─ jobTitle: string ◄── User input (Step 2)
    ├─ categoryPreferences: string[] ◄── User input (Step 3)
    ├─ selectedPlan?: string ◄── User input (Step 4)
    └─ billingType?: enum ◄── User input (Step 4)
         │
         └─> completeOnboarding()
              │
              POST /api/user/onboarding
              │
              └─> Database (Supabase)
                   │
                   ├─ firstName (updated)
                   ├─ lastName (updated)
                   ├─ cell_phone = phone
                   ├─ title = jobTitle
                   ├─ category_preferences = categoryPreferences[]
                   ├─ has_completed_onboarding = true
                   ├─ onboarding_step = 6
                   ├─ onboarding_completed_at = ISO timestamp
                   └─ [TrueTone fields if voice analysis]
```

