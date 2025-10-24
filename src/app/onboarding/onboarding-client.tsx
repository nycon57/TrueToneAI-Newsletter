'use client';

import React, { Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { OnboardingProvider, useOnboarding } from '@/components/onboarding/providers/onboarding-provider';
import { Loader2 } from 'lucide-react';
import { OnboardingLayoutWrapper } from './onboarding-layout-wrapper';

import { WelcomeStep } from '@/components/onboarding/steps/welcome-step';
import { ProfileDetailsStep } from '@/components/onboarding/steps/profile-details-step';

const TrueToneCharacteristicsStep = lazy(() =>
  import('@/components/onboarding/steps/truetone-step').then(module => ({
    default: module.TrueToneCharacteristicsStep
  }))
);

const CategorySelection = lazy(() =>
  import('@/components/onboarding/steps/category-selection').then(module => ({
    default: module.CategorySelection
  }))
);

const SubscriptionStep = lazy(() =>
  import('@/components/onboarding/steps/subscription-step').then(module => ({
    default: module.SubscriptionStep
  }))
);

function StepLoadingFallback() {
  return (
    <div className="w-full">
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading step...</p>
        </div>
      </div>
    </div>
  );
}

class StepErrorBoundary extends React.Component<
  { children: React.ReactNode; stepNumber: number },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; stepNumber: number }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`[OnboardingPage] Error loading step ${this.props.stepNumber}:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mx-auto">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center space-y-4 bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md">
              <h3 className="text-lg font-medium text-destructive">Failed to Load Step</h3>
              <p className="text-destructive/80">
                There was an error loading step {this.props.stepNumber}. Please try refreshing the page.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-destructive text-white px-4 py-2 rounded-md hover:bg-destructive/90 transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function OnboardingContent() {
  const { currentStep, direction } = useOnboarding();

  const renderStep = () => {
    const StepComponent = (() => {
      switch (currentStep) {
        case 1:
          return WelcomeStep;
        case 2:
          return ProfileDetailsStep;
        case 3:
          return TrueToneCharacteristicsStep;
        case 4:
          return CategorySelection;
        case 5:
          return SubscriptionStep;
        default:
          return WelcomeStep;
      }
    })();

    return (
      <StepErrorBoundary stepNumber={currentStep}>
        <Suspense fallback={<StepLoadingFallback />}>
          <StepComponent />
        </Suspense>
      </StepErrorBoundary>
    );
  };

  return (
    <OnboardingLayoutWrapper>
      <div className="w-full max-w-4xl mx-auto px-4 py-8 min-h-full">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            initial={{ opacity: 0, x: direction === 'back' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction === 'back' ? 20 : -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </OnboardingLayoutWrapper>
  );
}

interface OnboardingClientProps {
  initialData: {
    email: string;
    firstName: string;
    lastName: string;
    currentStep: number;
    userId?: string;
  };
}

export default function OnboardingClient({ initialData }: OnboardingClientProps) {
  return (
    <OnboardingProvider
      initialData={initialData}
    >
      <OnboardingContent />
    </OnboardingProvider>
  );
}