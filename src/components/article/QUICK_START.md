# Quick Start Guide - Article Modal

## 5-Minute Integration

### Step 1: Import (30 seconds)

```tsx
import { ArticleModal } from '@/components/article';
import type { Article } from '@/components/article';
```

### Step 2: Add State (30 seconds)

```tsx
const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
const [isModalOpen, setIsModalOpen] = useState(false);
```

### Step 3: Add Handlers (1 minute)

```tsx
const handleOpenModal = (article: Article) => {
  setSelectedArticle(article);
  setIsModalOpen(true);
};

const handleCloseModal = () => {
  setIsModalOpen(false);
  setTimeout(() => setSelectedArticle(null), 300);
};
```

### Step 4: Update Article Cards (2 minutes)

Find your existing ArticleCard component and add onClick:

```tsx
<ArticleCard
  article={article}
  onClick={() => handleOpenModal(article)}  // Add this line
/>
```

Or add a "Read Full Article" button:

```tsx
<Button onClick={() => handleOpenModal(article)}>
  Read Full Article
</Button>
```

### Step 5: Render Modal (1 minute)

Add at the bottom of your component (after main content):

```tsx
{/* Article Modal */}
<ArticleModal
  article={selectedArticle}
  isOpen={isModalOpen}
  onClose={handleCloseModal}
  postId={newsletterData.newsletter.id}
/>
```

## That's It!

You now have a beautiful, fully-functional article modal with:
- ✅ Smooth animations
- ✅ Mobile responsiveness
- ✅ Copy-to-clipboard actions
- ✅ AI personalization ready
- ✅ Reading progress tracking
- ✅ Keyboard navigation

## Example Article Data

Your article data should match this structure:

```typescript
const article: Article = {
  id: '1',
  contentID: 'article-001',
  title: 'Fed Cuts Rates: What This Means for Your Clients',
  summary: 'The Federal Reserve announced a 0.25% rate cut...',
  position: 1,
  contentType: 'article',
  articleTopic: 'rate_alert',
  keyInsights: [
    'Rate changes create immediate opportunities',
    'Refinancing could save homeowners $150–400 monthly',
  ],
  videoScript: 'Hey everyone! Breaking news...',
  emailTemplate: 'Subject: 🏠 Fed Rate Cut...',
  socialContent: {
    facebook: '📉 The Fed just cut rates...',
    linkedin: "The Fed's rate cut opens the door...",
    twitter: 'BREAKING: The Fed just cut rates...',
    instagram: 'Rate drop alert 💥 Ready to refi...',
  },
};
```

## Common Issues

### Modal not opening?
Check that `isOpen` is true and `article` is not null.

### Animations choppy?
Ensure Motion library is installed: `npm install motion`

### Can't copy to clipboard?
Must be on HTTPS or localhost. HTTP blocks clipboard API.

## Next Steps

1. ✅ Test on mobile device
2. ✅ Customize colors if needed (see DESIGN.md)
3. ✅ Connect AI personalization to your API
4. ✅ Add analytics tracking

## Need Help?

- **Full Documentation**: See README.md
- **Design Specs**: See DESIGN.md
- **Working Example**: See ArticleModal.example.tsx
- **Integration Details**: See ARTICLE_MODAL_IMPLEMENTATION.md

## Preview

Desktop view:
```
┌─────────────────────────────────────────────────────────┐
│  [←] Article Title                    [Share] [X]       │
│  [Badge: Market Update] [Badge: 4 Key Insights]         │
├─────────────────────────────────────────────────────────┤
│                                    │                     │
│  Article Content (70%)             │  Sidebar (30%)     │
│  ─────────────────                 │  ─────────         │
│  [Key Insights Callout]            │  Quick Actions     │
│                                    │                     │
│  ## Overview                       │  [Video Script]    │
│  Lorem ipsum dolor sit amet...     │  [Email Template]  │
│                                    │  [Social Posts]    │
│  ## Key Insights                   │  [AI Personalize]  │
│  - Insight 1                       │                     │
│  - Insight 2                       │  ───────────       │
│                                    │  Reading: 45%      │
│  ## Detailed Analysis              │  [██████    ]      │
│  consectetur adipiscing elit...    │  [Back to Top]     │
│                                    │                     │
└─────────────────────────────────────────────────────────┘
```

Mobile view:
```
┌────────────────────┐
│ [←] Article... [X] │
│ [Badge]            │
├────────────────────┤
│                    │
│  [Key Insights]    │
│                    │
│  ## Overview       │
│  Lorem ipsum...    │
│                    │
│  ## Key Insights   │
│  - Insight 1       │
│                    │
│  ## Analysis       │
│  consectetur...    │
│                    │
│                    │
│              [FAB] │
└────────────────────┘
```

## Performance

Expected performance:
- Modal opens in < 200ms
- Animations run at 60fps
- Smooth scrolling at all times
- No layout shift

---

**Ready to ship!** 🚀

All components are production-ready with:
- TypeScript strict mode ✅
- Accessibility built-in ✅
- Mobile-first design ✅
- Smooth animations ✅
- Clean, maintainable code ✅
