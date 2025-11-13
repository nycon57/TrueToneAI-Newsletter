# Article Modal Components

Beautiful, feed-first article modal experience for TrueTone Insights newsletter app.

## Features

- ✨ Fullscreen modal with smooth animations
- 📱 Fully responsive (Desktop 2-column, Tablet/Mobile fullscreen)
- ♿ Accessibility built-in (ARIA labels, keyboard navigation, ESC to close)
- 📖 Beautiful typography with prose classes
- 🎨 Sticky header with scroll detection
- 📊 Reading progress indicator
- 🚀 Quick actions sidebar with AI personalization
- 📋 Copy-to-clipboard for all content types
- 🎯 Social sharing built-in

## Components

### ArticleModal
Main modal container with backdrop, animations, and responsive layout.

**Props:**
- `article` - Article object with content
- `isOpen` - Boolean to control modal visibility
- `onClose` - Callback when modal closes
- `postId` - Optional post/newsletter ID

### ArticleModalHeader
Sticky header with title, category badge, share button, and close button.

### ArticleModalContent
Scrollable markdown content area with beautiful typography and key insights callout.

### ArticleModalSidebar
Sticky sidebar with personalization action cards and reading progress (Desktop only).

### PersonalizationActionCard
Individual action card for Video, Email, Social, or AI personalization.

## Usage Example

```tsx
'use client';

import { useState } from 'react';
import { ArticleModal } from '@/components/article';
import type { Article } from '@/components/article';

export default function NewsletterFeed() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Optional: Clear article after animation completes
    setTimeout(() => setSelectedArticle(null), 300);
  };

  return (
    <>
      {/* Your feed/list of articles */}
      <div className="space-y-4">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onClick={() => handleArticleClick(article)}
          />
        ))}
      </div>

      {/* Article Modal */}
      <ArticleModal
        article={selectedArticle}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        postId="newsletter-123"
      />
    </>
  );
}
```

## Article Type

```typescript
interface Article {
  id: string;
  contentID: string;
  title: string;
  summary: string;
  position: number;
  contentType: 'article' | 'ad';
  articleTopic?: string;
  keyInsights?: string[];
  videoScript?: string;
  emailTemplate?: string;
  socialContent?: {
    facebook: string;
    linkedin: string;
    twitter: string;
    instagram: string;
  };
}
```

## Responsive Behavior

- **Desktop (lg+)**: 2-column layout with sticky sidebar on right (30% width)
- **Tablet (md-lg)**: Full width content, actions hidden (can add bottom sheet)
- **Mobile (sm)**: Full screen modal with floating action button

## Keyboard Navigation

- `ESC` - Close modal
- `Tab` - Navigate between interactive elements
- `Enter/Space` - Activate buttons

## Customization

### Colors
The components use the project's color tokens:
- `orchid` - Primary purple brand color
- `lavender` - Light purple for backgrounds
- `indigo` - Secondary accent color

Action cards are color-coded:
- Video: Red/Pink gradient
- Email: Green/Emerald gradient
- Social: Purple/Pink gradient
- AI: Indigo/Orchid gradient

### Typography
Uses Tailwind's `@tailwindcss/typography` with custom configuration:
- 18-20px base font size for readability
- 1.7 line height
- Custom heading sizes and spacing
- Responsive font sizes

### Animations
Powered by Motion (Framer Motion):
- Modal scale-up entrance
- Smooth transitions
- Reading progress animation
- Expand/collapse animations

## Accessibility

- Semantic HTML structure
- ARIA labels on all interactive elements
- Keyboard navigation support
- Focus management
- Screen reader friendly
- Color contrast compliant (WCAG AA)

## Performance

- Lazy animation rendering
- Optimized scroll listeners
- Efficient re-renders
- Smooth 60fps animations
- No layout shift

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 10+)

## Dependencies

All dependencies are already in the project:
- `motion` (Framer Motion fork)
- `react-markdown` + `remark-gfm`
- `lucide-react`
- `sonner` (toasts)
- Radix UI primitives via ShadCN components
