# Email Templates - Quick Start Guide

Get up and running with TrueTone Insights email templates in 5 minutes.

## 🚀 Quick Setup

### 1. Environment Variables

Add to your `.env.local`:

```bash
# Required for sending emails
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Optional - for testing
TEST_EMAIL=your@email.com

# Required - base URL for links in emails
NEXT_PUBLIC_APP_URL=https://truetone.ai
```

### 2. Test Your Setup

```bash
# Test a single email template
npm run email:test welcome -- --to=your@email.com

# Test all templates
npm run email:test:all -- --to=your@email.com
```

## 📧 Sending Emails in Your Code

### Import the send functions

```typescript
import {
  sendSupportConfirmation,
  sendSupportNotification,
  sendWelcome,
  sendSubscriptionCreated,
} from '@/emails/service/send';
```

### Example 1: Support Confirmation

```typescript
// After user submits support form
const result = await sendSupportConfirmation({
  to: user.email,
  name: user.name,
  subject: formData.subject,
  category: formData.category,
  message: formData.message,
  referenceNumber: `SUP-${generateId()}`,
  expectedResponseTime: '24-48 hours',
});

if (result.success) {
  console.log('Email sent:', result.id);
} else {
  console.error('Failed to send email:', result.error);
}
```

### Example 2: Welcome New User

```typescript
// After user registration
await sendWelcome({
  to: newUser.email,
  name: newUser.name,
  onboardingUrl: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding`,
});
```

### Example 3: Subscription Created

```typescript
// After Stripe subscription created webhook
await sendSubscriptionCreated({
  to: customer.email,
  name: customer.name,
  planName: 'Pro',
  price: 2999, // $29.99 in cents
  nextBillingDate: new Date(subscription.current_period_end * 1000),
  manageBillingUrl: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
});
```

### Example 4: Support Notification (to Admin)

```typescript
// Send notification to support team
await sendSupportNotification({
  to: process.env.SUPPORT_EMAIL!,
  userName: user.name,
  userEmail: user.email,
  userTier: user.subscriptionTier,
  subject: supportRequest.subject,
  category: supportRequest.category,
  message: supportRequest.message,
  referenceNumber: supportRequest.id,
  userId: user.id,
  attachments: supportRequest.attachments,
});
```

## 🧩 Using Email Components Directly

If you need to create a custom email template:

```typescript
import { render } from '@react-email/render';
import { EmailLayout } from '@/emails/templates/_components/EmailLayout';
import { EmailHeader } from '@/emails/templates/_components/EmailHeader';
import { EmailSection } from '@/emails/templates/_components/EmailSection';
import { EmailButton } from '@/emails/templates/_components/EmailButton';
import { EmailFooter } from '@/emails/templates/_components/EmailFooter';
import { Text } from '@react-email/components';

function CustomEmail({ name }: { name: string }) {
  return (
    <EmailLayout preview="Custom email preview text">
      <EmailHeader title="Custom Email" subtitle="Subtitle here" />

      <EmailSection>
        <Text style={{ fontSize: '16px', lineHeight: '1.6' }}>
          Hi {name},
        </Text>

        <Text>Your custom content here...</Text>

        <div style={{ textAlign: 'center', margin: '32px 0' }}>
          <EmailButton href="https://example.com">
            Click Here
          </EmailButton>
        </div>
      </EmailSection>

      <EmailFooter />
    </EmailLayout>
  );
}

// Render to HTML
const html = await render(<CustomEmail name="John" />);

// Send via Resend
await sendEmail({
  to: 'user@example.com',
  subject: 'Custom Email',
  template: <CustomEmail name="John" />,
});
```

## 🎨 Brand Design System

### Colors

```typescript
const colors = {
  primary: '#4F518C',      // Orchid
  secondary: '#2C2A4A',    // Indigo
  accent: '#DABFFF',       // Lavender
  gradient: 'linear-gradient(135deg, #4F518C 0%, #2C2A4A 100%)',
};
```

### Common Styles

```typescript
// Heading
const headingStyle = {
  color: '#2C2A4A',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 16px 0',
};

// Body text
const paragraphStyle = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 20px 0',
};

// Card/Box
const cardStyle = {
  backgroundColor: '#f6f9fc',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

// Badge
const badgeStyle = {
  backgroundColor: '#DABFFF',
  borderRadius: '12px',
  color: '#4F518C',
  display: 'inline-block',
  fontSize: '12px',
  fontWeight: '600',
  padding: '4px 12px',
};
```

## 🧪 Testing & Debugging

### Preview Emails Locally

```bash
# Start React Email dev server
npm run email:dev

# Opens http://localhost:3000/emails
# Live preview of all templates
```

### Send Test Emails

```bash
# Single template
npm run email:test support-confirmation

# With custom recipient
npm run email:test welcome -- --to=test@example.com

# All templates
npm run email:test:all
```

### Check Deliverability

```bash
# Test spam score and deliverability
npm run email:deliverability
```

## ⚠️ Common Issues

### Issue: "RESEND_API_KEY not set"

**Solution**: Add to `.env.local`:
```bash
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

### Issue: Links broken in emails

**Solution**: Set `NEXT_PUBLIC_APP_URL` in `.env.local`:
```bash
NEXT_PUBLIC_APP_URL=https://truetone.ai
```

### Issue: Fonts not loading

**Solution**: Fonts are loaded via Google Fonts in `EmailLayout`. Ensure:
- Using inline styles (no external CSS)
- Fallback fonts are specified

### Issue: Email looks broken in Outlook

**Solution**: Our templates use:
- Table-based layouts (Outlook-compatible)
- Inline CSS only
- No flexbox or grid
- Tested in Outlook 2016, 2019, 365

## 📱 Mobile Testing

Test emails on actual devices:
- Forward test emails to your phone
- Check in Gmail app (iOS/Android)
- Check in Apple Mail (iOS)
- Verify buttons are tap-friendly (44px min)

## 🔐 Security Best Practices

### Never expose API keys

```typescript
// ❌ DON'T DO THIS
const apiKey = 're_xxxxx'; // Hardcoded

// ✅ DO THIS
const apiKey = process.env.RESEND_API_KEY;
```

### Validate email addresses

```typescript
import { validateRecipients } from '@/emails/utils/validation';

// Automatically validated in sendEmail()
const validEmails = validateRecipients(['user@example.com']);
```

### Sanitize user input

```typescript
// User-generated content in emails
const sanitizedMessage = userMessage.trim().slice(0, 5000);
```

## 📊 Monitoring

### Check email send results

```typescript
const result = await sendWelcome({
  to: user.email,
  name: user.name,
});

if (!result.success) {
  // Log to your error tracking service
  console.error('Email failed:', result.error);

  // Optionally retry or alert admin
  await notifyAdminOfEmailFailure(result.error);
}
```

### View analytics in Resend

1. Go to [resend.com/emails](https://resend.com/emails)
2. View sent emails, opens, clicks
3. Check bounce/spam rates
4. Monitor deliverability

## 🎯 Next Steps

1. **Set up DNS records** for custom domain:
   - Add SPF record
   - Verify DKIM (auto by Resend)
   - Set up DMARC

2. **Integrate with your app**:
   - Support form → sendSupportConfirmation
   - User registration → sendWelcome
   - Stripe webhooks → sendSubscriptionCreated

3. **Monitor deliverability**:
   - Test with [mail-tester.com](https://www.mail-tester.com)
   - Check spam scores
   - Monitor bounce rates

## 📚 Full Documentation

- **Templates**: `/src/emails/templates/README.md`
- **Summary**: `/src/emails/templates/TEMPLATES_SUMMARY.md`
- **Email Plan**: `/EMAIL_SYSTEM_PLAN.md`
- **API Docs**: `/src/emails/service/send.ts`

## 💡 Tips

1. **Always test before production**: Use `npm run email:test`
2. **Keep subject lines under 50 chars**: Better open rates
3. **Use preview text**: First line users see in inbox
4. **Mobile-first**: 60%+ of emails opened on mobile
5. **Track metrics**: Monitor opens, clicks, bounces
6. **A/B test**: Try different subject lines and CTAs

---

**Need help?** Check the full documentation in `/src/emails/templates/README.md` or contact the dev team.
