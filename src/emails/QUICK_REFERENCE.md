# Email Service Quick Reference

Quick reference for using the TrueTone Insights email service.

## Import

```typescript
import {
  // Send functions
  sendWelcome,
  sendSupportConfirmation,
  sendSubscriptionCreated,
  sendPaymentSuccessful,
  // ... etc

  // Template registry
  EMAIL_TEMPLATES,

  // Validation
  isValidEmail,
  validateRecipients,

  // Errors
  EmailValidationError,
  EmailSendError,
} from '@/emails';
```

## Common Use Cases

### Welcome New User

```typescript
const result = await sendWelcome({
  to: user.email,
  name: user.name,
  onboardingUrl: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding`,
});
```

### Support Request

```typescript
// To user
await sendSupportConfirmation({
  to: user.email,
  name: user.name,
  referenceNumber: `SUP-${Date.now()}`,
  subject: formData.subject,
  category: formData.category,
  message: formData.message,
});

// To support team
await sendSupportNotification({
  to: process.env.SUPPORT_EMAIL!,
  userName: user.name,
  userEmail: user.email,
  userTier: user.subscription,
  referenceNumber: `SUP-${Date.now()}`,
  subject: formData.subject,
  category: formData.category,
  message: formData.message,
});
```

### Subscription Created (Stripe Webhook)

```typescript
await sendSubscriptionCreated({
  to: customer.email,
  name: customer.name,
  planName: subscription.items.data[0].price.nickname,
  price: subscription.items.data[0].price.unit_amount!,
  nextBillingDate: new Date(subscription.current_period_end * 1000),
  features: ['AI Chat', 'Priority Support'],
});
```

### Payment Successful

```typescript
await sendPaymentSuccessful({
  to: customer.email,
  name: customer.name,
  amount: invoice.amount_paid,
  invoiceUrl: invoice.hosted_invoice_url,
  nextBillingDate: new Date(invoice.next_payment_attempt! * 1000),
  receiptNumber: invoice.number,
});
```

### Payment Failed

```typescript
await sendPaymentFailed({
  to: customer.email,
  name: customer.name,
  amount: invoice.amount_due,
  attemptCount: invoice.attempt_count,
  nextRetryDate: new Date(invoice.next_payment_attempt! * 1000),
  updatePaymentUrl: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
});
```

## Validation

```typescript
import { isValidEmail, validateRecipients } from '@/emails';

// Check single email
if (!isValidEmail(email)) {
  return { error: 'Invalid email' };
}

// Validate and sanitize multiple
const validEmails = validateRecipients([
  email1,
  email2,
  email3,
]);
```

## Error Handling

```typescript
import {
  isEmailValidationError,
  isEmailSendError,
  formatErrorForLogging,
} from '@/emails';

try {
  const result = await sendWelcome(data);

  if (!result.success) {
    console.error('Failed to send email:', result.error);
    // Don't throw - email failure shouldn't block user flow
  }
} catch (error) {
  if (isEmailValidationError(error)) {
    return { error: 'Invalid email address' };
  }

  console.error('Unexpected error:', formatErrorForLogging(error));
}
```

## Testing

```bash
# Test single template
npm run email:test welcome

# Test with custom email
npm run email:test welcome -- --to=your@email.com

# Test all templates
npm run email:test:all

# Check deliverability
npm run email:deliverability
```

## Template Registry

```typescript
import { EMAIL_TEMPLATES, isMarketingEmail } from '@/emails';

// Use template IDs
EMAIL_TEMPLATES.WELCOME
EMAIL_TEMPLATES.SUBSCRIPTION_CREATED
EMAIL_TEMPLATES.PAYMENT_SUCCESSFUL

// Check if marketing email (needs unsubscribe)
if (isMarketingEmail(EMAIL_TEMPLATES.RE_ENGAGEMENT)) {
  // Add unsubscribe link
}
```

## Environment Variables

Required in `.env`:

```bash
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=hello@yourdomain.com
RESEND_FROM_NAME=Your Company Name
SUPPORT_EMAIL=support@yourdomain.com
```

## Helper Functions

All available send functions:

- `sendWelcome()` - Welcome email
- `sendOnboardingComplete()` - Onboarding done
- `sendSupportConfirmation()` - Support request confirmation
- `sendSupportNotification()` - Notify support team
- `sendSubscriptionCreated()` - Subscription started
- `sendPaymentSuccessful()` - Payment received
- `sendPaymentFailed()` - Payment failed
- `sendSubscriptionCancelled()` - Subscription cancelled
- `sendTrialExpiring()` - Trial ending soon

## Return Type

All send functions return:

```typescript
interface SendEmailResult {
  success: boolean;
  id?: string;        // Resend email ID if successful
  error?: string;     // Error message if failed
}
```

## Best Practices

1. ✅ Always use helper functions instead of `sendEmail()` directly
2. ✅ Check `result.success` but don't throw on failure
3. ✅ Validate emails before sending
4. ✅ Use environment variables for URLs
5. ✅ Include tags for analytics
6. ✅ Test templates before deploying
7. ✅ Monitor deliverability metrics

## Common Mistakes

❌ **Don't throw on email failure**
```typescript
// Bad - this will crash your app
const result = await sendWelcome(data);
if (!result.success) throw new Error(result.error);

// Good - log and continue
if (!result.success) {
  console.error('Email failed:', result.error);
  // Continue app flow
}
```

❌ **Don't use dollars for prices**
```typescript
// Bad
price: 29.99

// Good - always use cents
price: 2999
```

❌ **Don't forget to validate**
```typescript
// Bad
await sendWelcome({ to: userInput, name });

// Good
if (!isValidEmail(userInput)) {
  return { error: 'Invalid email' };
}
await sendWelcome({ to: userInput, name });
```

## Need More Info?

- Full documentation: `src/emails/README.md`
- Implementation details: `EMAIL_SERVICE_IMPLEMENTATION_SUMMARY.md`
- Environment setup: `.env.example`
- Test examples: `scripts/test-emails.ts`

---

*Quick Reference v1.0 - October 21, 2025*
