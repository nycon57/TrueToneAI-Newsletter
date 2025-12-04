'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useOnboarding } from '../providers/onboarding-provider';
import { VoiceAnalysisResults } from '../VoiceAnalysisResults';

export function VoiceAnalysisResultsStep() {
  const { data, nextStep, previousStep } = useOnboarding();

  const handleComplete = () => {
    nextStep();
  };

  // If no voice analysis was done, show a different view
  if (!data.transcript && !data.voiceAnalysis) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-8">
        <Card className="shadow-lg">
          <CardContent className="p-8">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-heading font-bold mb-2">Voice Analysis</CardTitle>
              <CardDescription>
                You skipped the voice interview, so we&apos;ll use default settings for now.
              </CardDescription>
            </CardHeader>

            <div className="bg-skyward/5 border border-skyward/20 rounded-lg p-6 text-center">
              <h3 className="font-semibold mb-2 text-skyward">No Voice Profile Created</h3>
              <p className="text-sm text-muted-foreground mb-4">
                You can always come back later to complete the voice interview and create your personalized TrueTone profile.
              </p>
              <p className="text-xs text-muted-foreground">
                For now, we&apos;ll use standard communication settings that you can customize in your preferences.
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
                onClick={handleComplete}
                className="flex items-center gap-2"
              >
                Continue
                <ArrowRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <Card className="shadow-lg">
        <CardContent className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-heading font-bold mb-2">Your TrueTone Profile</h2>
            <p className="text-muted-foreground">
              Based on your voice interview, here&apos;s your personalized communication profile.
            </p>
          </div>

          {data.voiceAnalysis && (
            <VoiceAnalysisResults
              results={data.voiceAnalysis}
              onComplete={handleComplete}
            />
          )}

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
              onClick={handleComplete}
              className="flex items-center gap-2"
            >
              Continue
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}