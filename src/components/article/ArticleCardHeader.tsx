'use client';

import { format } from 'date-fns';
import { Sparkles, Tag, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getCategoryById } from '@/lib/constants/categories';
import type { Article } from './types';

interface ArticleCardHeaderProps {
  article: Article;
  onReadFullArticle: () => void;
}

/**
 * Safely format a published date string.
 */
function formatPublishedDate(dateString: string | undefined | null): string | null {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;
  return format(date, 'MMMM d, yyyy');
}

export function ArticleCardHeader({ article, onReadFullArticle }: ArticleCardHeaderProps) {
  const getCategoryStyle = () => {
    return 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100';
  };

  const formattedDate = formatPublishedDate(article.published_at);

  return (
    <>
      {/* Header with categories, generation badge */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {article.category && (() => {
              const categoryData = getCategoryById(article.category);
              const CategoryIcon = categoryData?.icon;
              return (
                <Badge className={`border text-xs gap-1 ${getCategoryStyle()}`}>
                  {CategoryIcon && <CategoryIcon className="h-3 w-3" />}
                  {article.category}
                </Badge>
              );
            })()}
            {article.tags?.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        {article.is_personalized && (
          <Badge className="bg-blue-100 text-blue-700 border-0 text-xs shrink-0">
            <Sparkles className="h-3 w-3 mr-1" />
            Personalized
          </Badge>
        )}
      </div>

      {/* Title and summary */}
      <h3 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
        {article.title}
      </h3>
      <p className="text-gray-600 leading-relaxed mb-3">
        {article.summary}
      </p>

      {/* Published date */}
      {formattedDate && (
        <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
          <Calendar className="h-4 w-4" />
          <span>{formattedDate}</span>
        </div>
      )}

      {/* Read Full Article link */}
      <button
        onClick={onReadFullArticle}
        className="text-sm text-indigo-600 hover:text-indigo-700 font-medium inline-flex items-center gap-1 group mb-6"
      >
        Read full article
        <svg
          className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </>
  );
}
