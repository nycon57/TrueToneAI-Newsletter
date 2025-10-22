'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export interface OnboardingData {
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  company?: string;
  transcript?: string;
  voiceAnalysis?: {
    persona: string;
    truetone_settings: Record<string, string>;
    key_insights: string[];
    confidence_score: number;
  };
  categoryPreferences: string[];
  tagPreferences: string[];
  selectedPlan?: string;
  billingType?: 'free_trial' | 'paid_plan' | 'enterprise';
}

export interface FormErrors {
  [key: string]: string | undefined;
}

interface OnboardingContextType {
  data: OnboardingData;
  errors: FormErrors;
  currentStep: number;
  totalSteps: number;
  isSubmitting: boolean;
  direction: 'forward' | 'back';

  updateData: (field: keyof OnboardingData, value: unknown) => void;
  updateMultipleFields: (updates: Partial<OnboardingData>) => void;
  setErrors: (errors: FormErrors) => void;
  clearErrors: () => void;
  setError: (field: string, message: string) => void;
  clearError: (field: string) => void;

  goToStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;

  validateCurrentStep: () => boolean;

  completeOnboarding: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const DEFAULT_DATA: OnboardingData = {
  firstName: '',
  lastName: '',
  email: '',
  jobTitle: '',
  categoryPreferences: [],
  tagPreferences: [],
  selectedPlan: undefined,
  billingType: undefined,
};

interface OnboardingProviderProps {
  children: React.ReactNode;
  initialData: {
    email: string;
    firstName: string;
    lastName: string;
    currentStep: number;
    userId?: string;
  };
}

export function OnboardingProvider({
  children,
  initialData
}: OnboardingProviderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [data, setData] = useState<OnboardingData>({
    ...DEFAULT_DATA,
    firstName: initialData.firstName,
    lastName: initialData.lastName,
    email: initialData.email,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [currentStep, setCurrentStep] = useState(initialData.currentStep || 1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');

  const totalSteps = 4;

  const updateData = useCallback((field: keyof OnboardingData, value: unknown) => {
    setData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const updateMultipleFields = useCallback((updates: Partial<OnboardingData>) => {
    setData(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  const setError = useCallback((field: string, message: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: message
    }));
  }, []);

  const clearError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const setErrorsCallback = useCallback((newErrors: FormErrors) => {
    setErrors(newErrors);
  }, []);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setDirection(step > currentStep ? 'forward' : 'back');
      setCurrentStep(step);

      const url = new URL(window.location.href);
      url.searchParams.set('step', step.toString());
      window.history.replaceState({}, '', url.toString());
    }
  }, [currentStep, totalSteps]);

  const nextStep = useCallback(() => {
    if (currentStep < totalSteps) {
      goToStep(currentStep + 1);
    }
  }, [currentStep, totalSteps, goToStep]);

  const previousStep = useCallback(() => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  }, [currentStep, goToStep]);

  const validateCurrentStep = useCallback(() => {
    // Clear only field-specific errors for the current step
    let isValid = true;
    const fieldsToValidate: string[] = [];

    switch (currentStep) {
      case 1: // Welcome
        break;
      case 2: // Profile Details
        fieldsToValidate.push('jobTitle');
        if (!data.jobTitle?.trim()) {
          setError('jobTitle', 'Job title is required');
          isValid = false;
        } else {
          clearError('jobTitle');
        }
        break;
      case 3: // Category Preferences
        fieldsToValidate.push('categoryPreferences');
        if (data.categoryPreferences.length === 0) {
          setError('categoryPreferences', 'Please select at least one category');
          isValid = false;
        } else {
          clearError('categoryPreferences');
        }
        break;
      case 4: // Subscription
        break;
    }

    return isValid;
  }, [currentStep, data, setError, clearError]);

  const completeOnboarding = useCallback(async () => {
    // Validate current step before submitting
    if (!validateCurrentStep()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileData: {
            firstName: data.firstName,
            lastName: data.lastName,
            title: data.jobTitle,
            company: data.company || '',
          },
          transcript: data.transcript,
          analysisResults: data.voiceAnalysis,
          categoryPreferences: data.categoryPreferences,
          tagPreferences: data.tagPreferences,
          billingData: {
            selectedPlan: data.selectedPlan,
            billingType: data.billingType,
          },
        }),
      });

      if (response.ok) {
        router.push('/onboarding/success');
      } else {
        throw new Error('Failed to complete onboarding');
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
      setError('general', 'Failed to complete onboarding. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [data, router, setError, validateCurrentStep]);

  // Initialize step from URL on mount
  useEffect(() => {
    const stepFromUrl = searchParams.get('step');
    if (stepFromUrl) {
      const step = parseInt(stepFromUrl, 10);
      if (step >= 1 && step <= totalSteps) {
        setCurrentStep(step);
      }
    }
  }, [searchParams, totalSteps]);

  const contextValue: OnboardingContextType = {
    data,
    errors,
    currentStep,
    totalSteps,
    isSubmitting,
    direction,

    updateData,
    updateMultipleFields,
    setErrors: setErrorsCallback,
    clearErrors,
    setError,
    clearError,

    goToStep,
    nextStep,
    previousStep,

    validateCurrentStep,

    completeOnboarding,
  };

  return (
    <OnboardingContext.Provider value={contextValue}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}