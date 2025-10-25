// Main filter bar component
export { ArticleFilterBar, type ArticleFilters } from './ArticleFilterBar';

// Individual filter components
export { SearchInput } from './SearchInput';
export { SortDropdown, type SortOption } from './SortDropdown';
export { CategoryMultiselect } from './CategoryMultiselect';
export { TagMultiselect } from './TagMultiselect';
export { PersonalizationsMultiselect, type PersonalizationType } from './PersonalizationsMultiselect';

// Type definitions and utilities
export type {
  ArticleFilterBarProps,
  SearchInputProps,
  SortDropdownProps,
  CategoryMultiselectProps,
  TagMultiselectProps,
  PersonalizationsMultiselectProps,
  SortOptionConfig,
  PersonalizationOption,
  ArticleFiltersUpdate,
  FilterUrlParams,
  ArticleFilterParams,
  FilterAnalyticsEvent,
} from './types';

export {
  isValidFilterState,
  createDefaultFilters,
  hasActiveFilters,
  countActiveFilters,
  clearFilters,
  resetFilters,
  filtersToApiParams,
  createFilterEvent,
} from './types';
