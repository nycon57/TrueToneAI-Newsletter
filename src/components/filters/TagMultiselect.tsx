'use client';

import { Check, ChevronsUpDown, X, Tag } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { CATEGORIES, getAllTags, type Tag } from '@/lib/constants/categories';
import { cn } from '@/lib/utils';

interface TagMultiselectProps {
  selectedCategories: string[];
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  className?: string;
}

export function TagMultiselect({
  selectedCategories,
  selectedTags,
  onChange,
  className,
}: TagMultiselectProps) {
  const [open, setOpen] = useState(false);

  // Helper function to find which category a tag belongs to
  const findCategoryForTag = (tagId: string) => {
    return CATEGORIES.find(cat => cat.tags.some(tag => tag.id === tagId));
  };

  // Filter tags based on selected categories
  const availableTags = useMemo(() => {
    if (selectedCategories.length === 0) {
      return getAllTags();
    }

    return CATEGORIES.filter((cat) => selectedCategories.includes(cat.id)).flatMap(
      (cat) => cat.tags
    );
  }, [selectedCategories]);

  // Group tags by category for display
  const groupedTags = useMemo(() => {
    if (selectedCategories.length === 0) {
      return CATEGORIES.map((cat) => ({
        category: cat,
        tags: cat.tags,
      }));
    }

    return CATEGORIES.filter((cat) => selectedCategories.includes(cat.id)).map((cat) => ({
      category: cat,
      tags: cat.tags,
    }));
  }, [selectedCategories]);

  const toggleTag = (tagId: string) => {
    const newSelection = selectedTags.includes(tagId)
      ? selectedTags.filter((id) => id !== tagId)
      : [...selectedTags, tagId];
    onChange(newSelection);
  };

  const removeTag = (tagId: string) => {
    onChange(selectedTags.filter((id) => id !== tagId));
  };

  // Get selected tag objects
  const selectedTagObjects = availableTags.filter((tag) =>
    selectedTags.includes(tag.id)
  );

  const triggerLabel =
    selectedTags.length > 0
      ? `Tags (${selectedTags.length} selected)`
      : 'All tags';

  return (
    <div className={cn('w-full space-y-2', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select tags"
            className="w-full justify-between font-normal"
            disabled={selectedCategories.length === 0 && availableTags.length === 0}
          >
            <span className="truncate">{triggerLabel}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search tags..." />
            <CommandList>
              <CommandEmpty>No tags found.</CommandEmpty>
              {groupedTags.map(({ category, tags }) => {
                const CategoryIcon = category.icon;
                return (
                  <CommandGroup key={category.id} heading={
                    <div className="flex items-center gap-2">
                      <CategoryIcon className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{category.label}</span>
                    </div>
                  }>
                    {tags.map((tag) => {
                      const isSelected = selectedTags.includes(tag.id);

                      return (
                        <CommandItem
                          key={tag.id}
                          value={`${category.label} ${tag.label}`}
                          onSelect={() => toggleTag(tag.id)}
                          className="cursor-pointer"
                        >
                          <div className="flex flex-1 items-center gap-2">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => toggleTag(tag.id)}
                              aria-label={`Select ${tag.label}`}
                            />
                            <div className="flex flex-col flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{tag.label}</span>
                                <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                  {category.label}
                                </span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {tag.description}
                              </span>
                            </div>
                          </div>
                          {isSelected && (
                            <Check className="ml-auto h-4 w-4 text-primary" aria-hidden="true" />
                          )}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                );
              })}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedTagObjects.length > 0 && (
        <div className="flex flex-wrap gap-2" role="list" aria-label="Selected tags">
          {selectedTagObjects.map((tag) => {
            const category = findCategoryForTag(tag.id);
            const CategoryIcon = category?.icon;

            return (
              <Badge
                key={tag.id}
                variant="outline"
                className="gap-1 bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800"
                role="listitem"
              >
                {CategoryIcon && <CategoryIcon className="h-3 w-3" aria-hidden="true" />}
                {tag.label}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => removeTag(tag.id)}
                  aria-label={`Remove ${tag.label}`}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
