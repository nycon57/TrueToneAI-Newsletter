# TrueTone Insights Email Templates

Beautiful, production-ready React Email templates built with focus on design, deliverability, and mobile responsiveness.

## 📁 Directory Structure

```
templates/
├── _components/          # Shared email components
│   ├── EmailLayout.tsx   # Full email wrapper with HTML/Head/Body
│   ├── EmailHeader.tsx   # Logo and hero section with gradient
│   ├── EmailFooter.tsx   # Unsubscribe, social links, legal
│   ├── EmailButton.tsx   # CTA buttons with brand styling
│   └── EmailSection.tsx  # Content section wrapper
│
├── support-confirmation.tsx    # User support request confirmation
├── support-notification.tsx    # Admin support request notification
├── welcome.tsx                 # New user welcome email
├── subscription-created.tsx    # Subscription activation confirmation
└── index.ts                    # Template exports
```

## 🎨 Brand Design System

### Colors
- **Primary**: Orchid `#4F518C`
- **Secondary**: Indigo `#2C2A4A`
- **Accent**: Lavender `#DABFFF`
- **Gradients**: `linear-gradient(135deg, #4F518C 0%, #2C2A4A 100%)`

### Typography
- **Headings**: Signal (with fallback to system fonts)
- **Body**: Inter (with fallback to Arial, Helvetica)
- **Code**: Monospace

### Layout
- **Max Width**: 600px (optimal for email clients)
- **Mobile-First**: All templates are fully responsive
- **Inline CSS**: All styles are inline for maximum compatibility

## 📧 Email Templates

### 1. Support Confirmation Email

**File**: `support-confirmation.tsx`
**Purpose**: Sent to users after they submit a support request
**Type**: Transactional

**Props**:
```typescript
interface SupportConfirmationEmailProps {
  name: string;                    // User's name
  referenceNumber: string;         // Support ticket reference (e.g., SUP-12345)
  subject: string;                 // Support request subject
  message: string;                 // User's message
  category: string;                // Category badge (technical, billing, etc.)
  expectedResponseTime?: string;   // Default: "24-48 hours"
}
```

**Features**:
- Reference number display in prominent card
- Category badge with custom styling
- Message preview in styled box
- Expected response time
- FAQ link for self-service
- Professional signature

### 2. Support Notification Email

**File**: `support-notification.tsx`
**Purpose**: Sent to support team when user submits a request
**Type**: Internal Notification

**Props**:
```typescript
interface SupportNotificationEmailProps {
  userName: string;                                    // Customer name
  userEmail: string;                                   // Customer email
  userTier?: string;                                   // Plan tier (Free, Starter, Pro, Enterprise)
  referenceNumber: string;                             // Ticket reference
  subject: string;                                     // Request subject
  category: string;                                    // Category badge
  message: string;                                     // Full message
  attachments?: Array<{ name: string; url: string }>; // Optional attachments
  userId?: string;                                     // Internal user ID
}
```

**Features**:
- Alert-style header for urgency
- User profile card with avatar, name, email, plan badge
- Tier-based badge colors (Free/Starter/Pro/Enterprise)
- Reference number and category badges
- Attachments list with download links
- Reply button (mailto link)
- Response guidelines and SLA tips

### 3. Welcome Email

**File**: `welcome.tsx`
**Purpose**: Sent to new users after registration
**Type**: Transactional

**Props**:
```typescript
interface WelcomeEmailProps {
  name: string;                                        // User's name
  quickStartSteps?: Array<{                           // Optional custom steps
    title: string;
    description: string;
  }>;
  onboardingUrl?: string;                             // Onboarding CTA link
}
```

**Features**:
- Warm welcome message with personalized greeting
- "What You'll Love" section with 3 benefits (icons + descriptions)
- Quick start guide with numbered steps
- Complete onboarding CTA button
- Support contact information
- Default steps provided if not specified

**Default Benefits**:
1. 📰 Weekly Newsletter - Curated mortgage industry insights
2. 🎯 AI Personalization - Content tailored to your voice
3. ⚡ Ready-to-Use Scripts - Copy-paste marketing content

### 4. Subscription Created Email

**File**: `subscription-created.tsx`
**Purpose**: Sent when user creates/upgrades to paid subscription
**Type**: Transactional

**Props**:
```typescript
interface SubscriptionCreatedEmailProps {
  name: string;                    // User's name
  planName: string;                // Plan tier (Starter, Pro, Enterprise)
  price: number;                   // Price in cents (e.g., 2999 = $29.99)
  currency?: string;               // Default: "USD"
  nextBillingDate: Date;           // Next billing date
  features?: string[];             // Plan features list
  manageBillingUrl?: string;       // Billing portal link
}
```

**Features**:
- Thank you message
- Plan details card with gradient header
  - Plan name and price display
  - Status badge ("Active")
  - Next billing date
- Features unlocked list with checkmarks
- Get started tips (3 numbered steps)
- Manage billing CTA button
- Receipt note with link to billing history

**Default Features by Plan**:
- **Starter**: Weekly newsletters, AI customization, copy-ready scripts, templates, trend analysis
- **Pro**: Everything in Starter + unlimited AI chat, advanced personalization, priority support, early access
- **Enterprise**: Everything in Pro + account manager, custom integrations, white-label, analytics, SLA

## 🧩 Shared Components

### EmailLayout

Full email HTML wrapper with proper structure.

```typescript
<EmailLayout preview="Preview text that appears in inbox">
  {children}
</EmailLayout>
```

**Features**:
- Proper HTML/Head/Body structure
- Inter font import
- 600px max-width container
- Light gray background (#f6f9fc)
- Preview text for email clients

### EmailHeader

Logo and hero section with optional gradient background.

```typescript
<EmailHeader
  title="Main Heading"           // Optional hero title
  subtitle="Subtitle text"       // Optional subtitle
  showLogo={true}                // Show/hide logo (default: true)
/>
```

**Features**:
- TrueTone Insights logo (centered)
- Gradient hero section (orchid to indigo)
- White title text with lavender subtitle
- Responsive padding

### EmailFooter

Footer with social links, legal, and optional unsubscribe.

```typescript
<EmailFooter
  showUnsubscribe={false}        // Show unsubscribe link
  unsubscribeUrl="/unsubscribe"  // Unsubscribe URL
/>
```

**Features**:
- Social media links (Twitter, LinkedIn, Website)
- Company tagline
- Unsubscribe link (for marketing emails)
- Privacy Policy & Terms links
- Company address
- Gray divider line

### EmailButton

CTA button with brand gradient.

```typescript
<EmailButton href="https://app.example.com" variant="primary">
  Click Here
</EmailButton>
```

**Variants**:
- `primary`: Orchid/Indigo gradient with white text
- `secondary`: White background with orchid border and text

### EmailSection

Content section wrapper with consistent spacing.

```typescript
<EmailSection
  backgroundColor="#f6f9fc"      // Optional background color
  padding="32px 40px"            // Default padding
>
  {children}
</EmailSection>
```

## 🚀 Usage Examples

### Sending Support Confirmation

```typescript
import { sendSupportConfirmation } from '@/emails/service/send';

await sendSupportConfirmation({
  to: 'user@example.com',
  name: 'John Doe',
  subject: 'Cannot access AI features',
  category: 'technical',
  message: 'I upgraded but still cannot access AI chat.',
  referenceNumber: 'SUP-12345',
  expectedResponseTime: '24-48 hours',
});
```

### Sending Welcome Email

```typescript
import { sendWelcome } from '@/emails/service/send';

await sendWelcome({
  to: 'newuser@example.com',
  name: 'Jane Smith',
  onboardingUrl: 'https://app.truetone.ai/onboarding',
});
```

### Sending Subscription Created

```typescript
import { sendSubscriptionCreated } from '@/emails/service/send';

await sendSubscriptionCreated({
  to: 'customer@example.com',
  name: 'Jane Smith',
  planName: 'Pro',
  price: 2999, // $29.99 in cents
  currency: 'USD',
  nextBillingDate: new Date('2025-11-21'),
  features: [
    'Unlimited AI chat',
    'Priority support',
    'Advanced analytics',
  ],
  manageBillingUrl: 'https://app.truetone.ai/billing',
});
```

## 🧪 Testing

### Test Individual Template

```bash
npm run email:test support-confirmation
npm run email:test welcome -- --to=your@email.com
```

### Test All Templates

```bash
npm run email:test:all -- --to=your@email.com
```

### Preview in Browser

```bash
npm run email:dev
# Opens http://localhost:3000/emails
```

### Environment Variables

```bash
# .env.local
RESEND_API_KEY=re_xxxxxxxxxxxxx
TEST_EMAIL=your@email.com
```

## 📱 Mobile Responsiveness

All templates are built mobile-first with:
- **Max width**: 600px for desktop email clients
- **Fluid layouts**: Tables with 100% width
- **Touch-friendly**: 44px minimum height for CTA buttons
- **Readable fonts**: Minimum 14px for body text
- **Adequate spacing**: Consistent padding on all devices

## ✅ Deliverability Best Practices

All templates follow email best practices:

- ✅ **Inline CSS**: All styles are inline for maximum compatibility
- ✅ **Plain text alternative**: Preview text provided via `<Preview>` component
- ✅ **Alt text**: All images have descriptive alt attributes
- ✅ **Semantic HTML**: Proper use of tables for layout
- ✅ **No external dependencies**: All styles and content self-contained
- ✅ **Unsubscribe links**: Marketing emails include unsubscribe (via EmailFooter)
- ✅ **Responsive**: Mobile-friendly layouts
- ✅ **Text-to-image ratio**: Balanced content for spam filters
- ✅ **Font fallbacks**: System fonts as fallback for web fonts

## 🎯 Accessibility

Templates include:
- Semantic HTML structure
- Alt text for all images
- Sufficient color contrast (WCAG AA)
- Readable font sizes (16px body, 14px minimum)
- Logical reading order
- `role="presentation"` for layout tables

## 📊 Email Client Compatibility

Tested and compatible with:
- Gmail (Desktop & Mobile)
- Outlook (2016, 2019, 365, Web)
- Apple Mail (iOS & macOS)
- Yahoo Mail
- ProtonMail
- Thunderbird

## 🔧 Customization

### Changing Brand Colors

Edit shared components in `_components/`:

```typescript
// EmailButton.tsx
const primaryButtonStyle = {
  background: 'linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%)',
  color: '#ffffff',
};
```

### Adding New Templates

1. Create template file in `src/emails/templates/`
2. Use shared components for consistency
3. Export component and props interface
4. Add to `templates/index.ts`
5. Add send function in `service/send.ts`
6. Add test case in `scripts/test-emails.ts`

### Custom Fonts

Add font imports in `EmailLayout.tsx`:

```typescript
<Font
  fontFamily="Your Font"
  webFont={{
    url: 'https://fonts.googleapis.com/css2?family=Your+Font',
    format: 'woff2',
  }}
/>
```

## 📝 License

Part of TrueTone Insights platform. Internal use only.

---

**Need help?** Contact the development team or see `/docs/email-system.md` for architecture details.
