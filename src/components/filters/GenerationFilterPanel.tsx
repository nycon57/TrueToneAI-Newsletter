'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, Filter, X, Lightbulb, Video, Mail, Share2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export interface GenerationFilters {
  contentTypes: string[];
  platforms: string[];
  dateRange: 'all' | 'week' | 'month' | 'custom';
  customDateFrom?: string;
  customDateTo?: string;
}

interface GenerationFilterPanelProps {
  filters: GenerationFilters;
  onFiltersChange: (filters: GenerationFilters) => void;
  activeFilterCount: number;
  className?: string;
}

const CONTENT_TYPES = [
  { id: 'KEY_INSIGHTS', label: 'Key Insights', icon: Lightbulb, color: 'text-purple-600' },
  { id: 'VIDEO_SCRIPT', label: 'Video Scripts', icon: Video, color: 'text-red-600' },
  { id: 'EMAIL_TEMPLATE', label: 'Email Templates', icon: Mail, color: 'text-green-600' },
  { id: 'SOCIAL_MEDIA', label: 'Social Media', icon: Share2, color: 'text-blue-600' }
];

const PLATFORMS = [
  { id: 'FACEBOOK', label: 'Facebook' },
  { id: 'INSTAGRAM', label: 'Instagram' },
  { id: 'TWITTER', label: 'Twitter' },
  { id: 'LINKEDIN', label: 'LinkedIn' }
];

const DATE_RANGES = [
  { id: 'all', label: 'All Time' },
  { id: 'week', label: 'Last 7 Days' },
  { id: 'month', label: 'Last 30 Days' },
  { id: 'custom', label: 'Custom Range' }
];

export function GenerationFilterPanel({
  filters,
  onFiltersChange,
  activeFilterCount,
  className
}: GenerationFilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleContentTypeToggle = (typeId: string) => {
    const newContentTypes = filters.contentTypes.includes(typeId)
      ? filters.contentTypes.filter(t => t !== typeId)
      : [...filters.contentTypes, typeId];

    // If unchecking SOCIAL_MEDIA, clear platforms
    if (typeId === 'SOCIAL_MEDIA' && !newContentTypes.includes('SOCIAL_MEDIA')) {
      onFiltersChange({
        ...filters,
        contentTypes: newContentTypes,
        platforms: []
      });
    } else {
      onFiltersChange({
        ...filters,
        contentTypes: newContentTypes
      });
    }
  };

  const handlePlatformToggle = (platformId: string) => {
    const newPlatforms = filters.platforms.includes(platformId)
      ? filters.platforms.filter(p => p !== platformId)
      : [...filters.platforms, platformId];

    onFiltersChange({
      ...filters,
      platforms: newPlatforms
    });
  };

  const handleDateRangeChange = (range: string) => {
    onFiltersChange({
      ...filters,
      dateRange: range as GenerationFilters['dateRange'],
      customDateFrom: undefined,
      customDateTo: undefined
    });
  };

  const handleClearAll = () => {
    onFiltersChange({
      contentTypes: [],
      platforms: [],
      dateRange: 'all'
    });
  };

  const hasActiveFilters = activeFilterCount > 0;
  const isSocialMediaSelected = filters.contentTypes.includes('SOCIAL_MEDIA');

  return (
    <div className={cn('w-full', className)}>
      {/* Filter Toggle Button */}
      <Button
        variant="outline"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full justify-between hover:bg-lavender/10 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="font-medium">Filter Generated Content</span>
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-2 bg-orchid text-white">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>

      {/* Filter Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-4 p-4 border rounded-lg bg-white shadow-sm space-y-4">
              {/* Content Type Filters */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-semibold text-gray-700">
                    Content Type
                  </Label>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearAll}
                      className="h-7 text-xs text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Clear All
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  {CONTENT_TYPES.map((type) => {
                    const Icon = type.icon;
                    const isChecked = filters.contentTypes.includes(type.id);

                    return (
                      <div
                        key={type.id}
                        className={cn(
                          'flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors cursor-pointer',
                          isChecked && 'bg-lavender/10'
                        )}
                        onClick={() => handleContentTypeToggle(type.id)}
                      >
                        <Checkbox
                          id={type.id}
                          checked={isChecked}
                          onCheckedChange={() => handleContentTypeToggle(type.id)}
                        />
                        <Icon className={cn('h-4 w-4', type.color)} />
                        <Label
                          htmlFor={type.id}
                          className="text-sm flex-1 cursor-pointer"
                        >
                          {type.label}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Platform Filters (shown when Social Media is selected) */}
              {isSocialMediaSelected && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                      Social Media Platform
                    </Label>
                    <div className="space-y-2">
                      {PLATFORMS.map((platform) => {
                        const isChecked = filters.platforms.includes(platform.id);

                        return (
                          <div
                            key={platform.id}
                            className={cn(
                              'flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors cursor-pointer',
                              isChecked && 'bg-blue-50'
                            )}
                            onClick={() => handlePlatformToggle(platform.id)}
                          >
                            <Checkbox
                              id={platform.id}
                              checked={isChecked}
                              onCheckedChange={() => handlePlatformToggle(platform.id)}
                            />
                            <Label
                              htmlFor={platform.id}
                              className="text-sm flex-1 cursor-pointer"
                            >
                              {platform.label}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {/* Date Range Filters */}
              <Separator />
              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Generated Date
                </Label>
                <div className="space-y-2">
                  {DATE_RANGES.map((range) => (
                    <div
                      key={range.id}
                      className={cn(
                        'flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors cursor-pointer',
                        filters.dateRange === range.id && 'bg-lavender/10'
                      )}
                      onClick={() => handleDateRangeChange(range.id)}
                    >
                      <input
                        type="radio"
                        id={`date-${range.id}`}
                        name="dateRange"
                        checked={filters.dateRange === range.id}
                        onChange={() => handleDateRangeChange(range.id)}
                        className="cursor-pointer accent-orchid"
                      />
                      <Label
                        htmlFor={`date-${range.id}`}
                        className="text-sm flex-1 cursor-pointer"
                      >
                        {range.label}
                      </Label>
                    </div>
                  ))}
                </div>

                {/* Custom Date Range Inputs */}
                {filters.dateRange === 'custom' && (
                  <div className="mt-3 space-y-2 pl-6">
                    <div>
                      <Label htmlFor="dateFrom" className="text-xs text-gray-600">
                        From
                      </Label>
                      <input
                        type="date"
                        id="dateFrom"
                        value={filters.customDateFrom || ''}
                        onChange={(e) =>
                          onFiltersChange({
                            ...filters,
                            customDateFrom: e.target.value
                          })
                        }
                        className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dateTo" className="text-xs text-gray-600">
                        To
                      </Label>
                      <input
                        type="date"
                        id="dateTo"
                        value={filters.customDateTo || ''}
                        onChange={(e) =>
                          onFiltersChange({
                            ...filters,
                            customDateTo: e.target.value
                          })
                        }
                        className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Active Filters Summary */}
              {hasActiveFilters && (
                <>
                  <Separator />
                  <div className="flex flex-wrap gap-2">
                    {filters.contentTypes.map((typeId) => {
                      const type = CONTENT_TYPES.find((t) => t.id === typeId);
                      if (!type) return null;

                      return (
                        <Badge
                          key={typeId}
                          variant="secondary"
                          className="bg-lavender/20 text-orchid hover:bg-lavender/30"
                        >
                          {type.label}
                          <X
                            className="h-3 w-3 ml-1 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleContentTypeToggle(typeId);
                            }}
                          />
                        </Badge>
                      );
                    })}
                    {filters.platforms.map((platformId) => {
                      const platform = PLATFORMS.find((p) => p.id === platformId);
                      if (!platform) return null;

                      return (
                        <Badge
                          key={platformId}
                          variant="secondary"
                          className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                        >
                          {platform.label}
                          <X
                            className="h-3 w-3 ml-1 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlatformToggle(platformId);
                            }}
                          />
                        </Badge>
                      );
                    })}
                    {filters.dateRange !== 'all' && (
                      <Badge
                        variant="secondary"
                        className="bg-green-50 text-green-700 hover:bg-green-100"
                      >
                        {DATE_RANGES.find((r) => r.id === filters.dateRange)?.label}
                        <X
                          className="h-3 w-3 ml-1 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDateRangeChange('all');
                          }}
                        />
                      </Badge>
                    )}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
