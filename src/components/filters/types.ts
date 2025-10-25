/**
 * Type definitions for the Article Filter System
 *
 * This file contains all TypeScript types and interfaces used
 * across the filter components. Import these for type-safe
 * filter implementation.
 *
 * @example
 * import type { ArticleFilters, SortOption } from '@/components/filters/types';
 */

// ============================================================================
// Sort Options
// ============================================================================

/**
 * Available sort options for articles
 */
export type SortOption = 'newest' | 'oldest' | 'alpha-asc' | 'alpha-desc';

/**
 * Sort option configuration
 */
export interface SortOptionConfig {
  value: SortOption;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

// ============================================================================
// Personalization Types
// ============================================================================

/**
 * Available personalization types for article content
 */
export type PersonalizationType =
  | 'default'
  | 'key_insights'
  | 'video_script'
  | 'email_template'
  | 'social_media';

/**
 * Personalization option configuration
 */
export interface PersonalizationOption {
  id: PersonalizationType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

// ============================================================================
// Filter State
// ============================================================================

/**
 * Complete filter state for article browsing
 *
 * @property search - Search query string
 * @property sort - Sort order for results
 * @property categories - Array of selected category IDs
 * @property tags - Array of selected tag IDs
 * @property personalizations - Array of selected personalization types
 *
 * @example
 * const filters: ArticleFilters = {
 *   search: 'mortgage',
 *   sort: 'newest',
 *   categories: ['mortgage', 'real_estate'],
 *   tags: ['purchase', 'refinance'],
 *   personalizations: ['video_script', 'email_template'],
 * };
 */
export interface ArticleFilters {
  search: string;
  sort: SortOption;
  categories: string[];
  tags: string[];
  personalizations: PersonalizationType[];
}

/**
 * Partial filter updates
 * Used when updating only specific filter properties
 */
export type ArticleFiltersUpdate = Partial<ArticleFilters>;

// ============================================================================
// Component Props
// ============================================================================

/**
 * Base props shared across filter components
 */
export interface BaseFilterProps {
  className?: string;
}

/**
 * Props for ArticleFilterBar component
 */
export interface ArticleFilterBarProps extends BaseFilterProps {
  filters: ArticleFilters;
  onFiltersChange: (filters: ArticleFilters) => void;
}

/**
 * Props for SearchInput component
 */
export interface SearchInputProps extends BaseFilterProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

/**
 * Props for SortDropdown component
 */
export interface SortDropdownProps extends BaseFilterProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

/**
 * Props for CategoryMultiselect component
 */
export interface CategoryMultiselectProps extends BaseFilterProps {
  selectedCategories: string[];
  onChange: (categories: string[]) => void;
}

/**
 * Props for TagMultiselect component
 */
export interface TagMultiselectProps extends BaseFilterProps {
  selectedCategories: string[];
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

/**
 * Props for PersonalizationsMultiselect component
 */
export interface PersonalizationsMultiselectProps extends BaseFilterProps {
  selectedPersonalizations: PersonalizationType[];
  onChange: (personalizations: PersonalizationType[]) => void;
}

// ============================================================================
// Filter Utilities
// ============================================================================

/**
 * Filter state validator
 * Ensures filter state has all required properties
 */
export function isValidFilterState(state: unknown): state is ArticleFilters {
  if (!state || typeof state !== 'object') return false;

  const filters = state as Record<string, unknown>;

  return (
    typeof filters.search === 'string' &&
    (filters.sort === 'newest' ||
      filters.sort === 'oldest' ||
      filters.sort === 'alpha-asc' ||
      filters.sort === 'alpha-desc') &&
    Array.isArray(filters.categories) &&
    Array.isArray(filters.tags) &&
    Array.isArray(filters.personalizations)
  );
}

/**
 * Create default filter state
 */
export function createDefaultFilters(): ArticleFilters {
  return {
    search: '',
    sort: 'newest',
    categories: [],
    tags: [],
    personalizations: [],
  };
}

/**
 * Check if any filters are active (excluding search and sort)
 */
export function hasActiveFilters(filters: ArticleFilters): boolean {
  return (
    filters.categories.length > 0 ||
    filters.tags.length > 0 ||
    filters.personalizations.length > 0
  );
}

/**
 * Count total active filters
 */
export function countActiveFilters(filters: ArticleFilters): number {
  return (
    filters.categories.length +
    filters.tags.length +
    filters.personalizations.length
  );
}

/**
 * Clear all filters (keeps search and sort)
 */
export function clearFilters(filters: ArticleFilters): ArticleFilters {
  return {
    ...filters,
    categories: [],
    tags: [],
    personalizations: [],
  };
}

/**
 * Reset to default state
 */
export function resetFilters(): ArticleFilters {
  return createDefaultFilters();
}

// ============================================================================
// URL State Management Types (for nuqs integration)
// ============================================================================

/**
 * URL search params parser configuration for nuqs
 *
 * @example
 * import { useQueryStates, parseAsString, parseAsArrayOf, parseAsStringEnum } from 'nuqs';
 *
 * const [filters, setFilters] = useQueryStates({
 *   search: parseAsString.withDefault(''),
 *   sort: parseAsStringEnum<SortOption>(['newest', 'oldest', 'alpha-asc', 'alpha-desc'])
 *     .withDefault('newest'),
 *   categories: parseAsArrayOf(parseAsString).withDefault([]),
 *   tags: parseAsArrayOf(parseAsString).withDefault([]),
 *   personalizations: parseAsArrayOf(parseAsString).withDefault([]),
 * });
 */
export interface FilterUrlParams {
  search?: string | null;
  sort?: SortOption | null;
  categories?: string[] | null;
  tags?: string[] | null;
  personalizations?: string[] | null;
}

// ============================================================================
// API Types (for backend integration)
// ============================================================================

/**
 * Filter parameters for API requests
 */
export interface ArticleFilterParams {
  search?: string;
  sort?: SortOption;
  categoryIds?: string[];
  tagIds?: string[];
  personalizationTypes?: PersonalizationType[];
  page?: number;
  limit?: number;
}

/**
 * Convert ArticleFilters to API parameters
 */
export function filtersToApiParams(
  filters: ArticleFilters,
  page = 1,
  limit = 20
): ArticleFilterParams {
  return {
    search: filters.search || undefined,
    sort: filters.sort,
    categoryIds: filters.categories.length > 0 ? filters.categories : undefined,
    tagIds: filters.tags.length > 0 ? filters.tags : undefined,
    personalizationTypes:
      filters.personalizations.length > 0 ? filters.personalizations : undefined,
    page,
    limit,
  };
}

// ============================================================================
// Analytics Types (for tracking)
// ============================================================================

/**
 * Filter analytics event
 */
export interface FilterAnalyticsEvent {
  action:
    | 'search'
    | 'sort'
    | 'category_selected'
    | 'category_removed'
    | 'tag_selected'
    | 'tag_removed'
    | 'personalization_selected'
    | 'personalization_removed'
    | 'clear_all'
    | 'panel_toggled';
  value?: string | string[];
  timestamp: Date;
}

/**
 * Track filter change for analytics
 */
export function createFilterEvent(
  action: FilterAnalyticsEvent['action'],
  value?: string | string[]
): FilterAnalyticsEvent {
  return {
    action,
    value,
    timestamp: new Date(),
  };
}
