'use client';

import { useState } from 'react';
import { Sparkles, Zap, Crown, Info } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface GenerationLimitBadgeProps {
  remaining: number;
  limit: number;
  tier: 'free' | 'paid' | 'premium';
  resetDate?: string; // ISO date string for when monthly limit resets (paid/premium only)
  className?: string;
}

export function GenerationLimitBadge({
  remaining,
  limit,
  tier,
  resetDate,
  className
}: GenerationLimitBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Calculate percentage for progress bar
  const percentage = limit > 0 ? ((limit - remaining) / limit) * 100 : 0;

  // Determine color scheme based on remaining credits
  const getColorScheme = () => {
    if (remaining === 0) {
      return {
        badge: 'bg-red-100 text-red-800 border-red-300 hover:bg-red-200',
        progress: 'bg-red-500',
        icon: 'text-red-600',
        ring: 'from-red-400 to-red-600'
      };
    }
    if (remaining <= 2 && tier === 'free') {
      return {
        badge: 'bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200',
        progress: 'bg-yellow-500',
        icon: 'text-yellow-600',
        ring: 'from-yellow-400 to-orange-500'
      };
    }
    return {
      badge: 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200',
      progress: 'bg-green-500',
      icon: 'text-green-600',
      ring: 'from-green-400 to-emerald-600'
    };
  };

  const colors = getColorScheme();

  // Get appropriate icon based on tier and state
  const getIcon = () => {
    if (remaining === 0) return Zap;
    if (tier === 'paid' || tier === 'premium') return Crown;
    return Sparkles;
  };

  const Icon = getIcon();

  // Format reset date
  const formatResetDate = () => {
    if (!resetDate) return null;
    const date = new Date(resetDate);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Get badge text
  const getBadgeText = () => {
    if (tier === 'free') {
      return `${remaining}/${limit} AI credits`;
    }
    return `${remaining}/${limit} this month`;
  };

  // Get popover content based on tier and state
  const getPopoverContent = () => {
    const resetDateFormatted = formatResetDate();

    if (remaining === 0) {
      if (tier === 'free') {
        return {
          title: 'All Free Credits Used',
          description: 'You have used all 3 of your lifetime free AI generations. Upgrade to Pro for 25 generations per month and never run out!',
          action: 'Upgrade to Pro'
        };
      }
      return {
        title: 'Monthly Limit Reached',
        description: `You've used all ${limit} AI generations this month. Your limit will reset ${resetDateFormatted ? `on ${resetDateFormatted}` : 'soon'}.`,
        action: null
      };
    }

    if (tier === 'free') {
      return {
        title: 'Free AI Generations',
        description: `You have ${remaining} of 3 lifetime AI generations remaining. Each generation personalizes content to match your unique voice and style.`,
        action: remaining <= 1 ? 'Upgrade for More' : null
      };
    }

    return {
      title: `Pro AI Generations`,
      description: `You have ${remaining} of ${limit} AI generations remaining this month. ${resetDateFormatted ? `Resets on ${resetDateFormatted}.` : ''} Generations personalize content using your TrueTone profile.`,
      action: null
    };
  };

  const popoverContent = getPopoverContent();

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          suppressHydrationWarning
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1.5 border-2 rounded-full',
            'transition-all duration-200 font-semibold text-xs cursor-pointer',
            'hover:scale-[1.02] active:scale-[0.98]',
            colors.badge,
            className
          )}
        >
          <Icon className={cn('h-3.5 w-3.5', colors.icon)} />
          <span>{getBadgeText()}</span>
          <Info className="h-3 w-3 opacity-70" />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-4" align="end">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start gap-3">
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center',
                'bg-gradient-to-br',
                colors.ring
              )}
            >
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm mb-1">
                {popoverContent.title}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {popoverContent.description}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {tier === 'free' ? 'Lifetime usage' : 'This month'}
              </span>
              <span className="font-medium">
                {limit - remaining} / {limit} used
              </span>
            </div>
            <Progress
              value={percentage}
              className="h-2"
              indicatorClassName={colors.progress}
            />
          </div>

          {/* Action Button */}
          {popoverContent.action && (
            <a
              href="/account?tab=billing"
              className={cn(
                'block w-full py-2 px-4 rounded-lg text-center font-semibold text-sm',
                'bg-gradient-to-r from-orchid to-indigo text-white',
                'hover:from-indigo hover:to-shadow hover:scale-[1.02] active:scale-[0.98] transition-all duration-200',
                'shadow-md hover:shadow-lg'
              )}
              onClick={() => setIsOpen(false)}
            >
              {popoverContent.action}
            </a>
          )}

          {/* Additional Info */}
          {tier !== 'free' && resetDate && (
            <div className="pt-2 border-t text-xs text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Next reset:</span>
                <span className="font-medium">{formatResetDate()}</span>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
