# TrueTone Insights Email Service

Production-ready email service infrastructure using Resend and React Email for the TrueTone Insights platform.

## Overview

This email service provides a complete solution for sending transactional, notification, and marketing emails with built-in error handling, retry logic, and comprehensive validation.

## Features

- **Type-Safe**: Full TypeScript support with strict type checking
- **Error Handling**: Custom error classes with detailed error information
- **Retry Logic**: Automatic retry with exponential backoff for transient failures
- **Validation**: Comprehensive email validation and sanitization
- **Template Registry**: Centralized template management
- **Production Ready**: Environment validation, logging, and monitoring

## Directory Structure

```
src/emails/
├── service/                  # Core email service layer
│   ├── resend.ts            # Resend client configuration
│   ├── templates.ts         # Template registry and types
│   └── send.ts              # Email sending functions
├── templates/               # React Email templates (to be created)
│   ├── _components/         # Shared email components
│   ├── support-confirmation.tsx
│   ├── support-notification.tsx
│   ├── welcome.tsx
│   ├── onboarding-complete.tsx
│   ├── subscription-created.tsx
│   ├── payment-successful.tsx
│   ├── payment-failed.tsx
│   ├── subscription-cancelled.tsx
│   └── trial-expiring.tsx
└── utils/                   # Utility functions
    ├── validation.ts        # Email validation utilities
    ├── errors.ts            # Custom error classes
    └── unsubscribe.ts       # Unsubscribe handling
```

## Environment Variables

Required environment variables for the email service:

```bash
# Resend API Configuration
RESEND_API_KEY=re_xxx              # Your Resend API key
RESEND_FROM_EMAIL=hello@yourdomain.com  # Verified sender email
RESEND_FROM_NAME=Your Company Name # Sender display name

# Support Configuration
SUPPORT_EMAIL=support@yourdomain.com    # Support team email

# Optional
RESEND_AUDIENCE_ID=xxx             # For audience management
```

## Usage

### Basic Email Sending

```typescript
import { sendEmail } from '@/emails/service/send';
import { MyEmailTemplate } from '@/emails/templates/my-email';

const result = await sendEmail({
  to: 'user@example.com',
  subject: 'Welcome!',
  template: MyEmailTemplate({ name: 'John' }),
  tags: [
    { name: 'category', value: 'onboarding' },
  ],
});

if (result.success) {
  console.log('Email sent:', result.id);
} else {
  console.error('Failed to send email:', result.error);
}
```

### Using Helper Functions

The service provides type-safe helper functions for common email types:

#### Support Confirmation Email

```typescript
import { sendSupportConfirmation } from '@/emails/service/send';

const result = await sendSupportConfirmation({
  to: 'user@example.com',
  name: 'John Doe',
  referenceNumber: 'SUP-2024-001',
  subject: 'Billing Question',
  category: 'billing',
  message: 'How do I update my payment method?',
  expectedResponseTime: '24-48 hours',
});
```

#### Support Notification (to Admin)

```typescript
import { sendSupportNotification } from '@/emails/service/send';

const result = await sendSupportNotification({
  to: 'support@yourcompany.com',
  userName: 'John Doe',
  userEmail: 'user@example.com',
  userTier: 'Pro',
  referenceNumber: 'SUP-2024-001',
  subject: 'Billing Question',
  category: 'billing',
  message: 'How do I update my payment method?',
  userId: 'user_123',
});
```

#### Welcome Email

```typescript
import { sendWelcome } from '@/emails/service/send';

const result = await sendWelcome({
  to: 'user@example.com',
  name: 'John Doe',
  quickStartSteps: [
    {
      title: 'Complete your profile',
      description: 'Add your preferences and interests',
    },
    {
      title: 'Explore features',
      description: 'Check out our AI-powered insights',
    },
  ],
  onboardingUrl: 'https://app.yoursite.com/onboarding',
});
```

#### Subscription Created Email

```typescript
import { sendSubscriptionCreated } from '@/emails/service/send';

const result = await sendSubscriptionCreated({
  to: 'user@example.com',
  name: 'John Doe',
  planName: 'Pro Plan',
  price: 2999, // in cents
  nextBillingDate: new Date('2024-02-01'),
  features: ['AI Chat', 'Priority Support', 'Advanced Analytics'],
});
```

#### Payment Successful Email

```typescript
import { sendPaymentSuccessful } from '@/emails/service/send';

const result = await sendPaymentSuccessful({
  to: 'user@example.com',
  name: 'John Doe',
  amount: 2999, // in cents
  invoiceUrl: 'https://invoice.stripe.com/...',
  nextBillingDate: new Date('2024-03-01'),
  receiptNumber: 'RCPT-2024-001',
});
```

#### Payment Failed Email

```typescript
import { sendPaymentFailed } from '@/emails/service/send';

const result = await sendPaymentFailed({
  to: 'user@example.com',
  name: 'John Doe',
  amount: 2999, // in cents
  attemptCount: 1,
  nextRetryDate: new Date('2024-02-05'),
  updatePaymentUrl: 'https://app.yoursite.com/billing',
});
```

## Email Templates

All email templates should be created in the `templates/` directory using React Email components.

### Template Structure

```tsx
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
} from '@react-email/components';
import { EmailLayout } from './_components/EmailLayout';
import { EmailButton } from './_components/EmailButton';

interface MyEmailProps {
  name: string;
  actionUrl?: string;
}

export function MyEmail({ name, actionUrl }: MyEmailProps) {
  return (
    <EmailLayout>
      <Section>
        <Text>Hello {name},</Text>
        <Text>Welcome to our platform!</Text>
        {actionUrl && (
          <EmailButton href={actionUrl}>
            Get Started
          </EmailButton>
        )}
      </Section>
    </EmailLayout>
  );
}

export default MyEmail;
```

## Error Handling

The service provides custom error classes for better error handling:

```typescript
import {
  EmailValidationError,
  EmailSendError,
  TemplateRenderError,
  isEmailValidationError,
  formatErrorForLogging,
} from '@/emails/utils/errors';

try {
  await sendEmail(options);
} catch (error) {
  if (isEmailValidationError(error)) {
    console.error('Invalid email:', error.email, error.validationCode);
  } else {
    console.error('Send error:', formatErrorForLogging(error));
  }
}
```

### Error Types

- **EmailValidationError**: Invalid email format or disposable email
- **EmailSendError**: API errors, rate limits, network issues
- **TemplateRenderError**: Template rendering failures
- **EmailConfigurationError**: Missing environment variables
- **EmailQueueError**: Queue operation failures
- **UnsubscribeError**: Unsubscribe operation failures

## Validation

Email validation utilities are available for use throughout the application:

```typescript
import {
  isValidEmail,
  sanitizeEmail,
  validateRecipients,
  isDisposableEmail,
  assertValidEmail,
} from '@/emails/utils/validation';

// Basic validation
if (isValidEmail('user@example.com')) {
  // Email is valid
}

// Sanitize email
const clean = sanitizeEmail(' User@Example.COM '); // 'user@example.com'

// Validate and sanitize multiple recipients
const validEmails = validateRecipients([
  'user1@example.com',
  'invalid-email',
  'user2@example.com',
]); // ['user1@example.com', 'user2@example.com']

// Check for disposable emails
if (isDisposableEmail('test@tempmail.com')) {
  // Reject disposable email
}

// Assert valid email (throws on invalid)
try {
  assertValidEmail('user@example.com', false);
} catch (error) {
  // Handle validation error
}
```

## Retry Logic

The service includes automatic retry logic with exponential backoff:

```typescript
import { withRetry, DEFAULT_RETRY_CONFIG } from '@/emails/utils/errors';

const result = await withRetry(
  async () => {
    // Your email sending logic
    return await someApiCall();
  },
  {
    maxAttempts: 3,
    delayMs: 1000,
    backoffMultiplier: 2,
  }
);
```

**Default retry configuration:**
- Max attempts: 3
- Initial delay: 1000ms
- Backoff multiplier: 2x (1s, 2s, 4s)

## Template Registry

All templates are registered in `service/templates.ts`:

```typescript
import { EMAIL_TEMPLATES } from '@/emails/service/templates';

// Access template IDs
EMAIL_TEMPLATES.WELCOME
EMAIL_TEMPLATES.SUBSCRIPTION_CREATED
EMAIL_TEMPLATES.PAYMENT_SUCCESSFUL

// Check if template is marketing email
import { isMarketingEmail } from '@/emails/service/templates';

if (isMarketingEmail(EMAIL_TEMPLATES.RE_ENGAGEMENT)) {
  // Add unsubscribe link
}
```

## Best Practices

### 1. Always Use Helper Functions

Use the provided helper functions instead of calling `sendEmail` directly:

```typescript
// Good
await sendWelcome({ to: email, name });

// Avoid
await sendEmail({ to: email, subject: '...', template: WelcomeEmail(...) });
```

### 2. Handle Errors Gracefully

Always check the result and handle errors:

```typescript
const result = await sendWelcome(data);

if (!result.success) {
  // Log error, notify team, or retry
  console.error('Failed to send welcome email:', result.error);
  // Don't throw - sending email failure shouldn't block user flow
}
```

### 3. Validate Emails Before Sending

Use validation utilities to check emails before attempting to send:

```typescript
import { isValidEmail } from '@/emails/utils/validation';

if (!isValidEmail(email)) {
  return { error: 'Invalid email address' };
}

await sendWelcome({ to: email, name });
```

### 4. Use Tags for Analytics

Always include tags for better tracking and analytics:

```typescript
await sendEmail({
  to: email,
  subject: 'Welcome',
  template: WelcomeEmail({ name }),
  tags: [
    { name: 'category', value: 'onboarding' },
    { name: 'template', value: EMAIL_TEMPLATES.WELCOME },
    { name: 'user_tier', value: 'pro' },
  ],
});
```

### 5. Test Templates Before Deployment

Use the email preview server to test templates:

```bash
npm run email:dev
```

Then visit http://localhost:3000 to preview templates.

## Testing

### Test Individual Emails

```bash
# Test a specific email template
npm run email:test welcome

# Send to a specific email address
npm run email:test welcome -- --to=test@example.com
```

### Test All Emails

```bash
npm run email:test:all
```

### Check Deliverability

```bash
npm run email:deliverability
```

This will test your email configuration and check spam scores.

## Configuration Validation

The service validates configuration at startup:

```typescript
import { isResendConfigured } from '@/emails/service/resend';

if (!isResendConfigured()) {
  throw new Error('Resend email service is not properly configured');
}
```

## Logging

The service logs important events:

```typescript
[Email Service] Email sent successfully: re_abc123
[Email Service] Failed to send email: Invalid recipient
[Email Service] Attempt 1/3 failed. Retrying in 1000ms...
```

## Security Considerations

1. **Never expose API keys**: Keep RESEND_API_KEY in environment variables
2. **Validate all inputs**: Use validation utilities for all email addresses
3. **Sanitize user content**: Clean user-generated content in templates
4. **Use HTTPS**: Ensure all URLs in emails use HTTPS
5. **Implement rate limiting**: Prevent email abuse with rate limits
6. **Verify webhook signatures**: Validate Stripe webhook signatures

## Deliverability Best Practices

1. **Verify your domain**: Add SPF, DKIM, and DMARC records
2. **Use a dedicated sending domain**: Don't send from your main domain
3. **Warm up your domain**: Start with low volume and increase gradually
4. **Monitor bounce rates**: Keep bounce rate below 2%
5. **Include unsubscribe links**: Required for marketing emails
6. **Maintain list hygiene**: Remove invalid and bounced emails
7. **Test spam scores**: Use mail-tester.com before sending

## Monitoring

Monitor these metrics in Resend dashboard:

- **Delivery rate**: Should be >98%
- **Open rate**: Aim for >20% (transactional), >15% (marketing)
- **Click rate**: Aim for >5%
- **Bounce rate**: Keep below 2%
- **Complaint rate**: Keep below 0.1%

## Support

For issues or questions:
- Check Resend docs: https://resend.com/docs
- Check React Email docs: https://react.email/docs
- Contact the development team

## Next Steps

1. Create email templates in `templates/` directory
2. Set up email preview server
3. Test templates across email clients
4. Configure DNS records (SPF, DKIM, DMARC)
5. Verify domain in Resend
6. Test deliverability
7. Set up monitoring and alerts

---

Last Updated: 2025-10-21
Version: 1.0.0
