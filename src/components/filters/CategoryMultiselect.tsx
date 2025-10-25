'use client';

import { Check, ChevronsUpDown, X } from 'lucide-react';
import { useState } from 'react';
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
import { CATEGORIES, type Category } from '@/lib/constants/categories';
import { cn } from '@/lib/utils';

interface CategoryMultiselectProps {
  selectedCategories: string[];
  onChange: (categories: string[]) => void;
  className?: string;
}

export function CategoryMultiselect({
  selectedCategories,
  onChange,
  className,
}: CategoryMultiselectProps) {
  const [open, setOpen] = useState(false);

  const toggleCategory = (categoryId: string) => {
    const newSelection = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];
    onChange(newSelection);
  };

  const removeCategory = (categoryId: string) => {
    onChange(selectedCategories.filter((id) => id !== categoryId));
  };

  const selectedCategoryObjects = CATEGORIES.filter((cat) =>
    selectedCategories.includes(cat.id)
  );

  const triggerLabel =
    selectedCategories.length > 0
      ? `Categories (${selectedCategories.length} selected)`
      : 'All categories';

  return (
    <div className={cn('w-full space-y-2', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select categories"
            className="w-full justify-between font-normal"
          >
            <span className="truncate">{triggerLabel}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search categories..." />
            <CommandList>
              <CommandEmpty>No categories found.</CommandEmpty>
              <CommandGroup>
                {CATEGORIES.map((category) => {
                  const Icon = category.icon;
                  const isSelected = selectedCategories.includes(category.id);

                  return (
                    <CommandItem
                      key={category.id}
                      value={category.label}
                      onSelect={() => toggleCategory(category.id)}
                      className="cursor-pointer"
                    >
                      <div className="flex flex-1 items-center gap-2">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleCategory(category.id)}
                          aria-label={`Select ${category.label}`}
                        />
                        <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        <div className="flex flex-col">
                          <span className="font-medium">{category.label}</span>
                          <span className="text-xs text-muted-foreground">
                            {category.description}
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
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedCategoryObjects.length > 0 && (
        <div className="flex flex-wrap gap-2" role="list" aria-label="Selected categories">
          {selectedCategoryObjects.map((category) => {
            const Icon = category.icon;
            return (
              <Badge
                key={category.id}
                variant="outline"
                className="gap-1 bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800"
                role="listitem"
              >
                <Icon className="h-3 w-3" aria-hidden="true" />
                {category.label}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => removeCategory(category.id)}
                  aria-label={`Remove ${category.label}`}
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
