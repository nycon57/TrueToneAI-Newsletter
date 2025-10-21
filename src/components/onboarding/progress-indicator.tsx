'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

const stepLabels = [
  'Welcome',
  'Profile',
  'Preferences',
  'Subscribe',
];

export function ProgressIndicator({ currentStep, totalSteps, className }: ProgressIndicatorProps) {
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className={cn("w-full max-w-4xl mx-auto px-4 py-6", className)}>
      {/* Step indicators */}
      <div className="relative">
        {/* Progress bar background */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-border/50" />

        {/* Progress bar fill */}
        <div
          className="absolute top-5 left-0 h-1 bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />

        {/* Step dots */}
        <div className="relative flex justify-between">
          {Array.from({ length: totalSteps }, (_, index) => {
            const step = index + 1;
            const isCompleted = step < currentStep;
            const isCurrent = step === currentStep;

            return (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 relative z-10",
                    isCompleted && "bg-primary text-primary-foreground shadow-md",
                    isCurrent && "bg-primary text-primary-foreground ring-4 ring-primary/20 scale-110 shadow-lg",
                    !isCompleted && !isCurrent && "bg-background border-2 border-border text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    step
                  )}
                </div>
                <span
                  className={cn(
                    "mt-2 text-xs font-medium transition-colors hidden sm:block",
                    isCurrent && "text-primary",
                    isCompleted && "text-foreground",
                    !isCompleted && !isCurrent && "text-muted-foreground"
                  )}
                >
                  {stepLabels[index]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile step label */}
      <div className="mt-4 text-center sm:hidden">
        <p className="text-sm font-medium text-foreground">
          Step {currentStep} of {totalSteps}: {stepLabels[currentStep - 1]}
        </p>
      </div>

      {/* Progress percentage */}
      <div className="mt-4 text-center">
        <p className="text-xs text-muted-foreground">
          {Math.round(progressPercentage)}% Complete
        </p>
      </div>
    </div>
  );
}
