'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useOnboarding } from '../providers/onboarding-provider';

export function ProfileDetailsStep() {
  const {
    data,
    errors,
    updateData,
    nextStep,
    previousStep,
    validateCurrentStep,
  } = useOnboarding();

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
            <CardTitle className="text-2xl font-heading font-bold mb-2">Profile Details</CardTitle>
            <CardDescription className="text-lg">
              Tell us a bit about yourself to personalize your experience
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={data.firstName}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  From your account
                </p>
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={data.lastName}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  From your account
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={data.email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground mt-1">
                From your account
              </p>
            </div>

            <div>
              <Label htmlFor="jobTitle">Job Title / Role *</Label>
              <Input
                id="jobTitle"
                value={data.jobTitle}
                onChange={(e) => updateData('jobTitle', e.target.value)}
                placeholder="e.g., Loan Officer, Real Estate Agent, Business Owner"
                className={errors.jobTitle ? 'border-destructive' : ''}
                maxLength={100}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.jobTitle ? (
                  <p className="text-sm text-destructive">{errors.jobTitle}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    This helps us tailor content to your professional context
                  </p>
                )}
                <span className="text-xs text-muted-foreground">
                  {data.jobTitle.length}/100
                </span>
              </div>
            </div>

            <div>
              <Label htmlFor="company">Company (Optional)</Label>
              <Input
                id="company"
                value={data.company || ''}
                onChange={(e) => updateData('company', e.target.value)}
                placeholder="e.g., ABC Lending, XYZ Realty"
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Optional - helps personalize your content
              </p>
            </div>

            <div className="bg-orchid/5 border border-orchid/20 rounded-lg p-4 mt-6">
              <p className="text-orchid text-sm">
                <strong>Tip:</strong> Your name and email are already set from your account.
                We just need a few more details to personalize your newsletter experience.
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
              <Button type="submit" className="flex items-center gap-2">
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