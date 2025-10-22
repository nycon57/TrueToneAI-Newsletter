'use client';

import { useMemo } from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  SparklesIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface GenerationStatusProps {
  generationsUsed: number;
  generationLimit: number;
  subscriptionTier: 'FREE' | 'PAID' | 'PREMIUM';
  onUpgradeClick?: () => void;
  variant?: 'default' | 'compact' | 'inline';
  className?: string;
}

export function GenerationStatus({
  generationsUsed,
  generationLimit,
  subscriptionTier,
  onUpgradeClick,
  variant = 'default',
  className,
}: GenerationStatusProps) {
  const remainingGenerations = useMemo(
    () => Math.max(0, generationLimit - generationsUsed),
    [generationsUsed, generationLimit]
  );

  const usagePercentage = useMemo(
    () => generationLimit === 0 ? 0 : Math.min(100, (generationsUsed / generationLimit) * 100),
    [generationsUsed, generationLimit]
  );

  const statusConfig = useMemo(() => {
    if (subscriptionTier !== 'FREE') {
      return {
        icon: CheckCircleIcon,
        iconColor: 'text-green-500',
        title: 'Unlimited AI Generations',
        description: 'You have unlimited access to AI personalizations',
        showProgress: false,
        showUpgrade: false,
      };
    }

    if (usagePercentage >= 100) {
      return {
        icon: ExclamationTriangleIcon,
        iconColor: 'text-destructive',
        title: 'Generation Limit Reached',
        description: 'Upgrade to continue using AI personalizations',
        showProgress: true,
        showUpgrade: true,
        progressColor: 'bg-destructive',
      };
    }

    if (usagePercentage >= 75) {
      return {
        icon: ExclamationTriangleIcon,
        iconColor: 'text-orange-500',
        title: `${remainingGenerations} Generation${remainingGenerations !== 1 ? 's' : ''} Remaining`,
        description: 'Running low on free AI generations',
        showProgress: true,
        showUpgrade: true,
        progressColor: 'bg-orange-500',
      };
    }

    return {
      icon: SparklesIcon,
      iconColor: 'text-primary',
      title: `${remainingGenerations} of ${generationLimit} Remaining`,
      description: 'AI generations available this month',
      showProgress: true,
      showUpgrade: false,
      progressColor: 'bg-primary',
    };
  }, [subscriptionTier, usagePercentage, remainingGenerations, generationLimit]);

  const Icon = statusConfig.icon;

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-2 text-sm', className)}>
        <Icon className={cn('h-4 w-4', statusConfig.iconColor)} />
        <span className="font-medium">
          {subscriptionTier !== 'FREE'
            ? 'Unlimited'
            : `${remainingGenerations}/${generationLimit}`}
        </span>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={cn('space-y-2', className)}>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Icon className={cn('h-4 w-4', statusConfig.iconColor)} />
            <span className="font-medium">{statusConfig.title}</span>
          </div>
          {statusConfig.showUpgrade && onUpgradeClick && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onUpgradeClick}
              className="h-auto py-1 px-2 text-xs"
            >
              Upgrade
            </Button>
          )}
        </div>
        {statusConfig.showProgress && (
          <Progress
            value={usagePercentage}
            className="h-1.5"
            indicatorClassName={statusConfig.progressColor}
          />
        )}
      </div>
    );
  }

  // Default variant - full card
  return (
    <Card className={cn('border-border', className)}>
      <CardContent className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div
                className={cn(
                  'p-2 rounded-lg',
                  subscriptionTier !== 'FREE'
                    ? 'bg-green-500/10'
                    : usagePercentage >= 100
                      ? 'bg-destructive/10'
                      : usagePercentage >= 75
                        ? 'bg-orange-500/10'
                        : 'bg-primary/10'
                )}
              >
                <Icon className={cn('h-6 w-6', statusConfig.iconColor)} />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="font-semibold text-base">{statusConfig.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {statusConfig.description}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {statusConfig.showProgress && (
            <div className="space-y-2">
              <Progress
                value={usagePercentage}
                className="h-2"
                indicatorClassName={statusConfig.progressColor}
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {generationsUsed} used
                </span>
                <span>
                  {generationLimit} total
                </span>
              </div>
            </div>
          )}

          {/* Upgrade CTA */}
          {statusConfig.showUpgrade && onUpgradeClick && (
            <div
              className={cn(
                'pt-4 border-t',
                usagePercentage >= 100 && 'border-destructive/20'
              )}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="text-sm space-y-1">
                  <p className="font-medium">Get Unlimited Access</p>
                  <p className="text-muted-foreground text-xs">
                    Upgrade to Pro for unlimited AI personalizations
                  </p>
                </div>
                <Button
                  onClick={onUpgradeClick}
                  variant={usagePercentage >= 100 ? 'default' : 'outline'}
                  size="sm"
                  className="flex-shrink-0"
                >
                  Upgrade
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
}

// Badge variant for display in navigation or headers
export function GenerationStatusBadge({
  generationsUsed,
  generationLimit,
  subscriptionTier,
  onClick,
  className,
}: Omit<GenerationStatusProps, 'variant' | 'onUpgradeClick'> & {
  onClick?: () => void;
}) {
  const remainingGenerations = Math.max(0, generationLimit - generationsUsed);
  const usagePercentage = generationLimit === 0 ? 0 : (generationsUsed / generationLimit) * 100;

  if (subscriptionTier !== 'FREE') {
    return (
      <button
        onClick={onClick}
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium',
          'bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20 transition-colors',
          className
        )}
      >
        <CheckCircleIcon className="h-3.5 w-3.5" />
        <span>Pro Plan</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
        usagePercentage >= 100
          ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
          : usagePercentage >= 75
            ? 'bg-orange-500/10 text-orange-700 dark:text-orange-400 hover:bg-orange-500/20'
            : 'bg-primary/10 text-primary hover:bg-primary/20',
        className
      )}
    >
      <SparklesIcon className="h-3.5 w-3.5" />
      <span>
        {remainingGenerations}/{generationLimit}
      </span>
    </button>
  );
}
