# Editable Content Components

This directory contains reusable, accessible components for editing AI-generated content sections with full TypeScript support and beautiful UI.

## Components

### 1. EditableContentSection

A flexible component for editing single-value content (text or multiline text) with edit/save/cancel functionality.

**File:** `/src/components/article/EditableContentSection.tsx`

#### Features
- Toggle between display and edit modes
- Loading states during save operations
- Success feedback animation
- Unsaved changes indicator (dirty state)
- Character counter with visual warnings
- Keyboard shortcuts (Escape to cancel, Cmd+Enter to save)
- Accessible with ARIA labels
- Smooth transitions using Motion/Framer Motion
- Mobile-responsive design

#### Props

```typescript
interface EditableContentSectionProps {
  title: string;                    // Section title (e.g., "Video Script")
  content: string;                  // The content to display/edit
  onSave: (newContent: string) => Promise<void>; // Async save handler
  icon?: React.ComponentType;       // Lucide icon component
  iconColor?: string;               // Tailwind color class (e.g., "text-red-600")
  bgColor?: string;                 // Tailwind gradient class (e.g., "from-red-50 to-red-50/50")
  borderColor?: string;             // Tailwind border class (e.g., "border-red-200")
  buttonColor?: string;             // Tailwind button class (e.g., "bg-red-600 hover:bg-red-700")
  buttonHoverColor?: string;        // Tailwind hover class (e.g., "hover:bg-red-100")
  multiline?: boolean;              // Use textarea (true) or input (false)
  maxLength?: number;               // Optional character limit
  placeholder?: string;             // Placeholder text for empty content
  contentType: 'video_script' | 'email_template' | 'key_insights' | 'social_media';
  className?: string;               // Additional CSS classes
  disabled?: boolean;               // Disable editing
}
```

#### Usage Example - Video Script (Red Theme)

```tsx
import { EditableContentSection } from '@/components/article';
import { Video } from 'lucide-react';

<EditableContentSection
  title="Video Script"
  content={videoScript}
  onSave={async (newContent) => {
    const response = await fetch(`/api/articles/${articleId}/content`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contentType: 'video_script',
        content: newContent
      })
    });
    if (!response.ok) throw new Error('Failed to save');
    setVideoScript(newContent);
  }}
  icon={Video}
  iconColor="text-red-600"
  bgColor="from-red-50 to-red-50/50"
  borderColor="border-red-200"
  buttonColor="bg-red-600 hover:bg-red-700"
  buttonHoverColor="hover:bg-red-100"
  multiline={true}
  maxLength={500}
  placeholder="Enter your video script..."
  contentType="video_script"
/>
```

#### Usage Example - Email Template (Green Theme)

```tsx
import { EditableContentSection } from '@/components/article';
import { Mail } from 'lucide-react';

<EditableContentSection
  title="Email Template"
  content={emailTemplate}
  onSave={async (newContent) => {
    // Your save logic here
    await saveEmailTemplate(newContent);
  }}
  icon={Mail}
  iconColor="text-green-700"
  bgColor="from-green-50 to-emerald-50/50"
  borderColor="border-green-200"
  buttonColor="bg-green-600 hover:bg-green-700"
  buttonHoverColor="hover:bg-green-100"
  multiline={true}
  contentType="email_template"
/>
```

#### Usage Example - Social Media (Blue Theme with Character Limit)

```tsx
import { EditableContentSection } from '@/components/article';
import { Share2 } from 'lucide-react';

<EditableContentSection
  title="Twitter Post"
  content={twitterPost}
  onSave={async (newContent) => {
    await saveSocialPost('twitter', newContent);
  }}
  icon={Share2}
  iconColor="text-blue-600"
  bgColor="from-blue-50 to-blue-50/50"
  borderColor="border-blue-200"
  buttonColor="bg-blue-600 hover:bg-blue-700"
  buttonHoverColor="hover:bg-blue-100"
  multiline={false}
  maxLength={280}
  placeholder="Share your thoughts..."
  contentType="social_media"
/>
```

---

### 2. EditableKeyInsights

A specialized component for editing an array of key insights with add/remove functionality.

**File:** `/src/components/article/EditableKeyInsights.tsx`

#### Features
- Edit multiple insights simultaneously
- Add new insights (up to max limit)
- Remove insights (minimum of 1)
- Visual insight numbering
- Drag handle (visual, for future drag-and-drop)
- Individual character counters per insight
- Keyboard shortcuts (Escape to cancel, Cmd+Enter to save)
- Smooth animations for add/remove actions
- Purple theme matching ArticleCard
- Focus management for better UX

#### Props

```typescript
interface EditableKeyInsightsProps {
  insights: string[];               // Array of insight strings
  onSave: (newInsights: string[]) => Promise<void>; // Async save handler
  maxInsights?: number;             // Maximum number of insights (default: 6)
  maxLength?: number;               // Max characters per insight (default: 200)
  className?: string;               // Additional CSS classes
  disabled?: boolean;               // Disable editing
}
```

#### Usage Example

```tsx
import { EditableKeyInsights } from '@/components/article';

const [keyInsights, setKeyInsights] = useState([
  "Rate changes create immediate opportunities for strategic refinancing",
  "Refinancing could save homeowners $150–400 monthly on typical mortgages",
  "Market competition likely to increase as buyers return with renewed confidence"
]);

<EditableKeyInsights
  insights={keyInsights}
  onSave={async (newInsights) => {
    const response = await fetch(`/api/articles/${articleId}/content`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contentType: 'key_insights',
        content: newInsights
      })
    });
    if (!response.ok) throw new Error('Failed to save');
    setKeyInsights(newInsights);
  }}
  maxInsights={6}
  maxLength={200}
/>
```

---

## Color Schemes (ArticleCard Themes)

Use these predefined color schemes to match the existing ArticleCard design:

### Purple Theme (Key Insights)
```typescript
iconColor="text-purple-600"
bgColor="from-purple-50 to-purple-50/50"
borderColor="border-purple-200"
buttonColor="bg-purple-600 hover:bg-purple-700"
buttonHoverColor="hover:bg-purple-100"
```

### Red Theme (Video Script)
```typescript
iconColor="text-red-600"
bgColor="from-red-50 to-red-50/50"
borderColor="border-red-200"
buttonColor="bg-red-600 hover:bg-red-700"
buttonHoverColor="hover:bg-red-100"
```

### Green Theme (Email Template)
```typescript
iconColor="text-green-700"
bgColor="from-green-50 to-emerald-50/50"
borderColor="border-green-200"
buttonColor="bg-green-600 hover:bg-green-700"
buttonHoverColor="hover:bg-green-100"
```

### Blue Theme (Social Media)
```typescript
iconColor="text-blue-600"
bgColor="from-blue-50 to-blue-50/50"
borderColor="border-blue-200"
buttonColor="bg-blue-600 hover:bg-blue-700"
buttonHoverColor="hover:bg-blue-100"
```

---

## Integration with ArticleCard

To integrate these components into the existing `ArticleCard.tsx`, replace the static content display sections with the editable components:

### Example: Replace renderVideoScript()

```tsx
const renderVideoScript = () => {
  const savedContent = article.generation_stats?.hasVideoScript
    ? article.videoScript
    : undefined;
  const newContent = cachedGenerations['video_script'];
  const contentToDisplay = newContent || savedContent || '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 space-y-4"
    >
      {contentToDisplay && (
        <EditableContentSection
          title="Video Script"
          content={contentToDisplay}
          onSave={async (newContent) => {
            // API call to save
            const response = await fetch(`/api/articles/${article.id}/content`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contentType: 'video_script',
                content: newContent
              })
            });
            if (!response.ok) throw new Error('Save failed');

            // Update local cache
            handleGenerationSave('video_script', newContent);
          }}
          icon={Video}
          iconColor="text-red-600"
          bgColor="from-red-50 to-red-50/50"
          borderColor="border-red-200"
          buttonColor="bg-red-600 hover:bg-red-700"
          buttonHoverColor="hover:bg-red-100"
          multiline={true}
          maxLength={500}
          contentType="video_script"
        />
      )}

      {/* Keep AI Generation Panel */}
      {isAuthenticated && (
        <AIGenerationPanel
          articleId={article.id}
          contentType="video_script"
          userTier={isPaid ? 'paid' : 'free'}
          remainingGenerations={generationStats.remaining}
          initialContent={contentToDisplay}
          hasExistingGeneration={article.generation_stats?.hasVideoScript || false}
          onContentGenerated={(content) => handleGenerationSave('video_script', content)}
        />
      )}
    </motion.div>
  );
};
```

---

## API Endpoint Example

Create a PATCH endpoint to handle content updates:

**File:** `/src/app/api/articles/[id]/content/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { contentType, content } = await request.json();
  const articleId = params.id;

  try {
    // Fetch existing article
    const article = await prisma.post.findUnique({
      where: { id: articleId }
    });

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Update the content field based on contentType
    const currentContent = article.content as any;
    let updatedContent = { ...currentContent };

    switch (contentType) {
      case 'video_script':
        updatedContent.video_script = content;
        break;
      case 'email_template':
        updatedContent.email_template = content;
        break;
      case 'key_insights':
        updatedContent.key_insights = content;
        break;
      case 'social_twitter':
        updatedContent.social_content = {
          ...updatedContent.social_content,
          twitter: content
        };
        break;
      // Add other cases as needed
    }

    // Save to database
    await prisma.post.update({
      where: { id: articleId },
      data: { content: updatedContent }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update content:', error);
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    );
  }
}
```

---

## Accessibility Features

Both components include:
- Proper ARIA labels for screen readers
- Keyboard navigation support
- Focus management
- Semantic HTML structure
- High contrast color schemes
- Clear visual feedback for all states

### Keyboard Shortcuts
- **Escape**: Cancel editing and revert changes
- **Cmd/Ctrl + Enter**: Save changes
- **Tab**: Navigate between elements
- **Enter** (in EditableKeyInsights): Add new insight when focused on "Add Insight" button

---

## Error Handling

Always wrap your `onSave` handler with try/catch and provide user feedback:

```tsx
onSave={async (newContent) => {
  try {
    const response = await fetch('/api/save', {
      method: 'POST',
      body: JSON.stringify({ content: newContent })
    });

    if (!response.ok) {
      throw new Error('Save failed');
    }

    // Optionally show success toast
    toast.success('Content saved successfully!');
  } catch (error) {
    console.error('Save error:', error);
    toast.error('Failed to save. Please try again.');
    throw error; // Re-throw to let component handle it
  }
}
```

---

## TypeScript Types

All components are fully typed. Import types as needed:

```typescript
import type {
  EditableContentSectionProps,
  EditableKeyInsightsProps
} from '@/components/article';
```

---

## Dependencies

These components use:
- **Motion/Framer Motion**: For smooth animations
- **Lucide React**: For icons
- **shadcn/ui**: Button, Textarea, Input, Badge components
- **Tailwind CSS**: For styling
- **TypeScript**: For type safety

---

## Future Enhancements

Potential improvements:
- [ ] Drag-and-drop reordering for EditableKeyInsights
- [ ] Undo/redo functionality
- [ ] Auto-save on blur
- [ ] Version history
- [ ] Collaborative editing with real-time updates
- [ ] Rich text editing support
- [ ] Template suggestions

---

## Support

For questions or issues, refer to:
- Full example file: `/src/components/article/EditableContent.example.tsx`
- Component source: `/src/components/article/EditableContentSection.tsx`
- Component source: `/src/components/article/EditableKeyInsights.tsx`
