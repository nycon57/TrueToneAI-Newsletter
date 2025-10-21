'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  HomeIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  TrendingUpIcon,
  ScaleIcon,
  CpuChipIcon,
  UserGroupIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { useOnboarding } from '../providers/onboarding-provider';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const LOAN_CATEGORIES: Category[] = [
  {
    id: 'purchase',
    label: 'Purchase',
    description: 'Home buying and purchase loans',
    icon: HomeIcon
  },
  {
    id: 'refinance',
    label: 'Refinance',
    description: 'Rate and term refinancing',
    icon: TrendingUpIcon
  },
  {
    id: 'fha',
    label: 'FHA',
    description: 'Federal Housing Administration loans',
    icon: ShieldCheckIcon
  },
  {
    id: 'va',
    label: 'VA',
    description: 'Veterans Affairs loans',
    icon: ScaleIcon
  },
  {
    id: 'conventional',
    label: 'Conventional',
    description: 'Traditional mortgage loans',
    icon: BuildingOfficeIcon
  },
  {
    id: 'jumbo',
    label: 'Jumbo',
    description: 'High-value property financing',
    icon: CreditCardIcon
  },
  {
    id: 'first_time_buyer',
    label: 'First-Time Buyer',
    description: 'Programs for new homebuyers',
    icon: UserGroupIcon
  },
  {
    id: 'investment_property',
    label: 'Investment Property',
    description: 'Rental and investment real estate',
    icon: CpuChipIcon
  },
];

export function CategorySelection() {
  const {
    data,
    errors,
    updateData,
    nextStep,
    previousStep,
    validateCurrentStep,
  } = useOnboarding();

  const selectedCategories = (data.categoryPreferences || []) as string[];

  const handleCategoryToggle = (categoryId: string) => {
    const newPreferences = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];

    updateData('categoryPreferences', newPreferences);
  };

  const handleSelectAll = () => {
    if (selectedCategories.length === LOAN_CATEGORIES.length) {
      updateData('categoryPreferences', []);
    } else {
      updateData('categoryPreferences', LOAN_CATEGORIES.map(c => c.id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateCurrentStep()) {
      nextStep();
    }
  };

  const isAllSelected = selectedCategories.length === LOAN_CATEGORIES.length;
  const hasSelection = selectedCategories.length > 0;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <Card className="shadow-lg border-border">
        <CardHeader className="text-center pb-6 space-y-2">
          <CardTitle className="text-3xl font-heading font-bold">
            Choose Your Focus Areas
          </CardTitle>
          <CardDescription className="text-base">
            Select the loan categories you work with most. This helps us personalize your newsletter content.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleSubmit}>
            {/* Select All / Deselect All */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b">
              <p className="text-sm text-muted-foreground">
                {selectedCategories.length} of {LOAN_CATEGORIES.length} selected
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleSelectAll}
                className="text-primary hover:text-primary/90"
              >
                {isAllSelected ? 'Deselect All' : 'Select All'}
              </Button>
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {LOAN_CATEGORIES.map((category) => {
                const isSelected = selectedCategories.includes(category.id);
                const Icon = category.icon;

                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Label
                      htmlFor={category.id}
                      className={cn(
                        "flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200",
                        "hover:shadow-md hover:border-primary/30",
                        isSelected
                          ? "bg-primary/5 border-primary shadow-sm"
                          : "bg-background border-border hover:bg-muted/30"
                      )}
                    >
                      <Checkbox
                        id={category.id}
                        checked={isSelected}
                        onCheckedChange={() => handleCategoryToggle(category.id)}
                        className="mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className={cn(
                            "h-5 w-5 flex-shrink-0",
                            isSelected ? "text-primary" : "text-muted-foreground"
                          )} />
                          <span className={cn(
                            "font-medium text-sm sm:text-base",
                            isSelected ? "text-primary" : "text-foreground"
                          )}>
                            {category.label}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-snug">
                          {category.description}
                        </p>
                      </div>
                    </Label>
                  </motion.div>
                );
              })}
            </div>

            {/* Error Message */}
            {errors.categoryPreferences && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4"
              >
                <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                  {errors.categoryPreferences}
                </p>
              </motion.div>
            )}

            {/* Info Tip */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-6">
              <p className="text-primary text-sm leading-relaxed">
                <strong className="font-semibold">Tip:</strong> Select at least one category to receive personalized content.
                You can update your preferences anytime from your account settings.
              </p>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-6 mt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={previousStep}
                className="flex items-center justify-center gap-2"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Back
              </Button>
              <Button
                type="submit"
                disabled={!hasSelection}
                className="flex items-center justify-center gap-2"
              >
                Continue
                <ArrowRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
