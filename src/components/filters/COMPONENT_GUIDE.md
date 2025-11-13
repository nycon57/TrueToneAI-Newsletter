# Article Filter Components - Quick Reference Guide

## Visual Component Hierarchy

```
ArticleFilterBar
│
├── Top Bar (Always Visible)
│   ├── SearchInput (60% width on desktop)
│   │   ├── Search Icon (left)
│   │   ├── Input Field
│   │   └── Clear Button (right, when text exists)
│   │
│   └── SortDropdown (40% width on desktop)
│       ├── Icon + Label
│       └── Options: Newest | Oldest | A→Z | Z→A
│
└── Collapsible Filter Panel
    ├── Panel Header
    │   ├── "Filters (X active)"
    │   ├── "Clear All" button (when filters active)
    │   └── Chevron icon (expand/collapse)
    │
    └── Panel Content (when expanded)
        ├── Filter Controls Grid
        │   ├── CategoryMultiselect
        │   │   ├── Trigger: "Categories (X selected)"
        │   │   ├── Dropdown: Checkbox list with icons
        │   │   └── Badges: Purple with category icon
        │   │
        │   ├── TagMultiselect
        │   │   ├── Trigger: "Tags (X selected)"
        │   │   ├── Dropdown: Grouped by category
        │   │   └── Badges: Blue
        │   │
        │   └── GenerationsMultiselect
        │       ├── Trigger: "Generations (X selected)"
        │       ├── Dropdown: Checkbox list with icons
        │       └── Badges: Green with generation icon
        │
        └── Active Filter Badges Section
            ├── Heading: "Active Filters"
            └── All selected filters as removable badges
```

## Component Props Quick Reference

### ArticleFilterBar
```typescript
interface ArticleFilterBarProps {
  filters: ArticleFilters;           // Current filter state
  onFiltersChange: (filters: ArticleFilters) => void;
  className?: string;
}

interface ArticleFilters {
  search: string;                    // Search query
  sort: SortOption;                  // Sort order
  categories: string[];              // Selected category IDs
  tags: string[];                    // Selected tag IDs
  generations: GenerationType[];     // Selected generation types
}
```

### SearchInput
```typescript
interface SearchInputProps {
  value: string;                     // Current search value
  onChange: (value: string) => void; // Debounced callback
  placeholder?: string;              // Default: "Search articles..."
  className?: string;
  debounceMs?: number;              // Default: 300
}
```

### SortDropdown
```typescript
interface SortDropdownProps {
  value: SortOption;                 // Current sort
  onChange: (value: SortOption) => void;
  className?: string;
}

type SortOption = 'newest' | 'oldest' | 'alpha-asc' | 'alpha-desc';
```

### CategoryMultiselect
```typescript
interface CategoryMultiselectProps {
  selectedCategories: string[];      // Array of category IDs
  onChange: (categories: string[]) => void;
  className?: string;
}
```

### TagMultiselect
```typescript
interface TagMultiselectProps {
  selectedCategories: string[];      // For smart filtering
  selectedTags: string[];            // Array of tag IDs
  onChange: (tags: string[]) => void;
  className?: string;
}
```

### GenerationsMultiselect
```typescript
interface GenerationsMultiselectProps {
  selectedGenerations: GenerationType[];
  onChange: (generations: GenerationType[]) => void;
  className?: string;
}

type GenerationType =
  | 'default'
  | 'key_insights'
  | 'video_script'
  | 'email_template'
  | 'social_media';
```

## Color Coding Reference

### Filter Badge Colors
```css
/* Categories - Purple */
bg-purple-50 text-purple-700 border-purple-200
hover:bg-purple-100
dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800

/* Tags - Blue */
bg-blue-50 text-blue-700 border-blue-200
hover:bg-blue-100
dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800

/* Generations - Green */
bg-green-50 text-green-700 border-green-200
hover:bg-green-100
dark:bg-green-950 dark:text-green-300 dark:border-green-800
```

## Responsive Layout Breakpoints

### Mobile (< 640px)
```
┌─────────────────────┐
│   SearchInput       │  Full width
├─────────────────────┤
│   SortDropdown      │  Full width
└─────────────────────┘

Filter Panel (Expanded):
┌─────────────────────┐
│ CategoryMultiselect │  Full width
├─────────────────────┤
│ TagMultiselect      │  Full width
├─────────────────────┤
│ GenerationsMulti    │  Full width
└─────────────────────┘
```

### Tablet (640px - 1024px)
```
┌─────────────┬───────┐
│ SearchInput │ Sort  │  60% / 40% split
└─────────────┴───────┘

Filter Panel (Expanded):
┌───────────┬───────────┐
│ Category  │ Tags      │  2 columns
├───────────┴───────────┤
│ Generations           │  Full width
└───────────────────────┘
```

### Desktop (1024px+)
```
┌─────────────┬───────┐
│ SearchInput │ Sort  │  60% / 40% split
└─────────────┴───────┘

Filter Panel (Expanded):
┌──────────┬──────────┬──────────┐
│ Category │ Tags     │ Gener.   │  3 columns
└──────────┴──────────┴──────────┘
```

## State Flow Diagram

```
User Interaction
       ↓
Component Updates Local State
       ↓
Calls onChange Callback
       ↓
Parent Updates Filter State
       ↓
New Props Flow to Components
       ↓
UI Updates
```

### Example: Search Flow
```
1. User types in SearchInput
2. Local state updates immediately (for responsive UX)
3. After 300ms debounce → onChange callback fires
4. Parent updates filter.search
5. New value flows back to SearchInput
6. Parent can fetch filtered data
```

### Example: Category Selection Flow
```
1. User clicks category checkbox
2. CategoryMultiselect updates selection
3. onChange fires with new categories array
4. Parent updates filter.categories
5. TagMultiselect receives new selectedCategories prop
6. TagMultiselect filters available tags
7. Invalid tags are automatically removed
8. Badge displays update
```

## Icon Reference

### Sort Options
- **Newest**: `Calendar` icon
- **Oldest**: `CalendarArrowDown` icon
- **A → Z**: `ArrowDownAZ` icon
- **Z → A**: `ArrowUpAZ` icon

### Generation Types
- **Default Content**: `FileText` icon
- **Key Insights**: `Lightbulb` icon
- **Video Scripts**: `Video` icon
- **Email Templates**: `Mail` icon
- **Social Media**: `Share2` icon

### UI Controls
- **Search**: `Search` icon
- **Clear**: `X` icon
- **Expand**: `ChevronDown` icon
- **Collapse**: `ChevronUp` icon
- **Dropdown**: `ChevronsUpDown` icon
- **Selected**: `Check` icon

## Accessibility Checklist

### Keyboard Navigation
- ✅ All dropdowns support keyboard navigation
- ✅ Tab order is logical
- ✅ Enter/Space to toggle checkboxes
- ✅ Escape to close dropdowns
- ✅ Arrow keys to navigate options

### Screen Readers
- ✅ All interactive elements have aria-labels
- ✅ Role attributes on lists and list items
- ✅ aria-expanded on collapsible panel
- ✅ Icon elements marked aria-hidden="true"
- ✅ Proper semantic HTML structure

### Focus Indicators
- ✅ Visible focus rings on all interactive elements
- ✅ Focus rings use brand color (orchid)
- ✅ 3px ring width for clarity
- ✅ Offset for better visibility

## Common Patterns

### Initialize Filter State
```typescript
const initialFilters: ArticleFilters = {
  search: '',
  sort: 'newest',
  categories: [],
  tags: [],
  generations: [],
};
```

### Handle Filter Changes
```typescript
const handleFiltersChange = (newFilters: ArticleFilters) => {
  setFilters(newFilters);
  // Optional: Update URL
  // Optional: Fetch filtered data
  // Optional: Track analytics
};
```

### Access Individual Filter Values
```typescript
const { search, sort, categories, tags, generations } = filters;

// Use in API calls
const fetchArticles = async () => {
  const response = await fetch('/api/articles', {
    method: 'POST',
    body: JSON.stringify({ search, sort, categories, tags, generations }),
  });
  // ...
};
```

## Performance Tips

1. **Debounce Search**: Already implemented (300ms default)
2. **Memoize Tag Filtering**: Already implemented with useMemo
3. **Lazy Load Articles**: Implement in parent component
4. **URL State**: Use nuqs for persistence without re-renders
5. **Optimize Re-renders**: Use React.memo if needed

## Testing Checklist

### Functionality
- [ ] Search updates with debounce
- [ ] Clear button appears/works
- [ ] Sort changes apply
- [ ] Categories can be selected/removed
- [ ] Tags filter based on categories
- [ ] Generations can be selected/removed
- [ ] Panel expands/collapses smoothly
- [ ] Clear All removes all filters
- [ ] Badge remove buttons work
- [ ] Active filter count is accurate

### Responsive
- [ ] Mobile layout stacks correctly
- [ ] Tablet layout uses 2 columns
- [ ] Desktop layout uses 3 columns
- [ ] Search/sort split is correct (60/40)
- [ ] Badges wrap properly on narrow screens

### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader announces changes
- [ ] Focus indicators are visible
- [ ] ARIA labels are correct
- [ ] Color contrast meets WCAG AA

## Quick Start

1. **Import the component**:
   ```typescript
   import { ArticleFilterBar, type ArticleFilters } from '@/components/filters';
   ```

2. **Set up state**:
   ```typescript
   const [filters, setFilters] = useState<ArticleFilters>({
     search: '',
     sort: 'newest',
     categories: [],
     tags: [],
     generations: [],
   });
   ```

3. **Render the component**:
   ```tsx
   <ArticleFilterBar
     filters={filters}
     onFiltersChange={setFilters}
   />
   ```

4. **Use the filters**:
   ```typescript
   useEffect(() => {
     // Fetch filtered articles
     fetchArticles(filters);
   }, [filters]);
   ```

That's it! The component handles all the complex filtering logic internally.
