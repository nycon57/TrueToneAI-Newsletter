# Article Filter Components

A comprehensive, accessible, and responsive filter system for browsing newsletter articles. Built with Tailwind CSS, shadcn/ui, and TypeScript.

## Components

### ArticleFilterBar (Main Component)

The primary filter interface that combines all filter controls into a cohesive, collapsible UI.

**Features:**
- Search with debounced input
- Sort dropdown
- Collapsible filter panel with smooth animations
- Active filter count badge
- Filter badges with individual remove buttons
- Clear all filters functionality
- Fully responsive (mobile-first design)
- Accessible with ARIA labels and keyboard navigation

**Usage:**
```tsx
import { ArticleFilterBar, type ArticleFilters } from '@/components/filters';
import { useState } from 'react';

function MyPage() {
  const [filters, setFilters] = useState<ArticleFilters>({
    search: '',
    sort: 'newest',
    categories: [],
    tags: [],
    generations: [],
  });

  return (
    <ArticleFilterBar
      filters={filters}
      onFiltersChange={setFilters}
    />
  );
}
```

### SearchInput

Real-time search with debouncing and clear button.

**Props:**
- `value: string` - Current search value
- `onChange: (value: string) => void` - Callback when search changes
- `placeholder?: string` - Placeholder text (default: "Search articles...")
- `debounceMs?: number` - Debounce delay in milliseconds (default: 300)
- `className?: string` - Additional CSS classes

**Features:**
- Search icon on left
- Clear button (X) appears when text exists
- 300ms debounce by default
- Full width responsive
- Accessible with proper labels

### SortDropdown

Dropdown for sorting articles.

**Sort Options:**
- `newest` - Newest First
- `oldest` - Oldest First
- `alpha-asc` - A → Z
- `alpha-desc` - Z → A

**Props:**
- `value: SortOption` - Current sort value
- `onChange: (value: SortOption) => void` - Callback when sort changes
- `className?: string` - Additional CSS classes

### CategoryMultiselect

Multiselect dropdown for filtering by article categories.

**Features:**
- Checkbox list with icons
- Shows selected items as removable badges
- Trigger button displays count: "Categories (3 selected)"
- Uses categories from `/src/lib/constants/categories.ts`
- Searchable dropdown
- Accessible keyboard navigation

**Props:**
- `selectedCategories: string[]` - Array of selected category IDs
- `onChange: (categories: string[]) => void` - Callback when selection changes
- `className?: string` - Additional CSS classes

**Badge Color:** Purple (`bg-purple-50 text-purple-700`)

### TagMultiselect

Smart multiselect that filters tags based on selected categories.

**Features:**
- Automatically filters tags by selected categories
- Shows all tags when no categories selected
- Groups tags by category in dropdown
- Selected tags shown as removable badges
- Displays count in trigger: "Tags (5 selected)"

**Props:**
- `selectedCategories: string[]` - Currently selected categories
- `selectedTags: string[]` - Currently selected tags
- `onChange: (tags: string[]) => void` - Callback when selection changes
- `className?: string` - Additional CSS classes

**Badge Color:** Blue (`bg-blue-50 text-blue-700`)

### GenerationsMultiselect

Multiselect for filtering by generation types.

**Generation Types:**
- `default` - Default Content Only
- `key_insights` - Key Insights
- `video_script` - Video Scripts
- `email_template` - Email Templates
- `social_media` - Social Media

**Props:**
- `selectedGenerations: GenerationType[]` - Array of selected generation types
- `onChange: (generations: GenerationType[]) => void` - Callback when selection changes
- `className?: string` - Additional CSS classes

**Badge Color:** Green (`bg-green-50 text-green-700`)

## Type Definitions

```typescript
// Filter state interface
interface ArticleFilters {
  search: string;
  sort: SortOption;
  categories: string[];
  tags: string[];
  generations: GenerationType[];
}

// Sort options
type SortOption = 'newest' | 'oldest' | 'alpha-asc' | 'alpha-desc';

// Generation types
type GenerationType =
  | 'default'
  | 'key_insights'
  | 'video_script'
  | 'email_template'
  | 'social_media';
```

## Integration with URL State (nuqs)

For persistent filters across page reloads, integrate with nuqs:

```tsx
import { useQueryStates, parseAsString, parseAsArrayOf, parseAsStringEnum } from 'nuqs';
import { ArticleFilterBar } from '@/components/filters';

function ArticleBrowser() {
  const [filters, setFilters] = useQueryStates({
    search: parseAsString.withDefault(''),
    sort: parseAsStringEnum(['newest', 'oldest', 'alpha-asc', 'alpha-desc'])
      .withDefault('newest'),
    categories: parseAsArrayOf(parseAsString).withDefault([]),
    tags: parseAsArrayOf(parseAsString).withDefault([]),
    generations: parseAsArrayOf(parseAsString).withDefault([]),
  });

  return (
    <ArticleFilterBar
      filters={filters}
      onFiltersChange={setFilters}
    />
  );
}
```

## Responsive Breakpoints

- **Mobile (default):** Stacked layout, full-width components
- **sm (640px+):** Search and sort side-by-side
- **lg (1024px+):** Filter controls in 3-column grid

## Accessibility Features

- Proper ARIA labels on all interactive elements
- Keyboard navigation support in all dropdowns
- Focus indicators with ring-orchid color
- Screen reader friendly
- Semantic HTML structure
- Role attributes for list items

## Styling

The components use Tailwind CSS v4 with:
- Brand colors: orchid (primary), purple, blue, green
- Consistent spacing: p-4, gap-4
- Smooth transitions using Motion library
- Dark mode support via next-themes
- Focus states with proper ring colors

## Dependencies

- React 19
- Tailwind CSS 4
- shadcn/ui components (Command, Popover, Badge, Input, Select, Button, Checkbox, Separator)
- Radix UI primitives
- Motion (for animations)
- Lucide React (for icons)
- class-variance-authority
- clsx & tailwind-merge

## File Structure

```
src/components/filters/
├── ArticleFilterBar.tsx          # Main filter bar component
├── SearchInput.tsx                # Search with debounce
├── SortDropdown.tsx               # Sort dropdown
├── CategoryMultiselect.tsx        # Category filter
├── TagMultiselect.tsx             # Tag filter (smart filtering)
├── GenerationsMultiselect.tsx     # Generation type filter
├── index.ts                       # Export barrel file
├── ArticleFilterBar.example.tsx   # Usage examples
└── README.md                      # This file
```

## Examples

See `ArticleFilterBar.example.tsx` for complete working examples including:
- Basic usage with local state
- URL state integration with nuqs
- Filter result display
- TypeScript type usage
