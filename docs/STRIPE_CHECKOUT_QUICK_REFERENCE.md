# Stripe Checkout API - Quick Reference

## TL;DR - What's Broken

**Current Flow:** User clicks "Choose Pro Plan" → Redirects to Kinde auth → Success page → **NO PAYMENT HAPPENS**

**Fixed Flow:** User clicks "Choose Pro Plan" → POST /api/stripe/checkout → Stripe Checkout → Payment → Webhook updates DB → Success page verifies → Complete onboarding

---

## Critical Findings

### The Bug
- **File:** `src/components/onboarding/steps/subscription-step.tsx` (line 33)
- **Problem:** Redirects to `/api/auth/login` instead of Stripe Checkout
- **Impact:** Users can access paid features without paying

### What Exists But Never Gets Called
- `/api/stripe/checkout` - Properly implemented but unused
- `/api/stripe/webhook` - Configured but rarely receives events

### What's Missing
- `/api/stripe/verify-session` - Need to verify payment on success page
- Session verification on success page
- Subscription validation before onboarding completion

---

## API Endpoints Summary

### 1. POST /api/stripe/checkout (UPDATE)

**Current:**
```typescript
// Uses hardcoded env var
price: process.env.STRIPE_PRICE_ID_PAID_TIER
```

**Fixed:**
```typescript
// Accept priceId from frontend
const { priceId, returnUrl } = await req.json();
price: priceId  // Validate against allowed IDs
```

**Frontend Call:**
```typescript
const response = await fetch('/api/stripe/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    priceId: 'price_1SAcEpCezhgJ3dc1rGAyaylW',
    returnUrl: '/onboarding/success'
  })
});

const { url } = await response.json();
window.location.href = url; // Redirect to Stripe
```

---

### 2. GET /api/stripe/verify-session (NEW)

**Purpose:** Verify payment completed before showing success

**Request:**
```
GET /api/stripe/verify-session?session_id=cs_test_abc123
```

**Response:**
```json
{
  "verified": true,
  "session": {
    "id": "cs_test_abc123",
    "payment_status": "paid",
    "amount_total": 1995,
    "customer": "cus_xyz"
  },
  "userSubscription": {
    "tier": "PAID",
    "status": "active",
    "monthlyLimit": 25
  }
}
```

**Frontend Call:**
```typescript
useEffect(() => {
  const sessionId = searchParams.get('session_id');
  if (!sessionId) return;

  const verify = async () => {
    const response = await fetch(
      `/api/stripe/verify-session?session_id=${sessionId}`
    );
    const data = await response.json();

    if (data.verified) {
      setShowSuccess(true);
    } else {
      setShowError(data.error);
    }
  };

  verify();
}, []);
```

---

### 3. POST /api/stripe/webhook (UPDATE)

**Changes Needed:**

```typescript
// Add support for multiple price IDs
function getMonthlyLimitFromPrice(priceId: string): number {
  const limits = {
    [process.env.STRIPE_PRICE_ID_PRO]: 25,
    [process.env.STRIPE_PRICE_ID_ENTERPRISE]: 100,
  };
  return limits[priceId] || 25;
}

// Store price ID in database
await supabase.from('users').update({
  stripe_price_id: priceId,  // NEW
  monthly_generation_limit: getMonthlyLimitFromPrice(priceId),
  // ... other fields
});
```

---

## Frontend Changes Summary

### subscription-step.tsx

**Replace this broken code:**
```typescript
// BROKEN - redirects to Kinde
const billingUrl = `${baseUrl}/api/auth/login?plan=${planId}`;
window.location.href = billingUrl;
```

**With this working code:**
```typescript
// FIXED - calls Stripe checkout
const priceId = PLAN_PRICE_IDS[planId];

const response = await fetch('/api/stripe/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ priceId, returnUrl: '/onboarding/success' })
});

const { url } = await response.json();
window.location.href = url; // Redirect to Stripe Checkout
```

---

### onboarding/success/page.tsx

**Replace this fake loading:**
```typescript
// BROKEN - no verification
useEffect(() => {
  const timer = setTimeout(() => setLoading(false), 1500);
  return () => clearTimeout(timer);
}, []);
```

**With real session verification:**
```typescript
// FIXED - verify payment
useEffect(() => {
  const sessionId = searchParams.get('session_id');
  if (!sessionId) {
    setVerification({ verified: true }); // Free trial
    return;
  }

  const verify = async () => {
    const res = await fetch(`/api/stripe/verify-session?session_id=${sessionId}`);
    const data = await res.json();
    setVerification(data);
    setLoading(false);
  };

  verify();
}, []);
```

---

## Payment Flow Diagram

```
┌────────────────────────────────────────────────────────┐
│                  COMPLETE FLOW                          │
└────────────────────────────────────────────────────────┘

1. User clicks "Choose Pro Plan"
        ↓
2. POST /api/stripe/checkout
   { priceId: "price_xxx", returnUrl: "/success" }
        ↓
3. Returns { sessionId, url }
        ↓
4. Redirect to Stripe Checkout (url)
        ↓
5. User enters payment on Stripe
        ↓
6A. Webhook (async)              6B. User redirect (sync)
    → POST /api/stripe/webhook       → /success?session_id=xxx
    → Update user in DB              → GET /api/stripe/verify-session
    → Set tier, limits               → Verify payment_status = paid
                                     → Show success message
        ↓
7. User clicks "Complete Onboarding"
        ↓
8. POST /api/user/onboarding
   → Verify subscription exists
   → Save preferences
   → Mark complete
        ↓
9. Redirect to /dashboard
```

---

## Environment Variables

```bash
# Required (existing)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_URL=http://localhost:3000

# Required (new)
STRIPE_PRICE_ID_PRO=price_1SAcEpCezhgJ3dc1rGAyaylW        # $19.95/mo
STRIPE_PRICE_ID_ENTERPRISE=price_1RXRURCezhgJ3dc1AQVWSZsu # $199/mo

# Public (new - for frontend)
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO=price_1SAcEpCezhgJ3dc1rGAyaylW
NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE=price_1RXRURCezhgJ3dc1AQVWSZsu
```

---

## Database Migration

```sql
-- Add price_id column
ALTER TABLE users
ADD COLUMN stripe_price_id VARCHAR(255);

-- Add index
CREATE INDEX idx_users_stripe_subscription
ON users(stripe_subscription_id);
```

---

## Testing Commands

```bash
# 1. Start Stripe webhook listener
stripe listen --forward-to localhost:3000/api/stripe/webhook

# 2. Test checkout creation
curl -X POST http://localhost:3000/api/stripe/checkout \
  -H "Content-Type: application/json" \
  -H "Cookie: your-auth-cookie" \
  -d '{
    "priceId": "price_1SAcEpCezhgJ3dc1rGAyaylW",
    "returnUrl": "/onboarding/success"
  }'

# 3. Trigger test webhook event
stripe trigger checkout.session.completed

# 4. Test payment verification (after checkout)
curl "http://localhost:3000/api/stripe/verify-session?session_id=cs_test_xxx"
```

---

## Test Cards

```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
Insufficient: 4000 0000 0000 9995
3D Secure: 4000 0025 0000 3155
```

---

## Implementation Checklist

### Backend
- [ ] Create `/api/stripe/verify-session/route.ts`
- [ ] Update `/api/stripe/checkout/route.ts` to accept priceId
- [ ] Update `/api/stripe/webhook/route.ts` price mapping
- [ ] Update `/api/user/onboarding/route.ts` subscription check
- [ ] Run database migration

### Frontend
- [ ] Update `subscription-step.tsx` to call checkout API
- [ ] Update `success/page.tsx` to verify session
- [ ] Add error states for failed payments
- [ ] Add loading states during verification
- [ ] Update env variables

### Testing
- [ ] Test Pro plan purchase flow
- [ ] Test Enterprise plan purchase flow
- [ ] Test free trial flow
- [ ] Test payment decline
- [ ] Test session manipulation
- [ ] Test webhook processing

### Deployment
- [ ] Deploy backend changes
- [ ] Update production env vars
- [ ] Configure Stripe webhook endpoint
- [ ] Deploy frontend changes
- [ ] Monitor webhook logs
- [ ] Monitor checkout sessions

---

## Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "Session not found" | Invalid session_id | Check URL param, verify session exists |
| "Payment verification failed" | Webhook didn't process | Wait a few seconds, retry verification |
| "Subscription not active" | Webhook failed | Check webhook logs, manual update |
| "Invalid price ID" | Price not in whitelist | Add to ALLOWED_PRICE_IDS array |
| "Unauthorized" | Not logged in | Verify authentication cookie |

---

## Files to Modify

```
Backend (5 files):
✓ src/app/api/stripe/checkout/route.ts          (UPDATE)
✓ src/app/api/stripe/verify-session/route.ts    (CREATE)
✓ src/app/api/stripe/webhook/route.ts           (UPDATE)
✓ src/app/api/user/onboarding/route.ts          (UPDATE)
✓ prisma/migrations/xxx_add_price_id.sql        (CREATE)

Frontend (2 files):
✓ src/components/onboarding/steps/subscription-step.tsx  (UPDATE)
✓ src/app/onboarding/success/page.tsx                    (UPDATE)

Config (1 file):
✓ .env                                           (UPDATE)
```

---

## Resources

- Full Design Doc: `/docs/STRIPE_CHECKOUT_API_DESIGN.md`
- Stripe Checkout Docs: https://stripe.com/docs/payments/checkout
- Stripe Testing: https://stripe.com/docs/testing
- Webhook Guide: https://stripe.com/docs/webhooks
