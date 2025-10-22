'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useOnboarding } from '../providers/onboarding-provider';

const contentCategories = [
  { id: 'rate_alert', label: 'Rate Alerts', description: 'Federal Reserve updates and rate changes' },
  { id: 'program_update', label: 'Program Updates', description: 'FHA, VA, and loan program changes' },
  { id: 'credit_update', label: 'Credit Updates', description: 'Credit scoring and qualification news' },
  { id: 'market_trends', label: 'Market Trends', description: 'Housing market insights and forecasts' },
  { id: 'compliance', label: 'Compliance', description: 'Regulatory updates and compliance news' },
  { id: 'technology', label: 'Technology', description: 'Fintech and mortgage technology updates' }
];

export function PreferencesStep() {
  const {
    data,
    errors,
    updateData,
    nextStep,
    previousStep,
    validateCurrentStep,
  } = useOnboarding();

  const handleCategoryToggle = (categoryId: string) => {
    const currentPreferences = data.categoryPreferences || [];
    const newPreferences = currentPreferences.includes(categoryId)
      ? currentPreferences.filter(id => id !== categoryId)
      : [...currentPreferences, categoryId];

    updateData('categoryPreferences', newPreferences);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateCurrentStep()) {
      nextStep();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <Card className="shadow-lg">
        <CardContent className="p-8">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-heading font-bold mb-2">Content Preferences</CardTitle>
            <CardDescription>
              Choose the topics you'd like to receive insights about. You can change these anytime.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {contentCategories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={(e) => {
                    // Only toggle if clicking the container (not the checkbox itself)
                    if (e.target === e.currentTarget || (e.target as HTMLElement).tagName === 'LABEL' || (e.target as HTMLElement).tagName === 'P') {
                      handleCategoryToggle(category.id);
                    }
                  }}
                >
                  <Checkbox
                    id={category.id}
                    checked={data.categoryPreferences?.includes(category.id) || false}
                    onCheckedChange={() => handleCategoryToggle(category.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor={category.id} className="font-medium cursor-pointer">
                      {category.label}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {errors.categoryPreferences && (
              <p className="text-sm text-destructive mt-4">{errors.categoryPreferences}</p>
            )}

            <div className="bg-orchid/5 border border-orchid/20 rounded-lg p-4 mt-6">
              <p className="text-orchid text-sm">
                <strong>Tip:</strong> Select at least one category to receive personalized newsletter content.
                You can modify these preferences later in your account settings.
              </p>
            </div>

            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={previousStep}
                className="flex items-center gap-2"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Back
              </Button>
              <Button
                type="submit"
                disabled={(data.categoryPreferences?.length || 0) === 0}
                className="flex items-center gap-2"
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