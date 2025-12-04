'use client';

import { useState } from 'react';
import { VoiceOnboardingInterview } from '@/components/onboarding/VoiceOnboardingInterview';
import { VoiceAnalysisResults } from '@/components/onboarding/VoiceAnalysisResults';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Mic, Brain, Sparkles } from 'lucide-react';

type OnboardingStep = 'intro' | 'interview' | 'processing' | 'results' | 'complete';

interface AnalysisResults {
  persona: string;
  truetone_settings: Record<string, string>;
  key_insights: string[];
  confidence_score: number;
}

export default function VoiceOnboardingPage() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('intro');
  const [transcript, setTranscript] = useState<string>('');
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);

  const steps = [
    { id: 'intro', title: 'Welcome', icon: Sparkles },
    { id: 'interview', title: 'Voice Interview', icon: Mic },
    { id: 'processing', title: 'AI Analysis', icon: Brain },
    { id: 'results', title: 'Your TrueTone', icon: CheckCircle },
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleInterviewComplete = (interviewTranscript: string) => {
    setTranscript(interviewTranscript);
    setCurrentStep('processing');

    // Process the transcript
    processTranscript(interviewTranscript);
  };

  const processTranscript = async (transcriptText: string) => {
    try {
      const response = await fetch('/api/voice/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcript: transcriptText }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze transcript');
      }

      const data = await response.json();
      setAnalysisResults(data.analysis);
      setCurrentStep('results');
    } catch (error) {
      console.error('Error processing transcript:', error);
      // Handle error appropriately
    }
  };

  const handleComplete = () => {
    setCurrentStep('complete');
    // Redirect to dashboard or next step
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Create Your TrueTone Profile
          </h1>
          <p className="text-xl text-gray-600">
            let&apos;s capture your unique communication style through a brief voice interview
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index <= currentStepIndex;
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`rounded-full p-2 ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className={`ml-2 text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Content */}
        <Card className="shadow-xl">
          <CardContent className="p-8">
            {currentStep === 'intro' && (
              <div className="text-center">
                <CardHeader>
                  <CardTitle className="text-2xl mb-4">Welcome to TrueTone AI</CardTitle>
                  <CardDescription className="text-lg">
                    we&apos;ll have a brief 5-minute conversation to understand your unique communication style.
                    This helps us personalize all content to sound authentically like you.
                  </CardDescription>
                </CardHeader>

                <div className="grid md:grid-cols-3 gap-6 my-8">
                  <div className="text-center">
                    <Mic className="h-12 w-12 mx-auto text-blue-600 mb-3" />
                    <h3 className="font-semibold mb-2">Voice Interview</h3>
                    <p className="text-sm text-gray-600">
                      Natural conversation about your business and communication style
                    </p>
                  </div>
                  <div className="text-center">
                    <Brain className="h-12 w-12 mx-auto text-blue-600 mb-3" />
                    <h3 className="font-semibold mb-2">AI Analysis</h3>
                    <p className="text-sm text-gray-600">
                      Our AI analyzes your speech patterns, vocabulary, and style
                    </p>
                  </div>
                  <div className="text-center">
                    <Sparkles className="h-12 w-12 mx-auto text-blue-600 mb-3" />
                    <h3 className="font-semibold mb-2">Personalized Content</h3>
                    <p className="text-sm text-gray-600">
                      All generated content matches your authentic voice
                    </p>
                  </div>
                </div>

                <Button
                  size="lg"
                  onClick={() => setCurrentStep('interview')}
                  className="px-8 py-3"
                >
                  Start Voice Interview
                </Button>
              </div>
            )}

            {currentStep === 'interview' && (
              <VoiceOnboardingInterview onComplete={handleInterviewComplete} />
            )}

            {currentStep === 'processing' && (
              <div className="text-center py-12">
                <Brain className="h-16 w-16 mx-auto text-blue-600 mb-4 animate-pulse" />
                <h3 className="text-xl font-semibold mb-2">Analyzing Your Voice...</h3>
                <p className="text-gray-600 mb-4">
                  Our AI is processing your responses to create your unique TrueTone profile.
                </p>
                <div className="max-w-md mx-auto">
                  <Progress value={75} className="h-3" />
                </div>
              </div>
            )}

            {currentStep === 'results' && analysisResults && (
              <VoiceAnalysisResults
                results={analysisResults}
                onComplete={handleComplete}
              />
            )}

            {currentStep === 'complete' && (
              <div className="text-center py-12">
                <CheckCircle className="h-16 w-16 mx-auto text-green-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">TrueTone Profile Complete!</h3>
                <p className="text-gray-600 mb-6">
                  Your personalized communication profile has been saved.
                  You can now generate content that sounds authentically like you.
                </p>
                <Button size="lg" onClick={() => window.location.href = '/dashboard'}>
                  Go to Dashboard
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}