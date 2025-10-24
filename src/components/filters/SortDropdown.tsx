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
    label: 'Newest First',
    icon: Calendar,
    description: 'Most recently published'
  },
  {
    value: 'oldest' as const,
    label: 'Oldest First',
    icon: CalendarArrowDown,
    description: 'Oldest articles first'
  },
  {
    value: 'alpha-asc' as const,
    label: 'A → Z',
    icon: ArrowDownAZ,
    description: 'Alphabetical ascending'
  },
  {
    value: 'alpha-desc' as const,
    label: 'Z → A',
    icon: ArrowUpAZ,
    description: 'Alphabetical descending'
  }
];

export function SortDropdown({ value, onChange, className }: SortDropdownProps) {
  const selectedOption = SORT_OPTIONS.find((opt) => opt.value === value);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <div className="flex items-center gap-2">
          {selectedOption && (
            <selectedOption.icon className="h-4 w-4 text-gray-500" />
          )}
          <SelectValue placeholder="Sort by..." />
        </div>
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((option) => {
          const Icon = option.icon;
          return (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-gray-500" />
                <div>
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs text-gray-500">{option.description}</div>
                </div>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
