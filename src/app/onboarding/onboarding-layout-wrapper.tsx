'use client';

import React from "react";
import { signal, inter } from "../fonts";
import { cn } from "@/lib/utils";
import { ONBOARDING_STEPS } from "./onboarding-constants";
import { useOnboarding } from "@/components/onboarding/providers/onboarding-provider";

function MobileProgressStepper({ currentStep }: { currentStep: number }) {
  const { goToStep } = useOnboarding();

  const handleStepClick = (stepId: number) => {
    if (stepId <= currentStep) {
      goToStep(stepId);
    }
  };

  const currentStepData = ONBOARDING_STEPS.find(step => step.id === currentStep);

  return (
    <div className="lg:hidden bg-background border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Step {currentStep} of {ONBOARDING_STEPS.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round((currentStep / ONBOARDING_STEPS.length) * 100)}% complete
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-orchid h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${(currentStep / ONBOARDING_STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orchid flex items-center justify-center">
            {React.createElement(ONBOARDING_STEPS[currentStep - 1]?.icon, {
              className: "w-5 h-5 text-white"
            })}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-semibold text-foreground">
                {currentStepData?.title}
              </h2>
              {currentStepData?.isOptional && (
                <span className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded">
                  Optional
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {currentStepData?.description}
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-4">
          {ONBOARDING_STEPS.map((step, index) => {
            const isActive = currentStep === step.id;
            const isPast = currentStep > step.id;
            const isClickable = step.id <= currentStep;

            return (
              <button
                key={step.id}
                onClick={() => handleStepClick(step.id)}
                disabled={!isClickable}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-200 relative",
                  isActive
                    ? "bg-orchid scale-125"
                    : isPast
                    ? "bg-orchid/70"
                    : "bg-muted-foreground/30",
                  isClickable && "hover:scale-110"
                )}
                aria-label={`${step.title} - Step ${step.id}${step.isOptional ? ' (Optional)' : ''}`}
              >
                {step.isOptional && !isActive && !isPast && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function EnhancedDesktopSidebar({ currentStep }: {
  currentStep: number;
}) {
  const { goToStep } = useOnboarding();

  const handleStepClick = (stepId: number) => {
    if (stepId <= currentStep) {
      goToStep(stepId);
    }
  };

  return (
    <div className="hidden lg:flex flex-col bg-gradient-to-tr from-shadow to-orchid text-white transition-all duration-300 h-screen w-80">
      <div className="p-6 border-b border-white/10 flex-shrink-0">
        <h1 className="text-xl font-bold">TrueTone Newsletter</h1>
        <p className="text-white/70 text-sm mt-1">Setup your account</p>
      </div>

      <div className="flex-1 p-6 overflow-y-auto min-h-0">
        <div className="space-y-4">
          {ONBOARDING_STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isPast = currentStep > step.id;
            const isClickable = step.id <= currentStep;

            return (
              <div key={step.id} className="relative">
                {index !== 0 && (
                  <div
                    className={cn(
                      "absolute left-4 -top-4 w-0.5 h-4 transition-colors duration-300",
                      isPast || isActive ? "bg-white" : "bg-white/20"
                    )}
                  />
                )}
                <button
                  onClick={() => handleStepClick(step.id)}
                  className={cn(
                    "group flex items-center gap-4 transition-all duration-300 w-full text-left p-3 rounded-lg",
                    step.id <= currentStep ? "opacity-100" : "opacity-40",
                    isClickable && "hover:bg-white/10",
                    !isClickable && "cursor-not-allowed",
                    isActive && "bg-white/10"
                  )}
                  disabled={!isClickable}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 flex-shrink-0",
                      isActive
                        ? "bg-white border-white"
                        : isPast
                        ? "bg-white border-white"
                        : "bg-transparent border-white/30",
                      isClickable && !isActive && !isPast && "group-hover:border-white/60"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-4 h-4 transition-colors duration-300",
                        isActive || isPast ? "text-shadow" : "text-white",
                        isClickable && !isActive && !isPast && "group-hover:text-white/80"
                      )}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3
                        className={cn(
                          "text-white font-medium text-sm transition-all duration-300 truncate",
                          isActive || isPast ? "opacity-100" : "opacity-70",
                          isClickable && !isActive && !isPast && "group-hover:opacity-90"
                        )}
                      >
                        {step.title}
                      </h3>
                      {step.isOptional && (
                        <span className="px-1.5 py-0.5 text-xs bg-white/20 rounded text-white/80">
                          Optional
                        </span>
                      )}
                    </div>
                    <p
                      className={cn(
                        "text-white/70 text-xs transition-all duration-300 truncate",
                        isActive || isPast ? "opacity-100" : "opacity-60",
                        isClickable && !isActive && !isPast && "group-hover:opacity-80"
                      )}
                    >
                      {step.description}
                    </p>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-6 border-t border-white/10 flex-shrink-0">
        <div className="text-xs text-white/50">
          Complete all steps to access your personalized newsletter experience.
        </div>
      </div>
    </div>
  );
}

export function OnboardingLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { currentStep } = useOnboarding();

  return (
    <div className={cn(
      "flex h-screen bg-background overflow-hidden",
      signal.variable,
      inter.variable
    )}>
      <EnhancedDesktopSidebar
        currentStep={currentStep}
      />

      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        <MobileProgressStepper currentStep={currentStep} />

        <div className="flex-1 bg-background overflow-y-auto">
          <div className="h-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}