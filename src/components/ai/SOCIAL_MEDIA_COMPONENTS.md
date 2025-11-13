# Social Media Platform Selector Components

Comprehensive UI components for selecting social media platforms and displaying AI-generated content with platform-specific customization.

## 📁 Files Created

1. **`SocialPlatformSelector.tsx`** - Main component with selector and results display
2. **`SocialMediaGenerationPanel.tsx`** - Complete generation workflow component
3. **`SocialMediaExample.tsx`** - Usage examples and integration guide
4. **`/src/types/social-media.ts`** - TypeScript type definitions

## 🎯 Features

### SocialPlatformSelector Component

- **Multi-select platform interface** with checkboxes
- **Visual platform cards** with icons, descriptions, and character limits
- **Quick actions**: Select All / Clear All buttons
- **Real-time selection feedback** with animated indicators
- **Accessibility**: Full keyboard navigation and screen reader support
- **Responsive design**: Mobile-first grid layout
- **Theme integration**: Matches existing orchid/indigo/lavender gradient theme

### SocialPlatformResults Component

- **Platform-specific content display** with branded styling
- **Per-platform actions**: Individual Copy and Regenerate buttons
- **Character count tracking** with limit warnings
- **Copy feedback**: Visual confirmation when content is copied
- **Regeneration states**: Loading indicators for individual platforms
- **Content validation**: Automatic detection of character limit violations

### SocialMediaGenerationPanel Component

- **Complete workflow management**: Selection → Generation → Results
- **Streaming support**: Real-time content generation display
- **Error handling**: Graceful error states with retry options
- **Generation limits**: Tier-based limit enforcement
- **Upgrade prompts**: CTAs for free tier users
- **State persistence**: Optional caching of generated content

## 🚀 Quick Start

### Basic Usage: Platform Selector

```tsx
import { SocialPlatformSelector, type SocialPlatform } from '@/components/ai/SocialPlatformSelector';

function MyComponent() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([]);

  return (
    <SocialPlatformSelector
      selectedPlatforms={selectedPlatforms}
      onPlatformsChange={setSelectedPlatforms}
    />
  );
}
```

### Display Results

```tsx
import { SocialPlatformResults, type SocialPlatform } from '@/components/ai/SocialPlatformSelector';

function ResultsComponent() {
  const results: Record<SocialPlatform, string> = {
    facebook: 'Your Facebook post content...',
    twitter: 'Your tweet...',
    linkedin: 'Your LinkedIn post...',
    instagram: 'Your Instagram caption...'
  };

  return (
    <SocialPlatformResults
      results={results}
      onCopy={(platform, content) => console.log(`Copied ${platform}`)}
      onRegenerate={(platform) => console.log(`Regenerating ${platform}`)}
    />
  );
}
```

### Complete Workflow

```tsx
import { SocialMediaGenerationPanel } from '@/components/ai/SocialMediaGenerationPanel';

function ArticlePage({ articleId, userTier, remainingGenerations }) {
  return (
    <SocialMediaGenerationPanel
      articleId={articleId}
      userTier={userTier}
      remainingGenerations={remainingGenerations}
      onSave={(results) => {
        // Save to database
        saveSocialMediaContent(articleId, results);
      }}
      onContentGenerated={(results) => {
        // Cache results
        setCachedContent(results);
      }}
    />
  );
}
```

## 📝 Component API

### SocialPlatformSelector Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `onPlatformsChange` | `(platforms: SocialPlatform[]) => void` | Yes | - | Callback when platform selection changes |
| `selectedPlatforms` | `SocialPlatform[]` | No | `[]` | Currently selected platforms |
| `disabled` | `boolean` | No | `false` | Disable all interactions |
| `className` | `string` | No | - | Additional CSS classes |

### SocialPlatformResults Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `results` | `Record<SocialPlatform, string>` | Yes | - | Generated content by platform |
| `onCopy` | `(platform, content) => void` | Yes | - | Callback when content is copied |
| `onRegenerate` | `(platform) => void` | Yes | - | Callback when regenerate is clicked |
| `isRegenerating` | `SocialPlatform \| null` | No | `null` | Currently regenerating platform |
| `className` | `string` | No | - | Additional CSS classes |

### SocialMediaGenerationPanel Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `articleId` | `string` | Yes | - | Article ID for generation |
| `userTier` | `'free' \| 'paid'` | Yes | - | User's subscription tier |
| `remainingGenerations` | `number` | Yes | - | Remaining AI generations |
| `initialResults` | `Record<SocialPlatform, string>` | No | - | Pre-loaded cached results |
| `onSave` | `(results) => void` | No | - | Save callback |
| `onGenerationComplete` | `() => void` | No | - | Generation complete callback |
| `onContentGenerated` | `(results) => void` | No | - | Content generated callback |
| `className` | `string` | No | - | Additional CSS classes |

## 🎨 Platform Configurations

Each platform has specific characteristics:

### Facebook
- **Max Characters**: 63,206
- **Tone**: Conversational, engaging, community-focused
- **Features**: Long-form posts, links, images, videos

### Instagram
- **Max Characters**: 2,200
- **Tone**: Visual-first, aspirational, authentic
- **Features**: Hashtags, emojis, visual storytelling

### Twitter/X
- **Max Characters**: 280
- **Tone**: Concise, timely, conversational
- **Features**: Short-form, threads, hashtags

### LinkedIn
- **Max Characters**: 3,000
- **Tone**: Professional, thought-leadership
- **Features**: Industry insights, B2B focus, articles

## 🔧 Integration with Existing Code

### Replace Social Content Generation

In your existing article display component, replace the social content section:

```tsx
// Before (generic AIGenerationPanel):
{contentType === 'social_content' && (
  <AIGenerationPanel
    articleId={article.id}
    contentType="social_content"
    userTier={userTier}
    remainingGenerations={remainingGenerations}
  />
)}

// After (platform-specific):
{contentType === 'social_content' && (
  <SocialMediaGenerationPanel
    articleId={article.id}
    userTier={userTier}
    remainingGenerations={remainingGenerations}
    initialResults={cachedSocialContent}
    onSave={handleSaveSocialContent}
    onContentGenerated={handleCacheSocialContent}
  />
)}
```

### API Endpoint Modification

Your API endpoint needs to handle platform-specific generation:

```typescript
// src/app/api/ai/personalize-stream/route.ts

export async function POST(req: Request) {
  const { articleId, contentType, platforms } = await req.json();

  if (contentType === 'social_content' && platforms) {
    const results: Record<string, string> = {};

    for (const platform of platforms) {
      const platformConfig = {
        facebook: { maxChars: 63206, tone: 'engaging' },
        instagram: { maxChars: 2200, tone: 'visual' },
        twitter: { maxChars: 280, tone: 'concise' },
        linkedin: { maxChars: 3000, tone: 'professional' }
      };

      const config = platformConfig[platform as keyof typeof platformConfig];

      results[platform] = await generatePlatformContent({
        articleId,
        platform,
        maxChars: config.maxChars,
        tone: config.tone
      });
    }

    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // ... rest of API logic
}
```

## ♿ Accessibility Features

- **Keyboard Navigation**: Full keyboard support with Tab, Enter, and Space
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Focus Indicators**: Clear visual focus states for all interactive elements
- **Color Contrast**: WCAG AA compliant color combinations
- **Motion Preferences**: Respects `prefers-reduced-motion`

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices (320px+)
- **Breakpoints**:
  - Mobile: Single column layout
  - Tablet (640px+): 2-column grid for platforms
  - Desktop (1024px+): Enhanced spacing and larger touch targets

## 🎭 Animation & Motion

Uses Framer Motion for smooth animations:

- **Platform cards**: Scale and opacity transitions
- **Selection indicators**: Animated checkmarks
- **Results**: Slide-up entrance animations
- **Copy feedback**: Temporary success states
- **Loading states**: Smooth spinner animations

## 🧪 Testing Checklist

- [ ] Platform selection updates state correctly
- [ ] Select All / Clear All work as expected
- [ ] Generate button disabled when no platforms selected
- [ ] Individual platform regeneration works
- [ ] Copy to clipboard provides feedback
- [ ] Character limit warnings appear when exceeded
- [ ] Keyboard navigation works for all controls
- [ ] Screen reader announces state changes
- [ ] Mobile layout renders correctly
- [ ] Upgrade prompts show for free tier users
- [ ] Error states display and retry works

## 🎯 Future Enhancements

Potential improvements for future iterations:

1. **Inline Editing**: Allow users to edit generated content directly
2. **Content Scheduling**: Integration with social media scheduling tools
3. **Tone Customization**: Per-platform tone selection
4. **Hashtag Suggestions**: AI-powered hashtag recommendations
5. **Preview Mode**: Visual preview of how posts will appear on each platform
6. **Character Optimization**: Automatic trimming to ideal character counts
7. **Multi-language Support**: Generate content in different languages
8. **A/B Testing**: Generate multiple variations per platform
9. **Analytics Integration**: Track which platforms perform best
10. **Custom Templates**: User-defined content templates

## 🐛 Troubleshooting

### Issue: Platforms not being selected

**Solution**: Ensure `onPlatformsChange` callback is properly updating parent state.

### Issue: Generated content not displaying

**Solution**: Verify API response format matches `Record<SocialPlatform, string>`.

### Issue: Copy button not working

**Solution**: Check browser permissions for clipboard API. Fallback to `document.execCommand('copy')` for older browsers.

### Issue: Animations not playing

**Solution**: Ensure Motion library is properly installed and `AnimatePresence` wraps conditional components.

## 📚 Related Files

- `/src/components/ai/AIGenerationPanel.tsx` - Original generation panel
- `/src/app/api/ai/personalize-stream/route.ts` - API endpoint
- `/src/types/social-media.ts` - Type definitions
- `/src/lib/utils.ts` - Utility functions (cn helper)

## 🤝 Contributing

When modifying these components:

1. Maintain TypeScript strict mode compliance
2. Follow existing Tailwind CSS patterns
3. Ensure accessibility standards are met
4. Update this documentation for any API changes
5. Test across all supported platforms and browsers

## 📄 License

Part of TrueTone Insights platform. Internal use only.

---

**Created**: 2025-10-23
**Last Updated**: 2025-10-23
**Version**: 1.0.0
**Maintainer**: Development Team
