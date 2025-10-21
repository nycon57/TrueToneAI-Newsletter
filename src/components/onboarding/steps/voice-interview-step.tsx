'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useOnboarding } from '../providers/onboarding-provider';
import { VoiceOnboardingInterview } from '../VoiceOnboardingInterview';

export function VoiceInterviewStep() {
  const { updateData, nextStep, previousStep } = useOnboarding();

  const handleInterviewComplete = (transcript: string) => {
    updateData('transcript', transcript);
    nextStep();
  };

  const handleSkip = () => {
    nextStep();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <Card className="shadow-lg">
        <CardContent className="p-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-heading font-bold">Voice Interview</h2>
              <span className="px-3 py-1 text-xs bg-lilac/20 text-lilac rounded-full">
                Optional
              </span>
            </div>
            <p className="text-muted-foreground">
              Complete a 5-minute conversation to create your personalized TrueTone communication profile.
              This helps us understand your unique voice and style.
            </p>
          </div>

          <VoiceOnboardingInterview onComplete={handleInterviewComplete} />

          <div className="flex justify-between pt-6 border-t">
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
              type="button"
              variant="secondary"
              onClick={handleSkip}
              className="flex items-center gap-2"
            >
              Skip Voice Interview
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}