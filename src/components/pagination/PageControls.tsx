'use client';

import { useMemo } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PageControlsProps {
  /** Current page number (1-based) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Loading state */
  isLoading?: boolean;
  /** Show first/last page buttons */
  showFirstLast?: boolean;
  /** Maximum number of page buttons to show */
  maxPageButtons?: number;
  /** Additional CSS classes */
  className?: string;
  /** Scroll to top on page change */
  scrollToTop?: boolean;
  /** Custom scroll offset */
  scrollOffset?: number;
}

/**
 * PageControls Component - Option B
 *
 * A traditional pagination component with page numbers, prev/next buttons.
 * Includes smooth transitions, loading states, and full accessibility.
 *
 * Features:
 * - Gradient active page button (orchid to indigo)
 * - Smart page number display (shows ellipsis for large page counts)
 * - First/last page quick navigation
 * - Smooth transitions between pages
 * - Fully accessible with ARIA labels
 * - Mobile-first responsive design
 * - Optional auto-scroll to top on page change
 *
 * @example
 * ```tsx
 * const [page, setPage] = useState(1);
 * const { data, isLoading } = useArticles({ page });
 *
 * return (
 *   <PageControls
 *     currentPage={page}
 *     totalPages={data.totalPages}
 *     onPageChange={setPage}
 *     isLoading={isLoading}
 *   />
 * );
 * ```
 */
export function PageControls({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
  showFirstLast = true,
  maxPageButtons = 5,
  className,
  scrollToTop = true,
  scrollOffset = 0,
}: PageControlsProps) {
  // Calculate which page numbers to show
  const pageNumbers = useMemo(() => {
    if (totalPages <= maxPageButtons) {
      // Show all pages if total is less than max
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | 'ellipsis')[] = [];
    const halfMax = Math.floor(maxPageButtons / 2);

    // Always show first page
    pages.push(1);

    // Calculate start and end of middle section
    let start = Math.max(2, currentPage - halfMax);
    let end = Math.min(totalPages - 1, currentPage + halfMax);

    // Adjust if we're near the start or end
    if (currentPage <= halfMax + 1) {
      end = Math.min(totalPages - 1, maxPageButtons - 1);
    } else if (currentPage >= totalPages - halfMax) {
      start = Math.max(2, totalPages - maxPageButtons + 2);
    }

    // Add left ellipsis if needed
    if (start > 2) {
      pages.push('ellipsis');
    }

    // Add middle pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add right ellipsis if needed
    if (end < totalPages - 1) {
      pages.push('ellipsis');
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages, maxPageButtons]);

  const handlePageChange = (page: number) => {
    if (page === currentPage || page < 1 || page > totalPages || isLoading) {
      return;
    }

    onPageChange(page);

    // Scroll to top if enabled
    if (scrollToTop) {
      const scrollTarget = scrollOffset ?? 0;
      window.scrollTo({
        top: scrollTarget,
        behavior: 'smooth',
      });
    }
  };

  // Don't render if there's only one page or no pages
  if (totalPages <= 1) {
    return null;
  }

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <nav
      className={cn('w-full py-8', className)}
      role="navigation"
      aria-label="Pagination"
    >
      <div className="flex flex-col items-center gap-4">
        {/* Page info - visible on mobile */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-sm text-gray-600 font-medium"
          aria-live="polite"
          aria-atomic="true"
        >
          Page <span className="text-orchid font-bold">{currentPage}</span> of{' '}
          <span className="font-bold">{totalPages}</span>
        </motion.div>

        {/* Pagination controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* First page button */}
          {showFirstLast && (
            <Button
              onClick={() => handlePageChange(1)}
              disabled={!canGoPrevious || isLoading}
              variant="outline"
              size="icon"
              className={cn(
                'h-9 w-9 sm:h-10 sm:w-10',
                'transition-all duration-200',
                'hover:bg-lavender/20 hover:border-lavender/50',
                'disabled:opacity-40 disabled:cursor-not-allowed'
              )}
              aria-label="Go to first page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
          )}

          {/* Previous button */}
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!canGoPrevious || isLoading}
            variant="outline"
            className={cn(
              'h-9 sm:h-10 px-3 sm:px-4 gap-1 sm:gap-2',
              'transition-all duration-200',
              'hover:bg-lavender/20 hover:border-lavender/50',
              'disabled:opacity-40 disabled:cursor-not-allowed'
            )}
            aria-label="Go to previous page"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline text-sm font-medium">Previous</span>
          </Button>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {pageNumbers.map((pageNum, index) => {
              if (pageNum === 'ellipsis') {
                return (
                  <div
                    key={`ellipsis-${index}`}
                    className="h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <span className="text-gray-400 font-medium">...</span>
                  </div>
                );
              }

              const isActive = pageNum === currentPage;

              return (
                <motion.div
                  key={pageNum}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                >
                  <Button
                    onClick={() => handlePageChange(pageNum)}
                    disabled={isLoading}
                    variant={isActive ? 'default' : 'outline'}
                    size="icon"
                    className={cn(
                      'h-9 w-9 sm:h-10 sm:w-10',
                      'transition-all duration-200',
                      'text-sm font-semibold',
                      isActive && [
                        'bg-gradient-to-r from-orchid to-indigo',
                        'hover:from-indigo hover:to-shadow',
                        'text-white border-0',
                        'shadow-md hover:shadow-lg',
                        'scale-110',
                      ],
                      !isActive && [
                        'hover:bg-lavender/20',
                        'hover:border-lavender/50',
                        'hover:text-orchid',
                      ],
                      isLoading && 'cursor-wait'
                    )}
                    aria-label={`Go to page ${pageNum}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {pageNum}
                  </Button>
                </motion.div>
              );
            })}
          </div>

          {/* Next button */}
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!canGoNext || isLoading}
            variant="outline"
            className={cn(
              'h-9 sm:h-10 px-3 sm:px-4 gap-1 sm:gap-2',
              'transition-all duration-200',
              'hover:bg-lavender/20 hover:border-lavender/50',
              'disabled:opacity-40 disabled:cursor-not-allowed'
            )}
            aria-label="Go to next page"
          >
            <span className="hidden sm:inline text-sm font-medium">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Last page button */}
          {showFirstLast && (
            <Button
              onClick={() => handlePageChange(totalPages)}
              disabled={!canGoNext || isLoading}
              variant="outline"
              size="icon"
              className={cn(
                'h-9 w-9 sm:h-10 sm:w-10',
                'transition-all duration-200',
                'hover:bg-lavender/20 hover:border-lavender/50',
                'disabled:opacity-40 disabled:cursor-not-allowed'
              )}
              aria-label="Go to last page"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 text-xs text-gray-500"
          >
            <div className="h-3 w-3 rounded-full bg-orchid animate-pulse" />
            <span>Loading...</span>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
