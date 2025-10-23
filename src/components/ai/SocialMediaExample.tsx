'use client';

/**
 * USAGE EXAMPLE: Social Media Platform Selector
 *
 * This file demonstrates how to integrate the SocialPlatformSelector
 * and SocialPlatformResults components into your application.
 *
 * Location: src/components/ai/SocialMediaExample.tsx
 */

import { useState } from 'react';
import {
  SocialPlatformSelector,
  SocialPlatformResults,
  type SocialPlatform
} from './SocialPlatformSelector';

/**
 * BASIC USAGE: Platform Selector Only
 */
export function BasicSelectorExample() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([]);

  return (
    <div className="p-6">
      <SocialPlatformSelector
        selectedPlatforms={selectedPlatforms}
        onPlatformsChange={(platforms) => {
          setSelectedPlatforms(platforms);
          console.log('Selected platforms:', platforms);
        }}
      />

      {/* Display selected platforms */}
      {selectedPlatforms.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium">You selected:</p>
          <p className="text-sm text-gray-600">{selectedPlatforms.join(', ')}</p>
        </div>
      )}
    </div>
  );
}

/**
 * ADVANCED USAGE: Results Display
 */
export function ResultsDisplayExample() {
  const [results] = useState<Record<SocialPlatform, string>>({
    facebook: 'Check out our latest mortgage rate update! The Fed just cut rates, creating new opportunities for homebuyers and those looking to refinance. Let\'s discuss your options today! 🏡',
    twitter: 'BREAKING: Fed cuts rates! 📉 Great news for homebuyers and those considering refinancing. DM me to explore your options. #MortgageRates #HomeBuying',
    linkedin: 'The Federal Reserve\'s recent rate cut presents significant opportunities for both first-time homebuyers and existing homeowners considering refinancing. As a mortgage professional, I\'m here to help you understand how this impacts your specific situation and explore the best path forward. Connect with me to discuss personalized strategies.',
    instagram: 'Fed just dropped rates! 💥 This could mean lower monthly payments for you. Swipe up to learn more or DM me for a free consultation. #MortgageNews #RealEstate #FirstTimeHomeBuyer'
  });

  const handleCopy = (platform: SocialPlatform, content: string) => {
    console.log(`Copied ${platform} content:`, content);
  };

  const handleRegenerate = (platform: SocialPlatform) => {
    console.log(`Regenerating content for ${platform}`);
    // Implement regeneration logic here
  };

  return (
    <div className="p-6">
      <SocialPlatformResults
        results={results}
        onCopy={handleCopy}
        onRegenerate={handleRegenerate}
      />
    </div>
  );
}

/**
 * INTEGRATION EXAMPLE: Full Workflow
 *
 * This example shows how to integrate both selector and results
 * in a complete generation workflow
 */
export function FullWorkflowExample() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([]);
  const [results, setResults] = useState<Record<SocialPlatform, string>>({} as Record<SocialPlatform, string>);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (selectedPlatforms.length === 0) {
      alert('Please select at least one platform');
      return;
    }

    setIsGenerating(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock generated results
    const mockResults: Record<SocialPlatform, string> = {};

    selectedPlatforms.forEach(platform => {
      mockResults[platform] = `Generated content for ${platform}. This is a sample post that would be customized based on the platform's characteristics and audience.`;
    });

    setResults(mockResults);
    setIsGenerating(false);
  };

  const handleCopy = (platform: SocialPlatform, content: string) => {
    console.log(`Copied ${platform}:`, content);
  };

  const handleRegenerate = async (platform: SocialPlatform) => {
    console.log(`Regenerating ${platform}`);

    // Simulate regeneration
    await new Promise(resolve => setTimeout(resolve, 1500));

    setResults(prev => ({
      ...prev,
      [platform]: `Regenerated content for ${platform} at ${new Date().toLocaleTimeString()}`
    }));
  };

  const hasResults = Object.keys(results).length > 0;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Step 1: Select Platforms */}
      {!hasResults && (
        <div>
          <SocialPlatformSelector
            selectedPlatforms={selectedPlatforms}
            onPlatformsChange={setSelectedPlatforms}
            disabled={isGenerating}
          />

          <button
            onClick={handleGenerate}
            disabled={selectedPlatforms.length === 0 || isGenerating}
            className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
          >
            {isGenerating ? 'Generating...' : `Generate for ${selectedPlatforms.length} Platform${selectedPlatforms.length !== 1 ? 's' : ''}`}
          </button>
        </div>
      )}

      {/* Step 2: Display Results */}
      {hasResults && (
        <div>
          <SocialPlatformResults
            results={results}
            onCopy={handleCopy}
            onRegenerate={handleRegenerate}
          />

          <button
            onClick={() => {
              setResults({} as Record<SocialPlatform, string>);
              setSelectedPlatforms([]);
            }}
            className="mt-6 w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
          >
            Start Over
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * INTEGRATION WITH EXISTING AIGenerationPanel
 *
 * Replace the social_content case in your existing component:
 */

/*
// Inside your existing AIGenerationPanel.tsx or article display component:

import { SocialMediaGenerationPanel } from '@/components/ai/SocialMediaGenerationPanel';

// In your render method, for social content:
{contentType === 'social_content' && (
  <SocialMediaGenerationPanel
    articleId={articleId}
    userTier={userTier}
    remainingGenerations={remainingGenerations}
    initialResults={cachedSocialResults} // Optional: pre-loaded results
    onSave={(results) => {
      console.log('Saving social media results:', results);
      // Handle save to database
    }}
    onContentGenerated={(results) => {
      console.log('Content generated:', results);
      // Cache results in parent component
    }}
  />
)}
*/

/**
 * API ENDPOINT EXAMPLE
 *
 * Your API route should accept the selected platforms and return
 * content for each platform:
 */

/*
// src/app/api/ai/personalize-stream/route.ts

export async function POST(req: Request) {
  const { articleId, contentType, platforms } = await req.json();

  if (contentType === 'social_content') {
    // Generate content for each selected platform
    const results: Record<string, string> = {};

    for (const platform of platforms) {
      // Generate platform-specific content
      results[platform] = await generateSocialContent({
        articleId,
        platform,
        // Add platform-specific prompts/instructions
      });
    }

    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // ... rest of your API logic
}
*/

/**
 * STYLING CUSTOMIZATION
 *
 * The components use Tailwind CSS and can be customized via className props:
 */

export function StyledExample() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([]);

  return (
    <SocialPlatformSelector
      selectedPlatforms={selectedPlatforms}
      onPlatformsChange={setSelectedPlatforms}
      className="bg-white rounded-xl shadow-lg p-6"
    />
  );
}
