# Stripe Checkout Flow Diagrams

## Current Flow (BROKEN) 🔴

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Kinde
    participant Database

    User->>Frontend: Click "Choose Pro Plan"
    Frontend->>Frontend: handleSelectPlan('newsletter_pro')
    Frontend->>Frontend: updateData('selectedPlan', 'newsletter_pro')
    Frontend->>Frontend: Build Kinde auth URL
    Frontend->>Kinde: Redirect to /api/auth/login?plan=newsletter_pro
    Kinde->>Kinde: Authenticate user
    Kinde->>Frontend: Redirect to /onboarding/success
    Frontend->>User: Show success page
    Note over User,Database: ❌ NO PAYMENT HAPPENED
    Note over User,Database: ❌ NO VERIFICATION
    User->>Frontend: Click "Go to Dashboard"
    Frontend->>User: Show dashboard with FREE features
    Note over User,Database: 🚨 SECURITY BUG: User can access app without paying
```

### What's Wrong:
1. **No Stripe Checkout** - Never calls `/api/stripe/checkout`
2. **No Payment** - User never enters credit card
3. **No Verification** - Success page doesn't check payment
4. **No Webhook** - Database never updated with subscription
5. **Critical Security Flaw** - Users can access paid features without paying

---

## Proposed Flow (FIXED) ✅

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant CheckoutAPI as /api/stripe/checkout
    participant Stripe
    participant WebhookAPI as /api/stripe/webhook
    participant VerifyAPI as /api/stripe/verify-session
    participant OnboardingAPI as /api/user/onboarding
    participant Database

    User->>Frontend: Click "Choose Pro Plan"
    Frontend->>Frontend: Map plan to priceId
    Note over Frontend: newsletter_pro → price_1SAcEp...

    Frontend->>CheckoutAPI: POST { priceId, returnUrl }
    CheckoutAPI->>Database: Get/Create Stripe customer
    CheckoutAPI->>Stripe: Create checkout session
    Stripe-->>CheckoutAPI: { sessionId, url }
    CheckoutAPI-->>Frontend: { sessionId, url }

    Frontend->>Stripe: Redirect to checkout.url
    Stripe->>User: Show checkout page
    User->>Stripe: Enter payment details
    User->>Stripe: Click "Subscribe"
    Stripe->>Stripe: Process payment

    par Async Webhook Flow
        Stripe->>WebhookAPI: POST webhook event
        Note over Stripe,WebhookAPI: Event: checkout.session.completed
        WebhookAPI->>WebhookAPI: Verify signature
        WebhookAPI->>Stripe: Retrieve subscription details
        Stripe-->>WebhookAPI: { subscription, priceId }
        WebhookAPI->>Database: Update user
        Note over Database: subscription_tier = 'PAID'<br/>subscription_status = 'active'<br/>monthly_limit = 25<br/>stripe_price_id = priceId
        WebhookAPI-->>Stripe: 200 OK
    and Sync User Redirect
        Stripe->>Frontend: Redirect to success_url?session_id=xxx
        Frontend->>VerifyAPI: GET ?session_id=xxx
        VerifyAPI->>Stripe: Retrieve session
        Stripe-->>VerifyAPI: { payment_status: 'paid', customer, subscription }
        VerifyAPI->>VerifyAPI: Verify customer matches user
        VerifyAPI->>Database: Get user subscription
        Database-->>VerifyAPI: { tier, status, limit }
        VerifyAPI-->>Frontend: { verified: true, session, userSubscription }
        Frontend->>User: Show verified success message
    end

    User->>Frontend: Click "Complete Onboarding"
    Frontend->>OnboardingAPI: POST onboarding data
    OnboardingAPI->>Database: Verify subscription exists
    Database-->>OnboardingAPI: subscription_status = 'active'
    OnboardingAPI->>Database: Save preferences & complete
    OnboardingAPI-->>Frontend: { success: true }
    Frontend->>User: Redirect to dashboard
    User->>Frontend: Access dashboard
    Frontend->>User: Show PAID features (25 generations/month)
```

### Why This Works:
1. ✅ **Real Stripe Checkout** - User enters payment on Stripe.com
2. ✅ **Payment Verification** - Backend verifies payment completed
3. ✅ **Webhook Updates DB** - Subscription data synced to database
4. ✅ **Session Verification** - Success page confirms payment before proceeding
5. ✅ **Secure** - Cannot bypass payment to access features

---

## Free Trial Flow ✅

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant OnboardingAPI as /api/user/onboarding
    participant Database

    User->>Frontend: Click "Start Free Trial"
    Frontend->>Frontend: handleCompleteFreeTrial()
    Frontend->>Frontend: updateData('selectedPlan', 'free_trial')
    Frontend->>Frontend: updateData('billingType', 'free_trial')

    Frontend->>OnboardingAPI: POST onboarding data
    Note over Frontend,OnboardingAPI: billingType = 'free_trial'
    OnboardingAPI->>OnboardingAPI: Skip subscription verification
    OnboardingAPI->>Database: Save preferences
    Note over Database: subscription_tier = 'FREE'<br/>monthly_limit = 3<br/>has_completed_onboarding = true
    OnboardingAPI-->>Frontend: { success: true }

    Frontend->>User: Redirect to /onboarding/success
    Note over Frontend: No session_id parameter
    Frontend->>User: Show success message
    User->>Frontend: Click "Go to Dashboard"
    Frontend->>User: Show dashboard (FREE tier, 3 generations/month)
```

---

## Webhook Event Handling 🔔

```mermaid
sequenceDiagram
    participant Stripe
    participant WebhookAPI as /api/stripe/webhook
    participant Database

    Note over Stripe,Database: Event: checkout.session.completed
    Stripe->>WebhookAPI: POST webhook
    WebhookAPI->>WebhookAPI: Verify signature
    WebhookAPI->>WebhookAPI: Extract userId from metadata
    WebhookAPI->>Stripe: Retrieve subscription
    Stripe-->>WebhookAPI: { subscription, items, priceId }
    WebhookAPI->>Database: UPDATE users SET<br/>subscription_tier='PAID'<br/>subscription_status='active'<br/>monthly_limit=25<br/>stripe_price_id=priceId
    WebhookAPI-->>Stripe: 200 OK

    Note over Stripe,Database: Event: customer.subscription.updated
    Stripe->>WebhookAPI: POST webhook
    WebhookAPI->>WebhookAPI: Verify signature & extract userId
    WebhookAPI->>Stripe: Get subscription details
    Stripe-->>WebhookAPI: { status, priceId }
    WebhookAPI->>Database: UPDATE users SET<br/>subscription_status=status<br/>monthly_limit=getLimit(priceId)
    WebhookAPI-->>Stripe: 200 OK

    Note over Stripe,Database: Event: customer.subscription.deleted
    Stripe->>WebhookAPI: POST webhook
    WebhookAPI->>WebhookAPI: Verify signature & extract userId
    WebhookAPI->>Database: UPDATE users SET<br/>subscription_tier='FREE'<br/>subscription_status='canceled'<br/>monthly_limit=3<br/>stripe_subscription_id=NULL
    WebhookAPI-->>Stripe: 200 OK

    Note over Stripe,Database: Event: invoice.payment_failed
    Stripe->>WebhookAPI: POST webhook
    WebhookAPI->>WebhookAPI: Verify signature & extract userId
    WebhookAPI->>Database: UPDATE users SET<br/>subscription_status='past_due'
    WebhookAPI-->>Stripe: 200 OK
```

---

## Session Verification Flow 🔍

```mermaid
sequenceDiagram
    participant Frontend
    participant VerifyAPI as /api/stripe/verify-session
    participant Auth as getApiUser()
    participant Stripe
    participant Database

    Frontend->>VerifyAPI: GET ?session_id=cs_test_xxx
    VerifyAPI->>Auth: Verify user authenticated
    Auth-->>VerifyAPI: User { id, stripe_customer_id }

    VerifyAPI->>Stripe: Retrieve session (session_id)
    Stripe-->>VerifyAPI: Session { customer, payment_status, subscription }

    VerifyAPI->>VerifyAPI: Verify customer === user.stripe_customer_id
    alt Customer mismatch
        VerifyAPI-->>Frontend: 404 Not Found
    else Customer matches
        VerifyAPI->>VerifyAPI: Check payment_status
        alt Payment not completed
            VerifyAPI-->>Frontend: 402 Payment Required
        else Payment completed
            VerifyAPI->>Database: Get user subscription
            Database-->>VerifyAPI: { tier, status, limit }
            VerifyAPI->>Stripe: Get subscription details
            Stripe-->>VerifyAPI: { priceId, status }
            VerifyAPI-->>Frontend: { verified: true, session, userSubscription }
        end
    end
```

---

## Error Handling Flow ❌

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant CheckoutAPI
    participant Stripe

    Note over User,Stripe: Scenario 1: Payment Declined
    User->>Frontend: Click "Choose Pro Plan"
    Frontend->>CheckoutAPI: POST checkout
    CheckoutAPI->>Stripe: Create session
    Stripe-->>CheckoutAPI: { sessionId, url }
    Frontend->>Stripe: Redirect to checkout
    User->>Stripe: Enter declined card
    Stripe->>User: Show error "Card declined"
    User->>Stripe: Try again or cancel
    alt Retry
        User->>Stripe: Enter valid card
        Stripe->>Frontend: Redirect to success
    else Cancel
        Stripe->>Frontend: Redirect to cancel_url
        Frontend->>User: Return to plan selection
    end

    Note over User,Stripe: Scenario 2: Session Expired
    Frontend->>CheckoutAPI: POST checkout
    CheckoutAPI->>Stripe: Create session
    Stripe-->>CheckoutAPI: { sessionId, url }
    User->>User: Wait 25+ hours
    User->>Stripe: Try to access checkout URL
    Stripe->>User: Show "Session expired"
    User->>Frontend: Start over

    Note over User,Stripe: Scenario 3: Invalid Session Verification
    User->>Frontend: Navigate to /success?session_id=invalid
    Frontend->>CheckoutAPI: GET verify-session?session_id=invalid
    CheckoutAPI->>Stripe: Retrieve session
    Stripe-->>CheckoutAPI: 404 Not Found
    CheckoutAPI-->>Frontend: 404 Not Found
    Frontend->>User: Show error "Invalid session"
    Frontend->>User: Provide "Try Again" button

    Note over User,Stripe: Scenario 4: Webhook Processing Delay
    User->>Stripe: Complete payment
    Stripe->>Frontend: Redirect to success immediately
    Frontend->>CheckoutAPI: Verify session
    CheckoutAPI->>Stripe: Get session (payment confirmed)
    Note over CheckoutAPI,Database: Webhook hasn't processed yet
    CheckoutAPI->>Database: Query user (subscription_tier still FREE)
    CheckoutAPI-->>Frontend: { verified: true } (from Stripe session)
    Frontend->>User: Show success (based on Stripe, not DB)
    Note over Stripe,Database: Webhook processes 2 seconds later
    Stripe->>Database: Update subscription_tier='PAID'
```

---

## Multi-Tier Support Flow 📊

```mermaid
graph TD
    A[User on Subscription Step] --> B{Select Plan}

    B --> C[Free Trial]
    B --> D[Newsletter Pro<br/>$19.95/mo]
    B --> E[Enterprise Monthly<br/>$199/mo]
    B --> F[Enterprise Yearly<br/>$1,990/yr]

    C --> C1[No Stripe<br/>Direct to onboarding]
    C1 --> C2[subscription_tier: FREE<br/>monthly_limit: 3]

    D --> D1[Stripe Checkout<br/>price_1SAcEp...]
    D1 --> D2[subscription_tier: PAID<br/>monthly_limit: 25]

    E --> E1[Stripe Checkout<br/>price_1RXRUR...]
    E1 --> E2[subscription_tier: PAID<br/>monthly_limit: 100]

    F --> F1[Stripe Checkout<br/>price_1RXRUR...Vd]
    F1 --> F2[subscription_tier: PAID<br/>monthly_limit: 100]

    C2 --> G[Complete Onboarding]
    D2 --> G
    E2 --> G
    F2 --> G

    G --> H[Dashboard]

    style C fill:#e8f5e9
    style D fill:#fff3e0
    style E fill:#fce4ec
    style F fill:#f3e5f5
    style C2 fill:#e8f5e9
    style D2 fill:#fff3e0
    style E2 fill:#fce4ec
    style F2 fill:#f3e5f5
```

---

## API Endpoint Relationships 🔗

```mermaid
graph LR
    A[Frontend] --> B[POST /api/stripe/checkout]
    B --> C[Stripe API]
    C --> D[Checkout Session]
    D --> E[User Payment]

    E --> F[Webhook Event]
    F --> G[POST /api/stripe/webhook]
    G --> H[(Database)]

    E --> I[Redirect to Success]
    I --> J[GET /api/stripe/verify-session]
    J --> C
    J --> H

    K[Success Page] --> L[POST /api/user/onboarding]
    L --> H

    style B fill:#bbdefb
    style G fill:#c8e6c9
    style J fill:#fff9c4
    style L fill:#ffccbc
```

---

## State Diagram: Subscription Status 🔄

```mermaid
stateDiagram-v2
    [*] --> FREE: User signs up

    FREE --> CHECKOUT: Click paid plan
    CHECKOUT --> PAID_ACTIVE: Payment succeeds
    CHECKOUT --> FREE: Payment fails/canceled

    PAID_ACTIVE --> PAID_TRIALING: Start trial
    PAID_TRIALING --> PAID_ACTIVE: Trial ends, payment succeeds

    PAID_ACTIVE --> PAST_DUE: Payment fails
    PAST_DUE --> PAID_ACTIVE: Payment retries succeed
    PAST_DUE --> CANCELED: Max retries failed

    PAID_ACTIVE --> CANCELED: User cancels
    PAID_TRIALING --> CANCELED: User cancels
    CANCELED --> FREE: Downgrade to free tier

    note right of FREE
        monthly_limit: 3
        stripe_subscription_id: null
    end note

    note right of PAID_ACTIVE
        monthly_limit: 25 or 100
        subscription_status: 'active'
        stripe_subscription_id: sub_xxx
    end note

    note right of PAST_DUE
        monthly_limit: same
        subscription_status: 'past_due'
        Access may be restricted
    end note
```

---

## Database Schema Flow 📊

```mermaid
erDiagram
    USERS ||--o{ STRIPE_SESSIONS : has
    USERS ||--o{ STRIPE_SUBSCRIPTIONS : has

    USERS {
        uuid id PK
        string kinde_id
        string stripe_customer_id
        string stripe_subscription_id
        string stripe_price_id
        enum subscription_tier
        string subscription_status
        int monthly_generation_limit
        int monthly_generations_used
        timestamp subscription_created_at
    }

    STRIPE_SESSIONS {
        string id PK
        string customer_id FK
        string subscription_id
        string payment_status
        int amount_total
        timestamp created_at
    }

    STRIPE_SUBSCRIPTIONS {
        string id PK
        string customer_id FK
        string price_id
        string status
        timestamp current_period_start
        timestamp current_period_end
    }

    WEBHOOKS ||--o{ USERS : updates

    WEBHOOKS {
        string event_type
        timestamp processed_at
        json event_data
    }
```

---

## Security Checks Flow 🔒

```mermaid
flowchart TD
    A[API Request] --> B{Authenticated?}
    B -->|No| C[401 Unauthorized]
    B -->|Yes| D{Valid Session ID?}
    D -->|No| E[404 Not Found]
    D -->|Yes| F[Retrieve from Stripe]
    F --> G{Customer Matches User?}
    G -->|No| H[404 Not Found<br/>Prevent Session Theft]
    G -->|Yes| I{Payment Status?}
    I -->|unpaid| J[402 Payment Required]
    I -->|paid| K{Webhook Signature Valid?}
    K -->|No| L[400 Bad Request<br/>Prevent Spoofing]
    K -->|Yes| M{Price ID Whitelisted?}
    M -->|No| N[400 Bad Request<br/>Prevent Price Manipulation]
    M -->|Yes| O[✅ Proceed with Request]

    style C fill:#ffcdd2
    style E fill:#ffcdd2
    style H fill:#ffcdd2
    style J fill:#ffe0b2
    style L fill:#ffcdd2
    style N fill:#ffcdd2
    style O fill:#c8e6c9
```

---

## Testing Flow Chart 🧪

```mermaid
flowchart TD
    A[Start Testing] --> B[Setup Stripe CLI]
    B --> C[stripe listen --forward-to localhost:3000/api/stripe/webhook]
    C --> D{Test Scenario}

    D -->|Happy Path| E[Test Pro Plan Purchase]
    E --> E1[Click Choose Pro]
    E1 --> E2[Redirected to Stripe]
    E2 --> E3[Enter 4242 4242 4242 4242]
    E3 --> E4[Complete Payment]
    E4 --> E5[Webhook Received?]
    E5 -->|Yes| E6[DB Updated?]
    E6 -->|Yes| E7[Success Page Verified?]
    E7 -->|Yes| E8[✅ PASS]
    E7 -->|No| E9[❌ FAIL]
    E6 -->|No| E9
    E5 -->|No| E9

    D -->|Payment Decline| F[Test Card Decline]
    F --> F1[Enter 4000 0000 0000 0002]
    F1 --> F2[Payment Declined?]
    F2 -->|Yes| F3[Error Message Shown?]
    F3 -->|Yes| F4[✅ PASS]
    F3 -->|No| F5[❌ FAIL]
    F2 -->|No| F5

    D -->|Session Manipulation| G[Test Invalid Session]
    G --> G1[Navigate to /success?session_id=fake]
    G1 --> G2[API Returns 404?]
    G2 -->|Yes| G3[Error Shown?]
    G3 -->|Yes| G4[✅ PASS]
    G3 -->|No| G5[❌ FAIL]
    G2 -->|No| G5

    D -->|Free Trial| H[Test Free Trial Flow]
    H --> H1[Click Start Free Trial]
    H1 --> H2[No Stripe Redirect?]
    H2 -->|Yes| H3[Onboarding Completed?]
    H3 -->|Yes| H4[Tier = FREE?]
    H4 -->|Yes| H5[✅ PASS]
    H4 -->|No| H6[❌ FAIL]
    H3 -->|No| H6
    H2 -->|No| H6

    E8 --> Z[All Tests Complete]
    F4 --> Z
    G4 --> Z
    H5 --> Z
    E9 --> Z
    F5 --> Z
    G5 --> Z
    H6 --> Z

    style E8 fill:#c8e6c9
    style F4 fill:#c8e6c9
    style G4 fill:#c8e6c9
    style H5 fill:#c8e6c9
    style E9 fill:#ffcdd2
    style F5 fill:#ffcdd2
    style G5 fill:#ffcdd2
    style H6 fill:#ffcdd2
```

---

## Deployment Flow 🚀

```mermaid
flowchart LR
    A[Local Development] --> B[Test with Stripe CLI]
    B --> C{All Tests Pass?}
    C -->|No| D[Fix Issues]
    D --> B
    C -->|Yes| E[Commit Changes]
    E --> F[Deploy to Staging]
    F --> G[Configure Staging Webhook]
    G --> H[Test on Staging]
    H --> I{Staging Tests Pass?}
    I -->|No| J[Debug Issues]
    J --> H
    I -->|Yes| K[Deploy to Production]
    K --> L[Configure Production Webhook]
    L --> M[Monitor Logs]
    M --> N[Monitor Stripe Dashboard]
    N --> O{Issues Detected?}
    O -->|Yes| P[Rollback or Hotfix]
    P --> M
    O -->|No| Q[✅ Deployment Complete]

    style A fill:#e3f2fd
    style F fill:#fff3e0
    style K fill:#fce4ec
    style Q fill:#c8e6c9
```

---

## Documentation Map 📚

```
STRIPE_CHECKOUT_API_DESIGN.md (Full Design)
├── Executive Summary
├── Current State Analysis
│   ├── subscription-step.tsx (BROKEN)
│   ├── /api/stripe/checkout (UNUSED)
│   ├── /api/stripe/webhook (WORKING)
│   ├── success/page.tsx (NO VERIFICATION)
│   └── /api/user/onboarding (NO CHECKS)
├── Proposed Architecture
│   ├── API Flow Diagram
│   └── Endpoint Specifications
├── Implementation Plan
│   ├── Phase 1: Backend APIs
│   ├── Phase 2: Frontend Integration
│   ├── Phase 3: Testing
│   └── Phase 4: Monitoring
└── Security Considerations

STRIPE_CHECKOUT_QUICK_REFERENCE.md (Quick Ref)
├── TL;DR
├── API Endpoints Summary
├── Frontend Changes Summary
├── Environment Variables
├── Testing Commands
└── Implementation Checklist

STRIPE_FLOW_DIAGRAMS.md (This File)
├── Current Flow (BROKEN)
├── Proposed Flow (FIXED)
├── Free Trial Flow
├── Webhook Event Handling
├── Session Verification Flow
├── Error Handling Flow
├── Multi-Tier Support
├── State Diagrams
└── Testing Flow
```

---

## Quick Reference: File Locations

```
📁 /Users/jarrettstanley/Desktop/websites/TrueToneAI-Newsletter/

Backend APIs:
├── src/app/api/stripe/
│   ├── checkout/route.ts           ← UPDATE (accept priceId)
│   ├── verify-session/route.ts     ← CREATE (new endpoint)
│   └── webhook/route.ts            ← UPDATE (multi-tier support)
└── src/app/api/user/onboarding/route.ts  ← UPDATE (verify subscription)

Frontend:
├── src/components/onboarding/steps/
│   └── subscription-step.tsx       ← UPDATE (call checkout API)
└── src/app/onboarding/success/page.tsx   ← UPDATE (verify session)

Database:
└── prisma/migrations/
    └── xxx_add_price_id.sql        ← CREATE (add stripe_price_id column)

Documentation:
└── docs/
    ├── STRIPE_CHECKOUT_API_DESIGN.md      ← Full design doc
    ├── STRIPE_CHECKOUT_QUICK_REFERENCE.md ← Quick reference
    └── STRIPE_FLOW_DIAGRAMS.md            ← This file
```

---

## Next Steps

1. **Review** these diagrams with team
2. **Approve** the proposed architecture
3. **Implement** Phase 1 (Backend APIs)
4. **Test** with Stripe CLI
5. **Deploy** to staging
6. **Monitor** and iterate

---

*For detailed implementation instructions, see `/docs/STRIPE_CHECKOUT_API_DESIGN.md`*
*For quick command reference, see `/docs/STRIPE_CHECKOUT_QUICK_REFERENCE.md`*
