'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SearchInput } from './SearchInput';
import { SortDropdown, type SortOption } from './SortDropdown';
import { CategoryMultiselect } from './CategoryMultiselect';
import { TagMultiselect } from './TagMultiselect';
import { PersonalizationsMultiselect } from './PersonalizationsMultiselect';
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
  const [isExpanded, setIsExpanded] = useState(false);

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
    setIsExpanded(false);
  };


  return (
    <div className={cn('w-full', className)}>
      {/* Unified Container */}
      <div className="rounded-lg border bg-card shadow-sm">
        {/* Top Bar - Search and Sort */}
        <div className="flex flex-col gap-4 sm:flex-row p-4 border-b">
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

        {/* Collapsible Filter Section */}
        {/* Panel Header */}
        <div className="flex w-full items-center justify-between p-4 border-b">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex flex-1 items-center gap-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
            aria-expanded={isExpanded}
            aria-controls="filter-panel-content"
          >
            <span className="font-medium">
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-2 text-sm text-muted-foreground">
                  ({activeFilterCount} active)
                </span>
              )}
            </span>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            )}
          </button>
          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-8 text-xs text-muted-foreground hover:text-foreground"
              >
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Panel Content */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              id="filter-panel-content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <Separator />
              <div className="space-y-4 p-4">
                {/* Filter Controls */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
