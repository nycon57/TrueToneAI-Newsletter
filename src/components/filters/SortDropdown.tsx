'use client';

import { ArrowDownAZ, ArrowUpAZ, Calendar, CalendarArrowDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type SortOption = 'newest' | 'oldest' | 'alpha-asc' | 'alpha-desc';

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
  className?: string;
}

const SORT_OPTIONS = [
  {
    value: 'newest' as const,
    label: 'Newest',
    icon: Calendar,
  },
  {
    value: 'oldest' as const,
    label: 'Oldest',
    icon: CalendarArrowDown,
  },
  {
    value: 'alpha-asc' as const,
    label: 'A → Z',
    icon: ArrowDownAZ,
  },
  {
    value: 'alpha-desc' as const,
    label: 'Z → A',
    icon: ArrowUpAZ,
  }
];

export function SortDropdown({ value, onChange, className }: SortDropdownProps) {
  const selectedOption = SORT_OPTIONS.find((opt) => opt.value === value);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className} aria-label="Sort articles">
        <SelectValue placeholder="Sort by..." />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((option) => {
          const Icon = option.icon;
          return (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-muted-foreground/70" aria-hidden="true" />
                {option.label}
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
