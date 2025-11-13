# Migration Guide: Social Media Platform Selector

This guide walks through integrating the new social media platform selector into your existing codebase.

## 🎯 Overview

The new social media components replace the generic social content generation with platform-specific selection and generation capabilities.

## 📋 Pre-Migration Checklist

- [ ] Backup your current `AIGenerationPanel.tsx`
- [ ] Review current social content generation workflow
- [ ] Identify where social content is currently displayed
- [ ] Check API endpoint for social content generation
- [ ] Review database schema for social content storage

## 🔄 Step-by-Step Migration

### Step 1: Install Dependencies (if needed)

All required dependencies should already be installed:
- ✅ `motion` (Framer Motion)
- ✅ `lucide-react` (icons)
- ✅ `@ai-sdk/react` (streaming)
- ✅ Radix UI components (checkbox, label)

### Step 2: Import New Components

Find where you're currently using social content generation and add these imports:

```tsx
// Add to your imports
import { SocialMediaGenerationPanel } from '@/components/ai/SocialMediaGenerationPanel';
import type { SocialPlatform } from '@/components/ai/SocialPlatformSelector';
```

### Step 3: Replace Social Content Section

**Before:**
```tsx
// In your article display component
{contentType === 'social_content' && (
  <AIGenerationPanel
    articleId={article.id}
    contentType="social_content"
    userTier={userTier}
    remainingGenerations={remainingGenerations}
    onGenerationComplete={handleRefresh}
  />
)}
```

**After:**
```tsx
{contentType === 'social_content' && (
  <SocialMediaGenerationPanel
    articleId={article.id}
    userTier={userTier}
    remainingGenerations={remainingGenerations}
    initialResults={cachedSocialContent} // Optional: pass cached content
    onSave={async (results) => {
      // Save to your database
      await saveSocialContent(article.id, results);
    }}
    onContentGenerated={(results) => {
      // Cache the generated content in parent state
      setCachedSocialContent(results);
    }}
    onGenerationComplete={() => {
      // Refresh generation counts if needed
      handleRefresh();
    }}
  />
)}
```

### Step 4: Update API Endpoint

Modify your AI generation API to handle platform-specific requests:

**File**: `/src/app/api/ai/personalize-stream/route.ts`

Add platform handling:

```typescript
export async function POST(req: Request) {
  const body = await req.json();
  const { articleId, contentType, platforms } = body;

  // NEW: Handle platform-specific social content generation
  if (contentType === 'social_content') {
    const results: Record<string, string> = {};

    // Get article data
    const article = await getArticleById(articleId);

    // Platform-specific generation
    const platformPrompts = {
      facebook: `Create an engaging Facebook post (max 250 chars ideal) about: ${article.title}`,
      instagram: `Write an Instagram caption (max 150 chars ideal) with 2-3 hashtags for: ${article.title}`,
      twitter: `Create a concise tweet (max 280 chars) about: ${article.title}`,
      linkedin: `Write a professional LinkedIn post (max 1300 chars ideal) about: ${article.title}`
    };

    for (const platform of platforms || ['facebook', 'instagram', 'twitter', 'linkedin']) {
      const prompt = platformPrompts[platform as keyof typeof platformPrompts];

      // Use your AI generation logic here
      const content = await generateWithAI({
        prompt,
        articleData: article,
        platform
      });

      results[platform] = content;
    }

    // Return as JSON for non-streaming, or stream for real-time
    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // ... rest of your existing logic
}
```

### Step 5: Update Database Schema (Optional)

If you want to save platform-specific content separately:

**Prisma Schema Addition:**
```prisma
model SocialMediaGeneration {
  id        String   @id @default(uuid())
  articleId String
  userId    String
  platform  String   // 'facebook' | 'instagram' | 'twitter' | 'linkedin'
  content   String   @db.Text
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([articleId, userId])
  @@index([platform])
}
```

Or use JSON field in existing table:
```prisma
model ArticleGeneration {
  // ... existing fields
  socialContent Json? // Store as { facebook: "...", twitter: "...", etc. }
}
```

### Step 6: Update Save Handler

Create a function to save platform-specific content:

```typescript
// src/lib/api/social-content.ts
import { prisma } from '@/lib/prisma';

export async function saveSocialContent(
  articleId: string,
  userId: string,
  content: Record<SocialPlatform, string>
) {
  // Option 1: Save as JSON in existing generation table
  await prisma.articleGeneration.upsert({
    where: {
      articleId_userId: { articleId, userId }
    },
    update: {
      socialContent: content,
      updatedAt: new Date()
    },
    create: {
      articleId,
      userId,
      socialContent: content
    }
  });

  // Option 2: Save individually for each platform
  const saves = Object.entries(content).map(([platform, text]) =>
    prisma.socialMediaGeneration.upsert({
      where: {
        articleId_userId_platform: { articleId, userId, platform }
      },
      update: {
        content: text,
        updatedAt: new Date()
      },
      create: {
        articleId,
        userId,
        platform,
        content: text
      }
    })
  );

  await Promise.all(saves);
}
```

### Step 7: Load Cached Content

When loading the article page, fetch any previously generated content:

```typescript
// In your article page component
export async function ArticlePage({ articleId }) {
  const session = await getSession();

  // Fetch cached social content
  const cachedContent = await prisma.articleGeneration.findUnique({
    where: {
      articleId_userId: {
        articleId,
        userId: session.user.id
      }
    },
    select: {
      socialContent: true
    }
  });

  return (
    <SocialMediaGenerationPanel
      articleId={articleId}
      userTier={session.user.tier}
      remainingGenerations={remainingGenerations}
      initialResults={cachedContent?.socialContent as Record<SocialPlatform, string>}
      // ... other props
    />
  );
}
```

## 🧪 Testing Your Migration

### Manual Testing Checklist

1. **Platform Selection**
   - [ ] Can select individual platforms
   - [ ] Select All works
   - [ ] Clear All works
   - [ ] Selected platforms are visually indicated

2. **Content Generation**
   - [ ] Generate button is disabled when no platforms selected
   - [ ] Content generates for selected platforms only
   - [ ] Loading states display correctly
   - [ ] Error states handle gracefully

3. **Results Display**
   - [ ] Each platform shows generated content
   - [ ] Copy buttons work for each platform
   - [ ] Regenerate works for individual platforms
   - [ ] Character count displays correctly
   - [ ] Warnings show for exceeding limits

4. **Data Persistence**
   - [ ] Content saves to database
   - [ ] Cached content loads on page refresh
   - [ ] Individual platform regeneration updates correctly

5. **User Tiers**
   - [ ] Free tier shows generation limits
   - [ ] Upgrade prompts appear correctly
   - [ ] Paid tier has correct limits

### Automated Testing

Create test file: `src/components/ai/__tests__/SocialMediaGeneration.test.tsx`

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { SocialPlatformSelector } from '../SocialPlatformSelector';

describe('SocialPlatformSelector', () => {
  it('renders all platforms', () => {
    const onChange = jest.fn();
    render(<SocialPlatformSelector onPlatformsChange={onChange} />);

    expect(screen.getByText('Facebook')).toBeInTheDocument();
    expect(screen.getByText('Instagram')).toBeInTheDocument();
    expect(screen.getByText('Twitter/X')).toBeInTheDocument();
    expect(screen.getByText('LinkedIn')).toBeInTheDocument();
  });

  it('handles platform selection', () => {
    const onChange = jest.fn();
    render(<SocialPlatformSelector onPlatformsChange={onChange} />);

    const facebookCheckbox = screen.getByLabelText('Facebook');
    fireEvent.click(facebookCheckbox);

    expect(onChange).toHaveBeenCalledWith(['facebook']);
  });

  it('select all works', () => {
    const onChange = jest.fn();
    render(<SocialPlatformSelector onPlatformsChange={onChange} />);

    const selectAllButton = screen.getByText('Select All');
    fireEvent.click(selectAllButton);

    expect(onChange).toHaveBeenCalledWith([
      'facebook',
      'instagram',
      'twitter',
      'linkedin'
    ]);
  });
});
```

## 🔍 Troubleshooting Common Issues

### Issue: TypeScript errors on `SocialPlatform` type

**Solution**: Ensure you're importing the type correctly:
```typescript
import type { SocialPlatform } from '@/components/ai/SocialPlatformSelector';
// or
import { type SocialPlatform } from '@/components/ai/SocialPlatformSelector';
```

### Issue: API returns wrong format

**Solution**: Ensure API returns this exact structure:
```typescript
{
  facebook: "string content",
  instagram: "string content",
  twitter: "string content",
  linkedin: "string content"
}
```

### Issue: Cached content not loading

**Solution**: Check that your database field is properly typed:
- If using JSON field, parse it: `JSON.parse(cachedContent.socialContent)`
- If already JSON, cast it: `cachedContent.socialContent as Record<SocialPlatform, string>`

### Issue: Animations not smooth

**Solution**: Ensure `AnimatePresence` is at the correct level and Motion is imported:
```typescript
import { motion, AnimatePresence } from 'motion/react';
```

## 📊 Rollback Plan

If you need to rollback:

1. Restore original `AIGenerationPanel` usage
2. Revert API endpoint changes
3. Keep new components for future use
4. Document issues encountered

```bash
# If using git
git checkout HEAD -- src/components/ai/AIGenerationPanel.tsx
git checkout HEAD -- src/app/api/ai/personalize-stream/route.ts
```

## ✅ Post-Migration Validation

After migration is complete:

- [ ] All social content generation works in production
- [ ] No console errors or warnings
- [ ] Analytics tracking still works
- [ ] User generation limits enforced correctly
- [ ] Database saves working
- [ ] Mobile responsive layout verified
- [ ] Accessibility tested (keyboard nav, screen readers)
- [ ] Performance acceptable (no lag on generation)

## 🎓 Additional Resources

- **Component Documentation**: `SOCIAL_MEDIA_COMPONENTS.md`
- **Usage Examples**: `SocialMediaExample.tsx`
- **Type Definitions**: `src/types/social-media.ts`
- **Original Component**: `AIGenerationPanel.tsx`

## 💬 Need Help?

If you encounter issues during migration:

1. Check the troubleshooting section above
2. Review the usage examples in `SocialMediaExample.tsx`
3. Verify API response format matches expected structure
4. Check browser console for errors
5. Review this migration guide step-by-step

---

**Migration Estimated Time**: 30-60 minutes
**Difficulty**: Moderate
**Breaking Changes**: None (components are additive)
