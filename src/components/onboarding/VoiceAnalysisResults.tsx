'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Sparkles, User, MessageCircle } from 'lucide-react';
import { getTrueToneOption } from '@/lib/truetone/constants';

interface VoiceAnalysisResultsProps {
  results: {
    persona: string;
    truetone_settings: Record<string, string>;
    key_insights: string[];
    confidence_score: number;
  };
  onComplete: () => void;
}

const TRUETONE_DIMENSION_LABELS = {
  detail_orientation: 'Detail Level',
  vocabulary: 'Vocabulary Style',
  content_length: 'Content Length',
  engagement_style: 'Engagement Approach',
  tone_of_voice: 'Tone of Voice',
  formality: 'Formality Level',
  humor: 'Humor Style',
  emotional_expression: 'Emotional Expression'
};

export function VoiceAnalysisResults({ results, onComplete }: VoiceAnalysisResultsProps) {
  const confidencePercentage = Math.round(results.confidence_score * 100);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <CheckCircle className="h-16 w-16 mx-auto text-green-600 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Your TrueTone Profile is Ready!</h2>
        <p className="text-gray-600">
          Based on your interview, we&apos;ve created a personalized communication profile.
        </p>
      </div>

      {/* Confidence Score */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
            Analysis Confidence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Progress value={confidencePercentage} className="flex-1 h-3" />
            <Badge variant={confidencePercentage >= 80 ? "default" : "secondary"}>
              {confidencePercentage}% Confident
            </Badge>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {confidencePercentage >= 80
              ? "High confidence - Your TrueTone profile is very reliable!"
              : "Moderate confidence - You can refine this later as needed."
            }
          </p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Professional Persona */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-600" />
              Your Professional Persona
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{results.persona}</p>
          </CardContent>
        </Card>

        {/* Key Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2 text-blue-600" />
              Key Communication Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {results.key_insights.map((insight, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{insight}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* TrueTone Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Your TrueTone Settings</CardTitle>
          <CardDescription>
            These dimensions shape how content will be personalized for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(results.truetone_settings).map(([dimension, value]) => {
              const label = TRUETONE_DIMENSION_LABELS[dimension as keyof typeof TRUETONE_DIMENSION_LABELS];
              const option = getTrueToneOption(dimension as any, value);

              return (
                <div key={dimension} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{label}</span>
                    <Badge variant="outline">{option?.label || value}</Badge>
                  </div>
                  {option?.example && (
                    <p className="text-sm text-gray-600 italic">
                      "{option.example}"
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>What This Means</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-900 mb-2">
              <strong>Content will be generated to match your style:</strong>
            </p>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Email templates that sound like you wrote them</li>
              <li>• Social media posts in your authentic voice</li>
              <li>• Video scripts that match your speaking style</li>
              <li>• Marketing content that reflects your personality</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button onClick={onComplete} size="lg" className="px-8">
          Complete Setup & Go to Dashboard
        </Button>
        <p className="text-sm text-gray-500 mt-2">
          You can always adjust these settings later in your profile.
        </p>
      </div>
    </div>
  );
}