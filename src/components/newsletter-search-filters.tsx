"use client"

import * as React from "react"
import { Search, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

// Type definitions
export interface FilterState {
  search: string
  categories: string[]
  tags: string[]
  sortBy: string
}

export interface NewsletterSearchFiltersProps {
  onFilterChange: (filters: FilterState) => void
  resultsCount: number
  className?: string
  initialFilters?: Partial<FilterState>
}

// Category configuration with brand colors
const CATEGORIES = [
  {
    id: "mortgage",
    label: "Mortgage",
    className: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800 dark:hover:bg-blue-800/30"
  },
  {
    id: "leadership",
    label: "Leadership",
    className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800 dark:hover:bg-green-800/30"
  },
  {
    id: "marketing",
    label: "Marketing",
    className: "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800 dark:hover:bg-purple-800/30"
  }
] as const

// Available tags
const AVAILABLE_TAGS = [
  "Rate Alert",
  "FHA Update",
  "Credit Score",
  "Market Trends",
  "Regulatory",
  "First-Time Buyers",
  "Refinancing",
  "Investment",
  "Commercial",
  "Industry News"
] as const

// Sort options
const SORT_OPTIONS = [
  { value: "date-desc", label: "Newest First" },
  { value: "date-asc", label: "Oldest First" },
  { value: "relevance", label: "Most Relevant" },
  { value: "title", label: "Title A-Z" }
] as const

export function NewsletterSearchFilters({
  onFilterChange,
  resultsCount,
  className,
  initialFilters
}: NewsletterSearchFiltersProps) {
  const [filters, setFilters] = React.useState<FilterState>({
    search: "",
    categories: [],
    tags: [],
    sortBy: "date-desc",
    ...initialFilters
  })

  // Ref for debouncing search
  const timeoutRef = React.useRef<NodeJS.Timeout>()

  // Update filters and notify parent
  const updateFilters = React.useCallback((newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    onFilterChange(updatedFilters)
  }, [filters, onFilterChange])

  // Search input handler with debouncing
  const handleSearchChange = React.useCallback((value: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      updateFilters({ search: value })
    }, 300)
  }, [updateFilters])

  // Category toggle handler
  const toggleCategory = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter(id => id !== categoryId)
      : [...filters.categories, categoryId]
    updateFilters({ categories: newCategories })
  }

  // Tag toggle handler
  const toggleTag = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag]
    updateFilters({ tags: newTags })
  }

  // Clear all filters
  const clearAllFilters = () => {
    updateFilters({
      search: "",
      categories: [],
      tags: [],
      sortBy: "date-desc"
    })
  }

  // Check if any filters are active
  const hasActiveFilters = filters.search || filters.categories.length > 0 || filters.tags.length > 0

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search Bar, Filters, and Sort - All on same line */}
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search Articles..."
            className="pl-10 h-10 bg-white dark:bg-card border-lavender/30 focus:border-lavender focus:ring-lavender/20 transition-all duration-200"
            defaultValue={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        {/* Filters and Sort - Same line on desktop */}
        <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
          {/* Categories Dropdown */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full sm:w-40 lg:w-44 justify-between bg-white dark:bg-card border-lavender/30 hover:bg-lavender/10 h-10"
              >
                <span className="text-sm">
                  {filters.categories.length === 0
                    ? "Categories"
                    : `${filters.categories.length} categories`}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full bg-white dark:bg-gray-800 border-lavender/30 shadow-lg" align="start">
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-foreground">Select Categories</h4>
                <div className="space-y-2">
                  {CATEGORIES.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={filters.categories.includes(category.id)}
                        onCheckedChange={() => toggleCategory(category.id)}
                      />
                      <label
                        htmlFor={`category-${category.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {category.label}
                      </label>
                    </div>
                  ))}
                </div>
                {filters.categories.length > 0 && (
                  <div className="pt-2 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateFilters({ categories: [] })}
                      className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                    >
                      Clear all
                    </Button>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Tags Dropdown */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full sm:w-32 lg:w-36 justify-between bg-white dark:bg-card border-lavender/30 hover:bg-lavender/10 h-10"
              >
                <span className="text-sm">
                  {filters.tags.length === 0
                    ? "Tags"
                    : `${filters.tags.length} tags`}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full bg-white dark:bg-gray-800 border-lavender/30 shadow-lg" align="start">
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-foreground">Select Tags</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {AVAILABLE_TAGS.map((tag) => (
                    <div key={tag} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tag-${tag}`}
                        checked={filters.tags.includes(tag)}
                        onCheckedChange={() => toggleTag(tag)}
                      />
                      <label
                        htmlFor={`tag-${tag}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {tag}
                      </label>
                    </div>
                  ))}
                </div>
                {filters.tags.length > 0 && (
                  <div className="pt-2 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateFilters({ tags: [] })}
                      className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                    >
                      Clear all
                    </Button>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Sort Dropdown */}
          <Select value={filters.sortBy} onValueChange={(value) => updateFilters({ sortBy: value })}>
            <SelectTrigger className="w-full sm:w-40 lg:w-44 h-10 bg-white dark:bg-card border-lavender/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count and Clear Filters */}
      <div className="flex items-center justify-between py-2">
        <div className="text-sm text-muted-foreground">
          {resultsCount} {resultsCount === 1 ? 'result' : 'results'} found
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground h-8"
          >
            <X className="h-3 w-3 mr-1" />
            Clear all
          </Button>
        )}
      </div>


      {/* Active Filters Summary - Mobile Only */}
      {hasActiveFilters && (
        <div className="lg:hidden flex flex-wrap gap-2 items-center text-xs">
          <span className="text-muted-foreground">Active:</span>
          {filters.categories.map((categoryId) => {
            const category = CATEGORIES.find(c => c.id === categoryId)
            return category ? (
              <Badge key={categoryId} variant="secondary" className="h-6 text-xs">
                {category.label}
              </Badge>
            ) : null
          })}
          {filters.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="h-6 text-xs">
              {tag}
            </Badge>
          ))}
          {filters.tags.length > 3 && (
            <span className="text-muted-foreground">+{filters.tags.length - 3} more</span>
          )}
        </div>
      )}
    </div>
  )
}