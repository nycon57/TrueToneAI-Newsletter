'use client';

import { Button } from '@/components/ui/button';
import { SearchInput } from './SearchInput';
import { SortDropdown, type SortOption } from './SortDropdown';
import { CategoryMultiselect } from './CategoryMultiselect';
import { TagMultiselect } from './TagMultiselect';
import { PersonalizationsMultiselect, type PersonalizationType } from './PersonalizationsMultiselect';
import { CATEGORIES, getCategoryById } from '@/lib/constants/categories';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export interface ArticleFilters {
  search: string;
  sort: SortOption;
  categories: string[];
  tags: string[];
  personalizations: PersonalizationType[];
}

interface ArticleFilterBarProps {
  filters: ArticleFilters;
  onFiltersChange: (filters: ArticleFilters) => void;
  className?: string;
}

export function ArticleFilterBar({
  filters,
  onFiltersChange,
  className,
}: ArticleFilterBarProps) {
  // Count active filters (excluding search and sort)
  const activeFilterCount =
    filters.categories.length + filters.tags.length + filters.personalizations.length;

  const updateFilters = (updates: Partial<ArticleFilters>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  // Helper function to find which category a tag belongs to
  const findCategoryForTag = (tagId: string) => {
    return CATEGORIES.find(cat => cat.tags.some(tag => tag.id === tagId));
  };

  // Handle category changes with auto-sync logic
  const handleCategoryChange = (newCategories: string[]) => {
    const removedCategories = filters.categories.filter(c => !newCategories.includes(c));

    // Get all tags that belong to removed categories
    const tagsToRemove = removedCategories.flatMap(categoryId => {
      const category = getCategoryById(categoryId);
      return category?.tags.map(t => t.id) || [];
    });

    // Filter out tags from removed categories
    const newTags = filters.tags.filter(tagId => !tagsToRemove.includes(tagId));

    // Show toast if tags were removed
    if (newTags.length < filters.tags.length) {
      const count = filters.tags.length - newTags.length;
      const removedCategoryNames = removedCategories
        .map(id => getCategoryById(id)?.label)
        .filter(Boolean)
        .join(', ');

      toast.info(`Removed ${count} tag${count > 1 ? 's' : ''} from ${removedCategoryNames}`);
    }

    updateFilters({ categories: newCategories, tags: newTags });
  };

  // Handle tag changes with auto-sync logic
  const handleTagChange = (newTags: string[]) => {
    const addedTags = newTags.filter(t => !filters.tags.includes(t));

    // For each added tag, ensure its category is selected
    const categoriesToAdd: string[] = [];
    const categoryLabelsToAdd: string[] = [];

    addedTags.forEach(tagId => {
      const category = findCategoryForTag(tagId);
      if (category && !filters.categories.includes(category.id) && !categoriesToAdd.includes(category.id)) {
        categoriesToAdd.push(category.id);
        categoryLabelsToAdd.push(category.label);
      }
    });

    // Auto-add categories if needed
    if (categoriesToAdd.length > 0) {
      const newCategories = [...filters.categories, ...categoriesToAdd];
      updateFilters({ categories: newCategories, tags: newTags });

      toast.success(
        categoryLabelsToAdd.length === 1
          ? `Added ${categoryLabelsToAdd[0]} category`
          : `Added ${categoryLabelsToAdd.length} categories: ${categoryLabelsToAdd.join(', ')}`
      );
    } else {
      updateFilters({ tags: newTags });
    }
  };

  const clearAllFilters = () => {
    onFiltersChange({
      ...filters,
      categories: [],
      tags: [],
      personalizations: [],
    });
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Unified Container */}
      <div className="rounded-lg border bg-card shadow-sm">
        {/* Top Bar - Search and Sort */}
        <div className="flex flex-col gap-4 sm:flex-row p-4">
          <div className="w-full sm:w-3/5">
            <SearchInput
              value={filters.search}
              onChange={(search) => updateFilters({ search })}
            />
          </div>
          <div className="w-full sm:w-2/5">
            <SortDropdown
              value={filters.sort}
              onChange={(sort) => updateFilters({ sort })}
            />
          </div>
        </div>

        {/* Filter Controls - Always Visible */}
        <div className="border-t px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-muted-foreground">
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1.5">
                  ({activeFilterCount} active)
                </span>
              )}
            </span>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-7 text-xs text-muted-foreground hover:text-foreground"
              >
                Clear All
              </Button>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <CategoryMultiselect
              selectedCategories={filters.categories}
              onChange={handleCategoryChange}
            />
            <TagMultiselect
              selectedCategories={filters.categories}
              selectedTags={filters.tags}
              onChange={handleTagChange}
            />
            <PersonalizationsMultiselect
              selectedPersonalizations={filters.personalizations}
              onChange={(personalizations) => updateFilters({ personalizations })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
