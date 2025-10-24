'use client';

import { Sparkles, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface GenerationCountBadgeProps {
  count: number;
  onClick?: () => void;
  className?: string;
}

export function GenerationCountBadge({ count, onClick, className }: GenerationCountBadgeProps) {
  if (count === 0) return null;

  return (
    <Badge
      variant="secondary"
      className={cn(
        'bg-gradient-to-r from-orchid/10 to-indigo/10 text-orchid border-orchid/30 hover:from-orchid/20 hover:to-indigo/20 transition-all cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <Check className="h-3 w-3 mr-1" />
      {count} Generated
      <Sparkles className="h-3 w-3 ml-1" />
    </Badge>
  );
}

interface ContentTypeIndicator {
  hasKeyInsights: boolean;
  hasVideoScript: boolean;
  hasEmailTemplate: boolean;
  hasSocialMedia: boolean;
  socialPlatformCount?: number;
}

interface ContentTypeIndicatorsProps extends ContentTypeIndicator {
  className?: string;
}

export function ContentTypeIndicators({
  hasKeyInsights,
  hasVideoScript,
  hasEmailTemplate,
  hasSocialMedia,
  socialPlatformCount = 0,
  className
}: ContentTypeIndicatorsProps) {
  const indicators = [
    { has: hasKeyInsights, label: 'Insights', color: 'bg-purple-100 text-purple-700' },
    { has: hasVideoScript, label: 'Video', color: 'bg-red-100 text-red-700' },
    { has: hasEmailTemplate, label: 'Email', color: 'bg-green-100 text-green-700' },
    { has: hasSocialMedia, label: `Social${socialPlatformCount > 0 ? ` (${socialPlatformCount})` : ''}`, color: 'bg-blue-100 text-blue-700' }
  ].filter(ind => ind.has);

  if (indicators.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap gap-1', className)}>
      {indicators.map((indicator, idx) => (
        <Badge
          key={idx}
          variant="secondary"
          className={cn('text-xs font-medium', indicator.color)}
        >
          <Check className="h-3 w-3 mr-1" />
          {indicator.label}
        </Badge>
      ))}
    </div>
  );
}
