'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserIcon, MicrophoneIcon, CogIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useOnboarding } from '../providers/onboarding-provider';

export function WelcomeStep() {
  const { nextStep } = useOnboarding();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <Card className="shadow-lg">
        <CardContent className="p-8">
          <div className="text-center">
            <CardHeader className="pb-6">
              <CardTitle className="text-3xl font-heading font-bold mb-4">
                Welcome to TrueTone Newsletter!
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                Let's personalize your newsletter experience in just a few simple steps.
              </CardDescription>
            </CardHeader>

            <div className="grid md:grid-cols-3 gap-8 my-12">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-orchid/10 rounded-full flex items-center justify-center">
                  <UserIcon className="h-8 w-8 text-orchid" />
                </div>
                <h3 className="font-heading font-semibold text-lg">Profile Setup</h3>
                <p className="text-sm text-muted-foreground">
                  Tell us about yourself and your professional background
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-lilac/10 rounded-full flex items-center justify-center">
                  <MicrophoneIcon className="h-8 w-8 text-lilac" />
                </div>
                <h3 className="font-heading font-semibold text-lg">Voice Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Optional 5-minute conversation to create your unique TrueTone profile
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-skyward/10 rounded-full flex items-center justify-center">
                  <CogIcon className="h-8 w-8 text-skyward" />
                </div>
                <h3 className="font-heading font-semibold text-lg">Content Preferences</h3>
                <p className="text-sm text-muted-foreground">
                  Choose the topics and content types that matter most to you
                </p>
              </div>
            </div>

            <div className="bg-orchid/5 border border-orchid/20 rounded-lg p-6 mb-8">
              <h4 className="font-heading font-semibold text-orchid mb-2">What You'll Get:</h4>
              <ul className="text-sm text-muted-foreground space-y-1 text-left max-w-md mx-auto">
                <li>• Personalized newsletter content tailored to your interests</li>
                <li>• AI-powered content recommendations</li>
                <li>• Optional voice-based personalization for authentic communication</li>
                <li>• Easy-to-copy content for your own marketing and communications</li>
              </ul>
            </div>

            <Button
              size="lg"
              onClick={nextStep}
              className="px-8 py-3 text-lg"
            >
              Get Started
              <ArrowRightIcon className="h-5 w-5 ml-2" />
            </Button>

            <p className="text-xs text-muted-foreground mt-4">
              This setup will take about 5-10 minutes to complete
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}