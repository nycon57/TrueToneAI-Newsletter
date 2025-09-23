'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, MicOff, Phone, PhoneCall } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface VoiceOnboardingInterviewProps {
  onComplete: (transcript: string) => void;
}

const INTERVIEW_QUESTIONS = [
  "Tell me about your business and what makes you unique as a mortgage professional.",
  "How do you typically communicate with your clients? Are you more formal or casual?",
  "Can you share a recent success story with a client?",
  "Describe your ideal client and how you help them achieve their goals.",
  "What industry terms or phrases do you use regularly in your communication?",
  "How detailed do you like to be when explaining mortgage processes to clients?",
  "What's your approach to building relationships with new clients?"
];

export function VoiceOnboardingInterview({ onComplete }: VoiceOnboardingInterviewProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  // For demo purposes, we'll simulate the interview
  // In production, this would integrate with Vapi
  const startInterview = () => {
    setIsConnected(true);
    setIsRecording(true);

    // Simulate interview progression
    simulateInterview();
  };

  const simulateInterview = () => {
    setIsSimulating(true);

    // Simulate going through each question
    const questionInterval = setInterval(() => {
      setCurrentQuestion(prev => {
        if (prev < INTERVIEW_QUESTIONS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(questionInterval);
          completeInterview();
          return prev;
        }
      });
    }, 3000); // 3 seconds per question for demo
  };

  const completeInterview = () => {
    setIsRecording(false);
    setIsSimulating(false);

    // Generate a sample transcript for demo purposes
    const sampleTranscript = `
    I'm a mortgage loan officer with over 8 years of experience helping families achieve their homeownership dreams. What makes me unique is my approach to education - I believe in taking the time to really explain the mortgage process so my clients feel confident and informed every step of the way.

    I'd say my communication style is professional but approachable. I like to keep things conversational because buying a home can be overwhelming, and I want my clients to feel comfortable asking questions. I'm not overly formal, but I maintain that professional expertise they need to trust me with such a big decision.

    Just last month, I helped a young couple who thought they couldn't qualify for a home loan. They had some credit challenges, but I worked with them for three months, explaining different loan programs and helping them improve their credit score. We finally got them into their first home with an FHA loan, and they were absolutely thrilled. Moments like that remind me why I love what I do.

    My ideal clients are first-time homebuyers and families looking to upgrade. I really enjoy working with people who are eager to learn and want to understand the process. I take pride in being their trusted advisor throughout the entire journey.

    In terms of industry language, I use terms like "pre-approval," "debt-to-income ratio," "closing costs," and "loan-to-value ratio," but I always explain what these mean in plain English. I believe in demystifying the mortgage process.

    When it comes to explaining processes, I tend to be pretty thorough. I'd rather over-communicate than leave someone confused. I typically walk through each step of the mortgage process, from application to closing, and I provide written summaries after our conversations.

    My relationship-building approach is all about trust and education. I start by listening to understand their goals, then I provide clear information and regular updates. I believe in being responsive - I return calls and emails quickly because I know how important this process is to my clients.
    `;

    onComplete(sampleTranscript.trim());
  };

  const endInterview = () => {
    setIsConnected(false);
    setIsRecording(false);
    setIsSimulating(false);
    completeInterview();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-4">Voice Interview</h2>
        <p className="text-gray-600">
          I'll ask you a series of questions to understand your communication style.
          Speak naturally - there are no right or wrong answers!
        </p>
      </div>

      {!isConnected ? (
        <Card>
          <CardContent className="text-center p-8">
            <Phone className="h-16 w-16 mx-auto text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-4">Ready to start?</h3>
            <p className="text-gray-600 mb-6">
              The interview will take about 5-7 minutes. Make sure you're in a quiet space
              where you can speak freely.
            </p>
            <Button onClick={startInterview} size="lg" className="px-8">
              Start Interview
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                {isRecording ? (
                  <>
                    <Mic className="h-5 w-5 text-red-500" />
                    <Badge variant="destructive">Recording</Badge>
                  </>
                ) : (
                  <>
                    <MicOff className="h-5 w-5 text-gray-400" />
                    <Badge variant="outline">Paused</Badge>
                  </>
                )}
              </div>
              <Badge variant="outline">
                Question {currentQuestion + 1} of {INTERVIEW_QUESTIONS.length}
              </Badge>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Current Question:</h3>
              <p className="text-blue-800 text-lg">
                {INTERVIEW_QUESTIONS[currentQuestion]}
              </p>
            </div>

            {isSimulating && (
              <div className="text-center mb-6">
                <div className="animate-pulse">
                  <PhoneCall className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                  <p className="text-sm text-gray-600">Listening to your response...</p>
                </div>
              </div>
            )}

            <div className="text-center">
              <Button
                onClick={endInterview}
                variant="outline"
                className="mr-4"
              >
                End Interview
              </Button>
              {!isSimulating && (
                <Button onClick={simulateInterview}>
                  Continue Interview
                </Button>
              )}
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Questions completed: {currentQuestion + 1} / {INTERVIEW_QUESTIONS.length}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}