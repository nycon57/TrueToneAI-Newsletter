# UI Components Guide - TrueTone Newsletter

This guide provides usage examples and integration instructions for all premium UI components created for the TrueTone Newsletter application.

---

## Table of Contents

1. [Category Selection Component](#category-selection-component)
2. [Save Article Button](#save-article-button)
3. [AI Limit Modal](#ai-limit-modal)
4. [Generation Status Components](#generation-status-components)
5. [Integration Examples](#integration-examples)

---

## Category Selection Component

**Location:** `/src/components/onboarding/steps/category-selection.tsx`

### Description
Beautiful multi-select checkbox grid for loan category preferences with icons, validation, and responsive design.

### Features
- 8 loan categories with custom icons
- Select All / Deselect All functionality
- Real-time validation (minimum 1 selection required)
- Responsive grid layout (1 column mobile, 2 columns tablet+)
- Smooth animations with Motion library
- Accessible with proper ARIA labels

### Usage in Onboarding Flow
The component is automatically integrated into the onboarding flow as Step 3:

```tsx
// Already integrated in src/app/onboarding/onboarding-client.tsx
const CategorySelection = lazy(() =>
  import('@/components/onboarding/steps/category-selection').then(module => ({
    default: module.CategorySelection
  }))
);
```

### Categories Supported
- **Purchase**: Home buying and purchase loans
- **Refinance**: Rate and term refinancing
- **FHA**: Federal Housing Administration loans
- **VA**: Veterans Affairs loans
- **Conventional**: Traditional mortgage loans
- **Jumbo**: High-value property financing
- **First-Time Buyer**: Programs for new homebuyers
- **Investment Property**: Rental and investment real estate

### Data Flow
1. User selects categories via checkboxes
2. Data stored in `onboarding-provider` context as `categoryPreferences` array
3. Submitted to `/api/user/onboarding` on completion
4. Saved to User table `category_preferences` field
5. Used by newsletter system to filter content

---

## Save Article Button

**Location:** `/src/components/article/save-article-button.tsx`

### Description
Heart icon button with optimistic UI updates, animations, and multiple variants for different contexts.

### Features
- Optimistic UI updates for instant feedback
- Heart fill animation on save
- Three size variants
- Save count display
- Toast notifications
- Automatic error rollback
- Subscription tier validation

### Variants

#### 1. Default (Customizable)
```tsx
import { SaveArticleButton } from '@/components/article/save-article-button';

<SaveArticleButton
  articleId="article-uuid"
  initialSaved={false}
  initialSaveCount={12}
  variant="ghost"
  size="icon"
  showCount={true}
/>
```

#### 2. Compact (For Article Cards)
```tsx
import { SaveArticleButtonCompact } from '@/components/article/save-article-button';

<SaveArticleButtonCompact
  articleId="article-uuid"
  initialSaved={false}
  className="absolute top-2 right-2"
/>
```

#### 3. Full (For Article Detail Pages)
```tsx
import { SaveArticleButtonFull } from '@/components/article/save-article-button';

<SaveArticleButtonFull
  articleId="article-uuid"
  initialSaved={true}
  initialSaveCount={45}
  className="w-full sm:w-auto"
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `articleId` | `string` | required | UUID of the article |
| `initialSaved` | `boolean` | `false` | Initial saved state |
| `initialSaveCount` | `number` | `0` | Total saves across all users |
| `variant` | `'default' \| 'ghost' \| 'outline'` | `'ghost'` | Button style variant |
| `size` | `'default' \| 'sm' \| 'lg' \| 'icon'` | `'icon'` | Button size |
| `showCount` | `boolean` | `false` | Show save count |
| `className` | `string` | - | Additional CSS classes |

### API Integration
The component automatically calls:
- `POST /api/articles/[id]/save` - Toggle save state
- `GET /api/articles/[id]/save` - Check current state (if needed)

### Subscription Requirements
- Only **PAID** and **PREMIUM** tier users can save articles
- **FREE** tier users receive 403 error with upgrade message
- Use this to trigger upgrade modal

---

## AI Limit Modal

**Location:** `/src/components/upgrade/ai-limit-modal.tsx`

### Description
Full-featured upgrade modal with pricing comparison, usage visualization, and Stripe integration.

### Components

#### 1. AiLimitModal (Main Modal)
```tsx
import { AiLimitModal } from '@/components/upgrade/ai-limit-modal';

const [showModal, setShowModal] = useState(false);

<AiLimitModal
  open={showModal}
  onOpenChange={setShowModal}
  generationsUsed={2}
  generationLimit={3}
  isBlocked={false} // true when limit is reached
/>
```

#### 2. AiLimitWarning (Inline Warning)
```tsx
import { AiLimitWarning } from '@/components/upgrade/ai-limit-modal';

<AiLimitWarning
  generationsUsed={2}
  generationLimit={3}
  onUpgradeClick={() => setShowModal(true)}
/>
```

### Props - AiLimitModal

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | required | Modal open state |
| `onOpenChange` | `(open: boolean) => void` | required | Open state change handler |
| `generationsUsed` | `number` | required | Current usage count |
| `generationLimit` | `number` | required | Maximum allowed |
| `isBlocked` | `boolean` | `false` | User has hit limit |

### Features
- **Progress Visualization**: Color-coded progress bar (green → orange → red)
- **Pricing Comparison**: Side-by-side Free vs Pro comparison
- **Feature Lists**: Checkmarks for included features, X marks for limitations
- **Stripe Integration**: Redirects to checkout on upgrade
- **Responsive Design**: Mobile-first with proper breakpoints
- **Dismissible**: Can close modal (unless blocked)

### When to Show
- At 75% usage: Show warning inline
- At 100% usage: Show modal with blocked state
- On personalization attempt when blocked

### Integration Example
```tsx
'use client';

import { useState, useEffect } from 'react';
import { AiLimitModal, AiLimitWarning } from '@/components/upgrade/ai-limit-modal';

export function ArticlePage({ article, userSubscription }) {
  const [showModal, setShowModal] = useState(false);

  // Auto-show modal when blocked
  useEffect(() => {
    if (userSubscription.generationsUsed >= userSubscription.generationLimit) {
      setShowModal(true);
    }
  }, [userSubscription]);

  return (
    <div>
      {/* Show warning at 75% usage */}
      <AiLimitWarning
        generationsUsed={userSubscription.generationsUsed}
        generationLimit={userSubscription.generationLimit}
        onUpgradeClick={() => setShowModal(true)}
      />

      {/* Modal */}
      <AiLimitModal
        open={showModal}
        onOpenChange={setShowModal}
        generationsUsed={userSubscription.generationsUsed}
        generationLimit={userSubscription.generationLimit}
        isBlocked={userSubscription.generationsUsed >= userSubscription.generationLimit}
      />
    </div>
  );
}
```

---

## Generation Status Components

**Location:** `/src/components/ai/generation-status.tsx`

### Description
Display AI generation usage status with multiple variants for different UI contexts.

### Components

#### 1. GenerationStatus (Main Component)
```tsx
import { GenerationStatus } from '@/components/ai/generation-status';

// Default card variant
<GenerationStatus
  generationsUsed={2}
  generationLimit={3}
  subscriptionTier="FREE"
  onUpgradeClick={() => setShowUpgradeModal(true)}
  variant="default"
/>

// Compact variant
<GenerationStatus
  generationsUsed={2}
  generationLimit={3}
  subscriptionTier="FREE"
  variant="compact"
/>

// Inline variant
<GenerationStatus
  generationsUsed={2}
  generationLimit={3}
  subscriptionTier="FREE"
  onUpgradeClick={() => setShowUpgradeModal(true)}
  variant="inline"
/>
```

#### 2. GenerationStatusBadge
```tsx
import { GenerationStatusBadge } from '@/components/ai/generation-status';

// For navigation or headers
<GenerationStatusBadge
  generationsUsed={2}
  generationLimit={3}
  subscriptionTier="FREE"
  onClick={() => setShowUpgradeModal(true)}
/>
```

### Props - GenerationStatus

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `generationsUsed` | `number` | required | Current usage count |
| `generationLimit` | `number` | required | Maximum allowed |
| `subscriptionTier` | `'FREE' \| 'PAID' \| 'PREMIUM'` | required | User's tier |
| `onUpgradeClick` | `() => void` | - | Upgrade button handler |
| `variant` | `'default' \| 'compact' \| 'inline'` | `'default'` | Display variant |
| `className` | `string` | - | Additional CSS classes |

### Variants Explained

| Variant | Use Case | Features |
|---------|----------|----------|
| `default` | Full card display | Icon, title, description, progress bar, upgrade CTA |
| `compact` | Small inline display | Icon + count only |
| `inline` | Section headers | Title, progress bar, small upgrade button |
| `badge` | Navigation/headers | Pill badge with icon + count |

### State Handling

The component automatically adjusts based on tier and usage:

1. **Paid/Premium Tier**: Shows "Unlimited AI Generations"
2. **Free Tier, < 75%**: Shows remaining count with primary color
3. **Free Tier, 75-99%**: Shows warning with orange color
4. **Free Tier, 100%**: Shows limit reached with red color

### Integration in App Layout
```tsx
// In navigation header
import { GenerationStatusBadge } from '@/components/ai/generation-status';

<header>
  <nav>
    {/* Other nav items */}
    <GenerationStatusBadge
      generationsUsed={user.monthlyGenerationsUsed}
      generationLimit={user.monthlyGenerationLimit}
      subscriptionTier={user.subscriptionTier}
      onClick={() => router.push('/settings/billing')}
    />
  </nav>
</header>
```

---

## Integration Examples

### Complete Article Page Example

```tsx
'use client';

import { useState } from 'react';
import { SaveArticleButtonFull } from '@/components/article/save-article-button';
import { AiLimitModal } from '@/components/upgrade/ai-limit-modal';
import { GenerationStatus } from '@/components/ai/generation-status';

export default function ArticlePage({ article, user }) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Article Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">{article.title}</h1>
        <SaveArticleButtonFull
          articleId={article.id}
          initialSaved={user.savedArticleIds.includes(article.id)}
          initialSaveCount={article.saveCount}
        />
      </div>

      {/* Generation Status */}
      <GenerationStatus
        generationsUsed={user.monthlyGenerationsUsed}
        generationLimit={user.monthlyGenerationLimit}
        subscriptionTier={user.subscriptionTier}
        onUpgradeClick={() => setShowUpgradeModal(true)}
        variant="inline"
        className="mb-6"
      />

      {/* Article Content */}
      <article>{/* Content here */}</article>

      {/* Upgrade Modal */}
      <AiLimitModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        generationsUsed={user.monthlyGenerationsUsed}
        generationLimit={user.monthlyGenerationLimit}
        isBlocked={user.monthlyGenerationsUsed >= user.monthlyGenerationLimit}
      />
    </div>
  );
}
```

### Complete Navigation Example

```tsx
import { GenerationStatusBadge } from '@/components/ai/generation-status';

export function AppNavigation({ user }) {
  return (
    <nav className="flex items-center justify-between p-4">
      <div className="flex items-center gap-6">
        <Logo />
        <NavLinks />
      </div>

      <div className="flex items-center gap-4">
        <GenerationStatusBadge
          generationsUsed={user.monthlyGenerationsUsed}
          generationLimit={user.monthlyGenerationLimit}
          subscriptionTier={user.subscriptionTier}
          onClick={() => router.push('/settings')}
        />
        <UserMenu />
      </div>
    </nav>
  );
}
```

### AI Chat Integration Example

```tsx
'use client';

import { useState } from 'react';
import { AiLimitWarning, AiLimitModal } from '@/components/upgrade/ai-limit-modal';

export function AIChatBox({ article, user }) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleSendMessage = async (message: string) => {
    // Check limit before sending
    if (user.monthlyGenerationsUsed >= user.monthlyGenerationLimit) {
      setShowUpgradeModal(true);
      return;
    }

    // Send message to AI
    // ...
  };

  return (
    <div className="space-y-4">
      {/* Warning at 75% usage */}
      <AiLimitWarning
        generationsUsed={user.monthlyGenerationsUsed}
        generationLimit={user.monthlyGenerationLimit}
        onUpgradeClick={() => setShowUpgradeModal(true)}
      />

      {/* Chat interface */}
      {/* ... */}

      {/* Upgrade Modal */}
      <AiLimitModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        generationsUsed={user.monthlyGenerationsUsed}
        generationLimit={user.monthlyGenerationLimit}
        isBlocked={user.monthlyGenerationsUsed >= user.monthlyGenerationLimit}
      />
    </div>
  );
}
```

---

## Styling Guidelines

All components follow the project's design system:

- **Tailwind CSS v4**: Using design tokens and utility classes
- **shadcn/ui**: Radix UI primitives with consistent styling
- **Motion Library**: Smooth animations and transitions
- **Dark Mode**: Full support via `next-themes`
- **Responsive**: Mobile-first approach with proper breakpoints
- **Accessible**: WCAG AA compliance with ARIA labels

### Color Scheme
- **Primary**: Progress indicators, active states
- **Green**: Success states, paid tier indicators
- **Orange**: Warning states (75% usage)
- **Red/Destructive**: Error states, limit reached

### Breakpoints
- `sm`: 640px - Mobile landscape, small tablets
- `md`: 768px - Tablets
- `lg`: 1024px - Desktop
- `xl`: 1280px - Large desktop
- `2xl`: 1536px - Extra large screens

---

## API Endpoints

### Save Article
- **Endpoint**: `/api/articles/[id]/save`
- **Methods**: `POST`, `GET`
- **Auth**: Required (Kinde)
- **Subscription**: PAID or PREMIUM only

### User Onboarding
- **Endpoint**: `/api/user/onboarding`
- **Method**: `POST`
- **Saves**: Category preferences, profile data

### Stripe Checkout
- **Endpoint**: `/api/stripe/checkout`
- **Method**: `POST`
- **Returns**: Checkout session URL

---

## Testing Checklist

### Category Selection
- [ ] Can select multiple categories
- [ ] Select All / Deselect All works
- [ ] Validation prevents continuing without selection
- [ ] Categories save to database
- [ ] Responsive on mobile and desktop

### Save Article
- [ ] Heart animation works
- [ ] Optimistic UI updates immediately
- [ ] Toast notifications appear
- [ ] Save count updates correctly
- [ ] Free tier users see upgrade message
- [ ] Error handling reverts state

### AI Limit Modal
- [ ] Shows correct usage percentage
- [ ] Progress bar color changes (green → orange → red)
- [ ] Upgrade button redirects to Stripe
- [ ] Dismissible when not blocked
- [ ] Modal auto-shows when limit reached

### Generation Status
- [ ] All variants render correctly
- [ ] Shows "Unlimited" for paid users
- [ ] Progress bar matches usage
- [ ] Upgrade button triggers modal
- [ ] Badge variant works in navigation

---

## Troubleshooting

### Component Not Rendering
- Ensure all dependencies are installed (`npm install`)
- Check that Prisma client is generated (`npx prisma generate`)
- Verify component imports use correct paths

### Save Button Not Working
- Check user authentication (Kinde session)
- Verify user has PAID or PREMIUM tier
- Check API route exists at `/api/articles/[id]/save`
- Look for console errors in browser dev tools

### Modal Not Showing
- Verify `open` state is managed correctly
- Check that Radix Dialog is installed
- Ensure Motion library is available

### Styling Issues
- Regenerate Tailwind classes (`npm run dev`)
- Check that theme provider wraps the app
- Verify CSS variables are defined in globals.css

---

## File Locations Summary

```
src/
├── components/
│   ├── onboarding/
│   │   └── steps/
│   │       └── category-selection.tsx
│   ├── article/
│   │   └── save-article-button.tsx
│   ├── upgrade/
│   │   └── ai-limit-modal.tsx
│   └── ai/
│       └── generation-status.tsx
├── app/
│   ├── onboarding/
│   │   ├── onboarding-constants.ts
│   │   └── onboarding-client.tsx
│   └── api/
│       └── articles/
│           └── [id]/
│               └── save/
│                   └── route.ts
└── lib/
    └── prisma/
        └── client.ts
```

---

**Last Updated:** October 21, 2025
