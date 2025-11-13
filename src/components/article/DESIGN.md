# Article Modal Design System

## Component Hierarchy

```
ArticleModal (Container)
├── Backdrop (blur + dark overlay)
└── Modal Container (white, rounded on desktop)
    ├── ArticleModalHeader (sticky)
    │   ├── Back Button (mobile)
    │   ├── Title (truncated on mobile, full on desktop)
    │   ├── Share Button
    │   ├── Close Button (desktop)
    │   └── Category Badges
    │
    ├── Content Area (flex container)
    │   ├── ArticleModalContent (70% on desktop, 100% on mobile)
    │   │   ├── Mobile Summary Card
    │   │   ├── Key Insights Callout (amber)
    │   │   └── Markdown Content (prose)
    │   │
    │   └── ArticleModalSidebar (30% on desktop, hidden on mobile)
    │       ├── Header ("Quick Actions")
    │       ├── Action Cards (scrollable)
    │       │   ├── PersonalizationActionCard (Video)
    │       │   ├── PersonalizationActionCard (Email)
    │       │   ├── PersonalizationActionCard (Social)
    │       │   └── PersonalizationActionCard (AI)
    │       └── Footer
    │           ├── Reading Progress Bar
    │           └── Back to Top Button
    │
    └── Mobile FAB (floating action button, mobile only)
```

## Layout Specifications

### Desktop (lg: 1024px+)
- **Modal**: 95vw × 95vh, max-width 1536px (7xl), rounded-2xl
- **Content Split**: 70% main content, 30% sidebar
- **Sidebar**: Fixed width 320px (xl: 384px), sticky scroll
- **Padding**: 2rem (32px) content areas
- **Header**: Sticky with blur backdrop when scrolling

### Tablet (md-lg: 768px-1023px)
- **Modal**: 95vw × 95vh, rounded-2xl
- **Content**: Full width, no sidebar
- **Actions**: Bottom action sheet (to be implemented)
- **Padding**: 1.5rem (24px) content areas

### Mobile (sm: <768px)
- **Modal**: Full screen (100vw × 100vh), no border radius
- **Header**: Compact with truncated title
- **FAB**: Bottom-right floating action button
- **Padding**: 1rem (16px) content areas

## Color Palette

### Primary Colors
```css
--orchid: Custom purple (primary brand)
--lavender: Light purple background
--indigo: Secondary accent
```

### Action Card Colors
Each action type has a specific color scheme for visual differentiation:

**Video Script**
- Gradient: `from-red-500 to-pink-500`
- Background: `bg-red-50 hover:bg-red-100`
- Border: `border-red-200`
- Badge: `bg-red-100 text-red-700`

**Email Template**
- Gradient: `from-green-500 to-emerald-500`
- Background: `bg-green-50 hover:bg-green-100`
- Border: `border-green-200`
- Badge: `bg-green-100 text-green-700`

**Social Posts**
- Gradient: `from-purple-500 to-pink-500`
- Background: `bg-purple-50 hover:bg-purple-100`
- Border: `border-purple-200`
- Badge: `bg-purple-100 text-purple-700`

**AI Personalization**
- Gradient: `from-indigo to-orchid`
- Background: `bg-lavender/30 hover:bg-lavender/50`
- Border: `border-lavender/50`
- Badge: `bg-lavender/30 text-orchid`

### Category Badge Colors
- **Rate Alert**: `bg-red-100 text-red-700 border-red-200`
- **Program Update**: `bg-blue-100 text-blue-700 border-blue-200`
- **Credit Update**: `bg-green-100 text-green-700 border-green-200`
- **Market News**: `bg-purple-100 text-purple-700 border-purple-200`
- **Default**: `bg-lavender/30 text-orchid border-lavender/50`

## Typography

### Article Content
Uses Tailwind's `@tailwindcss/typography` plugin with custom configuration:

```css
/* Base */
font-size: 18-20px (prose-lg)
line-height: 1.7
color: gray-700

/* Headings */
H2: 2xl (24px), bold, mt-12, mb-6
H3: xl (20px), semibold, mt-8, mb-4

/* Paragraphs */
text-lg (18px), leading-relaxed, my-6

/* Lists */
text-lg, marker:text-orchid, my-6
```

### UI Text
- **Modal Title**: 2xl-3xl, bold, gray-900
- **Card Titles**: sm-base, bold, gray-900
- **Descriptions**: xs-sm, gray-600
- **Body Text**: base, gray-700

## Spacing System

Following Tailwind's spacing scale:

- **Component gaps**: 4-6 (1-1.5rem)
- **Section margins**: 8-12 (2-3rem)
- **Card padding**: 4-6 (1-1.5rem)
- **Content padding**: 6-8 (1.5-2rem)

## Animations

All animations use Motion (Framer Motion):

### Modal Entrance/Exit
```tsx
initial={{ scale: 0.95, opacity: 0, y: 20 }}
animate={{ scale: 1, opacity: 1, y: 0 }}
exit={{ scale: 0.95, opacity: 0, y: 20 }}
transition={{ type: 'spring', damping: 25, stiffness: 300 }}
```

### Backdrop
```tsx
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
transition={{ duration: 0.2 }}
```

### Header
```tsx
initial={{ y: -20, opacity: 0 }}
animate={{ y: 0, opacity: 1 }}
transition={{ duration: 0.3 }}
```

### Action Cards (Staggered)
```tsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: 0.1 * index }}
```

### Expand/Collapse
```tsx
initial={{ height: 0, opacity: 0 }}
animate={{ height: 'auto', opacity: 1 }}
exit={{ height: 0, opacity: 0 }}
transition={{ duration: 0.2 }}
```

## Interactive States

### Buttons
- **Hover**: Slight scale (105%), shadow increase
- **Active**: Scale down (95%)
- **Disabled**: Opacity 50%, pointer-events-none
- **Focus**: Ring 3px with orchid color

### Action Cards
- **Default**: Border 2px, shadow-sm
- **Hover**: Border color intensifies, shadow-md
- **Expanded**: Ring 2px with color-coded ring
- **Generating**: Spinning loader, disabled state

### Copy Button
- **Default**: Copy icon + "Copy" text
- **Copied**: Checkmark icon + "Copied!" text (green)
- **Transition**: 200ms scale animation

## Accessibility Features

### ARIA Labels
```tsx
role="dialog"
aria-modal="true"
aria-labelledby="article-modal-title"
aria-label="Close modal"
aria-label="Go back"
aria-label="Share article"
```

### Keyboard Navigation
- **Tab Order**: Header actions → Content → Sidebar actions
- **ESC Key**: Closes modal
- **Focus Trap**: Keeps focus within modal when open
- **Focus Restoration**: Returns focus to trigger element on close

### Screen Readers
- Semantic HTML structure
- Hidden close text: `<span className="sr-only">Close</span>`
- Descriptive button labels
- Progress announcements

### Visual Accessibility
- **Contrast Ratios**: All text meets WCAG AA (4.5:1 minimum)
- **Focus Indicators**: Clear 3px ring on all interactive elements
- **Color Independence**: Not relying solely on color for information
- **Text Sizing**: Supports browser text zoom

## Scroll Behavior

### Content Area
- **Smooth Scroll**: `scroll-behavior: smooth`
- **Scroll Progress**: Calculated on scroll event
- **Custom Event**: `article-scroll-progress` dispatched to window

### Sticky Header
- **Trigger**: Scroll > 20px
- **Effect**: Background blur, shadow
- **Transition**: Smooth 200ms

### Back to Top
- **Visibility**: Shows when scroll > 10%
- **Animation**: Fade in/out
- **Behavior**: Smooth scroll to top

## Shadow System

Following Tailwind's shadow scale:

- **Cards**: `shadow-sm` (subtle)
- **Modal**: `shadow-2xl` (dramatic)
- **Hover States**: `shadow-md` to `shadow-lg`
- **FAB**: `shadow-lg` to `shadow-xl`

## Border Radius

Consistent rounded corners:

- **Modal**: `rounded-2xl` (16px) on desktop
- **Cards**: `rounded-xl` (12px)
- **Buttons**: `rounded-md` (6px)
- **Action Icons**: `rounded-xl` (12px)
- **FAB**: `rounded-full`

## Performance Considerations

### Optimization Techniques
- **Lazy Animations**: Only animate visible elements
- **Debounced Scroll**: Throttle scroll event listeners
- **Memoization**: Prevent unnecessary re-renders
- **Code Splitting**: Modal loaded on-demand
- **Image Optimization**: Next.js Image component

### Target Metrics
- **Modal Open**: < 200ms
- **Scroll FPS**: 60fps consistent
- **Animation Smoothness**: No jank
- **First Paint**: < 100ms after open

## Responsive Images

When adding images to markdown content:

```tsx
![Alt text](image.jpg)
// Renders with responsive classes
className="w-full h-auto rounded-lg my-8"
```

## Print Styles

Future consideration for print-friendly article view:

```css
@media print {
  .sidebar { display: none; }
  .modal { background: white; }
  .prose { max-width: 100%; }
}
```

## Dark Mode Support

Ready for dark mode implementation:

```tsx
// Article content
className="dark:bg-gray-900 dark:text-gray-100"

// Cards
className="dark:bg-gray-800 dark:border-gray-700"

// Badges
className="dark:bg-gray-700 dark:text-gray-300"
```

Currently using light mode only, but structure supports easy dark mode addition via `next-themes`.
