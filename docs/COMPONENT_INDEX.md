# Component Library Index

Comprehensive documentation for all UI components in the TrueTone AI Newsletter application.

## 📦 Component Structure

### shadcn/ui Base Components (60+ components)
Located in `src/components/ui/` - These are the foundational UI primitives.

### Kibo UI Extensions  
Located in `src/components/ui/kibo-ui/` - AI-focused component library built on shadcn/ui.

### Newsletter Components
Located in `src/components/newsletter/` - Application-specific components.

---

## 🧩 Core UI Components

### Buttons & Actions

#### `Button`
**File**: `src/components/ui/button.tsx`  
**Purpose**: Primary action component with multiple variants and sizes

**Variants:**
- `default` - Primary blue button with shadow
- `destructive` - Red button for dangerous actions  
- `outline` - Bordered button with background on hover
- `secondary` - Muted secondary button
- `ghost` - Transparent with hover background
- `link` - Text link styling with underline

**Sizes:**
- `default` - Standard 36px height
- `sm` - Small 32px height  
- `lg` - Large 40px height
- `icon` - Square 36px for icon-only buttons

**Usage:**
```tsx
<Button variant="default" size="lg">
  Click me
</Button>

<Button variant="outline" size="icon">
  <Icon />
</Button>
```

#### `Toggle`
**File**: `src/components/ui/toggle.tsx`  
**Purpose**: Two-state button for on/off interactions

#### `Toggle Group`
**File**: `src/components/ui/toggle-group.tsx`  
**Purpose**: Group of related toggle buttons with single or multiple selection

### Form Components

#### `Input`
**File**: `src/components/ui/input.tsx`  
**Purpose**: Text input field with consistent styling

#### `Textarea`
**File**: `src/components/ui/textarea.tsx`  
**Purpose**: Multi-line text input

#### `Label`
**File**: `src/components/ui/label.tsx`  
**Purpose**: Accessible form labels

#### `Checkbox`
**File**: `src/components/ui/checkbox.tsx`  
**Purpose**: Single selection checkbox with indeterminate state

#### `Radio Group`
**File**: `src/components/ui/radio-group.tsx`  
**Purpose**: Single selection from multiple options

#### `Select`
**File**: `src/components/ui/select.tsx`  
**Purpose**: Dropdown selection component

#### `Switch`
**File**: `src/components/ui/switch.tsx`  
**Purpose**: Toggle switch for boolean settings

### Layout Components

#### `Card`
**File**: `src/components/ui/card.tsx`  
**Purpose**: Container component with header, content, and footer sections

**Sub-components:**
- `CardHeader` - Top section with title/description
- `CardContent` - Main content area  
- `CardFooter` - Bottom action area

#### `Separator`
**File**: `src/components/ui/separator.tsx`  
**Purpose**: Visual divider between content sections

#### `Aspect Ratio`
**File**: `src/components/ui/aspect-ratio.tsx`  
**Purpose**: Maintain consistent aspect ratios for media

#### `Resizable`
**File**: `src/components/ui/resizable.tsx`  
**Purpose**: Resizable panels with drag handles

### Navigation Components

#### `Tabs`
**File**: `src/components/ui/tabs.tsx`  
**Purpose**: Tabbed interface for content organization

#### `Accordion`
**File**: `src/components/ui/accordion.tsx`  
**Purpose**: Collapsible content sections

#### `Breadcrumb`
**File**: `src/components/ui/breadcrumb.tsx`  
**Purpose**: Navigation breadcrumb trail

#### `Pagination`
**File**: `src/components/ui/pagination.tsx`  
**Purpose**: Page navigation component

### Feedback Components

#### `Alert`
**File**: `src/components/ui/alert.tsx`  
**Purpose**: Contextual alert messages

**Variants:**
- `default` - Neutral information
- `destructive` - Error/warning alerts

#### `Badge`
**File**: `src/components/ui/badge.tsx`  
**Purpose**: Small status indicators

#### `Progress`
**File**: `src/components/ui/progress.tsx`  
**Purpose**: Progress indicator bar

#### `Skeleton`
**File**: `src/components/ui/skeleton.tsx`  
**Purpose**: Loading placeholder component

#### `Toaster` & `Toast`
**Files**: `src/components/ui/toaster.tsx`, `src/components/ui/toast.tsx`  
**Purpose**: Notification system using Sonner

### Overlay Components

#### `Dialog`
**File**: `src/components/ui/dialog.tsx`  
**Purpose**: Modal dialog with backdrop

#### `Sheet`
**File**: `src/components/ui/sheet.tsx`  
**Purpose**: Slide-out drawer component

#### `Popover`
**File**: `src/components/ui/popover.tsx`  
**Purpose**: Floating content overlay

#### `Tooltip`
**File**: `src/components/ui/tooltip.tsx`  
**Purpose**: Hover information tooltips

#### `Hover Card`
**File**: `src/components/ui/hover-card.tsx`  
**Purpose**: Rich content on hover

### Data Display

#### `Table`
**File**: `src/components/ui/table.tsx`  
**Purpose**: Structured data tables

#### `Avatar`
**File**: `src/components/ui/avatar.tsx`  
**Purpose**: User profile pictures with fallbacks

#### `Chart`
**File**: `src/components/ui/chart.tsx`  
**Purpose**: Data visualization using Recharts

#### `Calendar`
**File**: `src/components/ui/calendar.tsx`  
**Purpose**: Date picker calendar

---

## 🤖 Kibo UI Components

AI-focused components for enhanced user interactions.

### AI Conversation

#### `AIConversation`
**File**: `src/components/ui/kibo-ui/ai/conversation.tsx`  
**Purpose**: Container for AI chat interfaces with auto-scroll

**Features:**
- Auto-scroll to bottom on new messages
- Smooth scrolling behavior  
- Scroll-to-bottom button when not at bottom
- Proper accessibility with `role="log"`

**Usage:**
```tsx
<AIConversation>
  <AIConversationContent>
    {messages.map(message => (
      <div key={message.id}>{message.content}</div>
    ))}
  </AIConversationContent>
  <AIConversationScrollButton />
</AIConversation>
```

#### `AIMessage`
**File**: `src/components/ui/kibo-ui/ai/message.tsx`  
**Purpose**: Individual message component for AI conversations

#### `AIInput`
**File**: `src/components/ui/kibo-ui/ai/input.tsx`  
**Purpose**: Specialized input for AI prompts

#### `AIResponse`
**File**: `src/components/ui/kibo-ui/ai/response.tsx`  
**Purpose**: AI response display with typing indicators

#### `AIReasoning`
**File**: `src/components/ui/kibo-ui/ai/reasoning.tsx`  
**Purpose**: Display AI reasoning and thought processes

#### `AISuggestion`
**File**: `src/components/ui/kibo-ui/ai/suggestion.tsx`  
**Purpose**: Suggested prompts and actions

#### `AIBranch`
**File**: `src/components/ui/kibo-ui/ai/branch.tsx`  
**Purpose**: Conversation branching and threading

#### `AITool` & `AISource`
**Files**: `src/components/ui/kibo-ui/ai/tool.tsx`, `src/components/ui/kibo-ui/ai/source.tsx`  
**Purpose**: Tool usage and source citations in AI responses

### Code Display

#### `CodeBlock`
**File**: `src/components/ui/kibo-ui/code-block/index.tsx`  
**Purpose**: Syntax-highlighted code display using Shiki

**Features:**
- Multiple language support
- Theme-aware highlighting
- Copy-to-clipboard functionality
- Line numbers and highlighting

---

## 📧 Newsletter Components

Application-specific components for newsletter functionality.

### `LikeButton`
**File**: `src/components/newsletter/like-button.tsx`  
**Purpose**: Interactive like/unlike button for content engagement

**Features:**
- Optimistic updates for responsive feel
- Haptic feedback on mobile devices
- Floating hearts animation on like
- Loading states and error handling
- Device type detection and analytics
- Toast notifications for feedback
- Guest user support with disabled state

**Props:**
```tsx
interface LikeButtonProps {
  postId: string           // Newsletter post ID
  contentId: string        // Stable content ID
  contentType: ContentType // Type of content being liked
  contentTitle: string     // Human-readable content title
  userId?: string          // User ID (optional for guests)
  initialLiked?: boolean   // Initial like state
  initialCount?: number    // Initial like count
  size?: "sm" | "default" | "lg"
  showCount?: boolean      // Show like count
  onLikeChange?: (liked: boolean) => void
}
```

**Content Types:**
- `ARTICLE` - Main article content
- `KEY_INSIGHTS` - Key insights section
- `VIDEO_SCRIPT` - Video script section
- `EMAIL_TEMPLATE` - Email template section
- `SOCIAL_CONTENT` - Social media content

**Usage:**
```tsx
<LikeButton
  postId="newsletter-uuid"
  contentId="article-1"
  contentType="ARTICLE"
  contentTitle="Fed Rate Update"
  userId={user.id}
  size="default"
  showCount={true}
  onLikeChange={(liked) => console.log('Liked:', liked)}
/>
```

---

## 🎨 Design System

### Color Palette
- **Primary**: Blue brand colors
- **Secondary**: Muted grays
- **Destructive**: Red for errors/warnings
- **Success**: Green for positive actions
- **Warning**: Yellow/orange for cautions

### Typography
- **Font Family**: Signal (custom font)
- **Sizes**: xs, sm, base, lg, xl, 2xl, 3xl, 4xl
- **Weights**: Light, Normal, Bold, ExtraBold, Heavy

### Spacing
- **Scale**: 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64
- **Usage**: Consistent padding, margins, and gaps

### Shadows
- **xs**: Subtle elevation
- **sm**: Standard component elevation  
- **md**: Modal/dialog elevation
- **lg**: High-priority content
- **xl**: Maximum emphasis

---

## 🚀 Usage Guidelines

### Component Selection
1. **Start with shadcn/ui** - Use base components when possible
2. **Enhance with Kibo UI** - For AI-specific interfaces
3. **Create custom** - Only when existing components don't meet needs

### Accessibility
- All components follow WCAG 2.1 AA guidelines
- Proper ARIA labels and roles
- Keyboard navigation support
- Focus management and visual indicators

### Performance
- Tree-shakable imports
- Lazy loading for heavy components
- Optimized re-renders with React patterns
- Bundle splitting for component groups

### Customization
- Use `cn()` utility for conditional classes
- Leverage CSS custom properties for theming
- Override variants through `className` prop
- Extend components via composition

---

**Last Updated**: January 2025  
**Component Count**: 60+ shadcn/ui + 10+ Kibo UI + Newsletter components  
**Design System**: Tailwind CSS v4 + Custom Signal font