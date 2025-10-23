'use client';

/**
 * Visual Reference: All Component States
 *
 * This file demonstrates all possible UI states of the social media components.
 * Use this for design review, testing, and documentation purposes.
 */

import { useState } from 'react';
import {
  SocialPlatformSelector,
  SocialPlatformResults,
  type SocialPlatform
} from './SocialPlatformSelector';

// Mock data for different states
const MOCK_RESULTS: Record<SocialPlatform, string> = {
  facebook: `🏠 Big news from the Federal Reserve! They just announced a 0.25% rate cut, which means exciting opportunities for homebuyers and those looking to refinance.

What this means for you:
✅ Lower monthly mortgage payments
✅ Better buying power for your dream home
✅ Potential savings of $150-400/month on refinancing

Don't wait to explore your options! This could be the perfect time to make your move. Drop me a message or call to discuss how this impacts your home buying plans.

#MortgageRates #RealEstate #HomeBuying #FedRateCut`,

  instagram: `Rate drop alert! 💥 The Fed just cut rates by 0.25% and this is HUGE for homebuyers.

Ready to finally buy that dream home or save money on your current mortgage? Let's make it happen! 🏡✨

DM me for a free consultation and let's talk strategy.

#MortgageNews #RealEstateGoals #FirstTimeHomeBuyer #HomeLoan #FedCut`,

  twitter: `BREAKING: Fed cuts rates by 0.25%! 📉

Great news for homebuyers & those looking to refi. This could mean:
✅ Lower monthly payments
✅ More buying power
✅ Better loan terms

Let's talk about your options. DM me! 🏡

#MortgageRates #RealEstate`,

  linkedin: `The Federal Reserve's recent 0.25% rate cut presents significant opportunities in the mortgage market that borrowers should understand and potentially act upon.

Key Implications:
• Mortgage rates are likely to decrease in the coming weeks, improving affordability
• Homeowners who purchased within the past 12-18 months may benefit from refinancing
• First-time buyers gain access to previously unaffordable price ranges
• Market competition may intensify as buyers return with renewed confidence

Strategic Considerations:
For current homeowners, this rate environment creates an excellent opportunity to evaluate refinancing options. The potential monthly savings of $150-400 on typical mortgage amounts can significantly impact long-term financial planning.

For prospective buyers, lower rates translate to enhanced purchasing power and reduced monthly obligations, making homeownership more accessible across various price points.

As a mortgage professional, I'm here to help you navigate these opportunities and determine the best strategy for your unique situation. Whether you're considering your first home purchase or exploring refinancing options, let's discuss how these market changes can benefit your financial goals.

Connect with me to schedule a consultation and explore personalized strategies.

#MortgageIndustry #RealEstateFinance #HomeLending #FinancialPlanning #FederalReserve`
};

/**
 * STATE 1: Initial - No Platforms Selected
 */
export function StateInitial() {
  const [selected, setSelected] = useState<SocialPlatform[]>([]);

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="mb-4 pb-4 border-b">
        <h2 className="text-lg font-bold text-gray-900">State: Initial</h2>
        <p className="text-sm text-gray-600">No platforms selected</p>
      </div>

      <SocialPlatformSelector
        selectedPlatforms={selected}
        onPlatformsChange={setSelected}
      />
    </div>
  );
}

/**
 * STATE 2: Some Platforms Selected
 */
export function StatePartialSelection() {
  const [selected, setSelected] = useState<SocialPlatform[]>(['facebook', 'twitter']);

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="mb-4 pb-4 border-b">
        <h2 className="text-lg font-bold text-gray-900">State: Partial Selection</h2>
        <p className="text-sm text-gray-600">2 platforms selected (Facebook, Twitter)</p>
      </div>

      <SocialPlatformSelector
        selectedPlatforms={selected}
        onPlatformsChange={setSelected}
      />
    </div>
  );
}

/**
 * STATE 3: All Platforms Selected
 */
export function StateAllSelected() {
  const [selected, setSelected] = useState<SocialPlatform[]>([
    'facebook',
    'instagram',
    'twitter',
    'linkedin'
  ]);

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="mb-4 pb-4 border-b">
        <h2 className="text-lg font-bold text-gray-900">State: All Selected</h2>
        <p className="text-sm text-gray-600">All 4 platforms selected</p>
      </div>

      <SocialPlatformSelector
        selectedPlatforms={selected}
        onPlatformsChange={setSelected}
      />
    </div>
  );
}

/**
 * STATE 4: Disabled State
 */
export function StateDisabled() {
  const [selected, setSelected] = useState<SocialPlatform[]>(['facebook', 'linkedin']);

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="mb-4 pb-4 border-b">
        <h2 className="text-lg font-bold text-gray-900">State: Disabled</h2>
        <p className="text-sm text-gray-600">Component is disabled (e.g., during generation)</p>
      </div>

      <SocialPlatformSelector
        selectedPlatforms={selected}
        onPlatformsChange={setSelected}
        disabled={true}
      />
    </div>
  );
}

/**
 * STATE 5: Results - Single Platform
 */
export function StateResultsSingle() {
  const results: Record<SocialPlatform, string> = {
    facebook: MOCK_RESULTS.facebook,
    instagram: '',
    twitter: '',
    linkedin: ''
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="mb-4 pb-4 border-b">
        <h2 className="text-lg font-bold text-gray-900">State: Results (Single)</h2>
        <p className="text-sm text-gray-600">Generated content for 1 platform</p>
      </div>

      <SocialPlatformResults
        results={results}
        onCopy={(platform, content) => console.log(`Copied ${platform}`)}
        onRegenerate={(platform) => console.log(`Regenerating ${platform}`)}
      />
    </div>
  );
}

/**
 * STATE 6: Results - Multiple Platforms
 */
export function StateResultsMultiple() {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="mb-4 pb-4 border-b">
        <h2 className="text-lg font-bold text-gray-900">State: Results (Multiple)</h2>
        <p className="text-sm text-gray-600">Generated content for all platforms</p>
      </div>

      <SocialPlatformResults
        results={MOCK_RESULTS}
        onCopy={(platform, content) => console.log(`Copied ${platform}`)}
        onRegenerate={(platform) => console.log(`Regenerating ${platform}`)}
      />
    </div>
  );
}

/**
 * STATE 7: Results - Regenerating One Platform
 */
export function StateRegenerating() {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="mb-4 pb-4 border-b">
        <h2 className="text-lg font-bold text-gray-900">State: Regenerating</h2>
        <p className="text-sm text-gray-600">Twitter content is being regenerated</p>
      </div>

      <SocialPlatformResults
        results={MOCK_RESULTS}
        onCopy={(platform, content) => console.log(`Copied ${platform}`)}
        onRegenerate={(platform) => console.log(`Regenerating ${platform}`)}
        regeneratingPlatforms={new Set(['twitter'])}
      />
    </div>
  );
}

/**
 * STATE 8: Results - Character Limit Warning
 */
export function StateCharacterWarning() {
  const resultsWithWarning: Record<SocialPlatform, string> = {
    ...MOCK_RESULTS,
    twitter: 'This is a very long tweet that exceeds the 280 character limit for Twitter/X. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.'
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="mb-4 pb-4 border-b">
        <h2 className="text-lg font-bold text-gray-900">State: Character Warning</h2>
        <p className="text-sm text-gray-600">Twitter content exceeds character limit</p>
      </div>

      <SocialPlatformResults
        results={resultsWithWarning}
        onCopy={(platform, content) => console.log(`Copied ${platform}`)}
        onRegenerate={(platform) => console.log(`Regenerating ${platform}`)}
      />
    </div>
  );
}

/**
 * STATE 9: Mobile Layout Preview
 */
export function StateMobilePreview() {
  const [selected, setSelected] = useState<SocialPlatform[]>(['instagram', 'facebook']);

  return (
    <div className="max-w-sm mx-auto">
      <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="mb-4 pb-4 border-b">
          <h2 className="text-lg font-bold text-gray-900">State: Mobile Layout</h2>
          <p className="text-sm text-gray-600">Single column on mobile devices</p>
        </div>

        <SocialPlatformSelector
          selectedPlatforms={selected}
          onPlatformsChange={setSelected}
        />
      </div>
    </div>
  );
}

/**
 * ALL STATES SHOWCASE
 * Displays all states in a grid for comprehensive review
 */
export function AllStatesShowcase() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Social Media Components - All States
          </h1>
          <p className="text-gray-600">
            Visual reference for all possible UI states of the social media platform selector
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <StateInitial />
          <StatePartialSelection />
          <StateAllSelected />
          <StateDisabled />
        </div>

        <div className="space-y-8">
          <StateResultsSingle />
          <StateResultsMultiple />
          <StateRegenerating />
          <StateCharacterWarning />
        </div>

        <div className="lg:hidden">
          <StateMobilePreview />
        </div>

        {/* Color palette reference */}
        <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Color Palette</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <div className="h-20 rounded-lg bg-gradient-to-br from-orchid to-indigo mb-2" />
              <p className="text-xs font-medium">Primary Gradient</p>
              <p className="text-xs text-gray-500">orchid → indigo</p>
            </div>
            <div>
              <div className="h-20 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 mb-2" />
              <p className="text-xs font-medium">Facebook</p>
              <p className="text-xs text-gray-500">blue-600 → blue-700</p>
            </div>
            <div>
              <div className="h-20 rounded-lg bg-gradient-to-br from-pink-600 to-pink-700 mb-2" />
              <p className="text-xs font-medium">Instagram</p>
              <p className="text-xs text-gray-500">pink-600 → pink-700</p>
            </div>
            <div>
              <div className="h-20 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 mb-2" />
              <p className="text-xs font-medium">Twitter/X</p>
              <p className="text-xs text-gray-500">blue-500 → blue-600</p>
            </div>
            <div>
              <div className="h-20 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-700 mb-2" />
              <p className="text-xs font-medium">LinkedIn</p>
              <p className="text-xs text-gray-500">indigo-600 → indigo-700</p>
            </div>
            <div>
              <div className="h-20 rounded-lg bg-gradient-to-br from-lavender/30 to-lavender/10 border border-lavender/50 mb-2" />
              <p className="text-xs font-medium">Loading State</p>
              <p className="text-xs text-gray-500">lavender/30 → lavender/10</p>
            </div>
            <div>
              <div className="h-20 rounded-lg bg-green-50 border border-green-200 mb-2" />
              <p className="text-xs font-medium">Success State</p>
              <p className="text-xs text-gray-500">green-50 / green-200</p>
            </div>
            <div>
              <div className="h-20 rounded-lg bg-red-50 border border-red-200 mb-2" />
              <p className="text-xs font-medium">Error State</p>
              <p className="text-xs text-gray-500">red-50 / red-200</p>
            </div>
          </div>
        </div>

        {/* Interactive playground */}
        <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Interactive Playground</h2>
          <p className="text-sm text-gray-600 mb-4">
            Try interacting with the components to see all states in action
          </p>
          <InteractivePlayground />
        </div>
      </div>
    </div>
  );
}

/**
 * Interactive playground component
 */
function InteractivePlayground() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowResults(true);
    }, 2000);
  };

  const handleReset = () => {
    setShowResults(false);
    setSelectedPlatforms([]);
  };

  return (
    <div className="space-y-6">
      {!showResults && (
        <>
          <SocialPlatformSelector
            selectedPlatforms={selectedPlatforms}
            onPlatformsChange={setSelectedPlatforms}
            disabled={isGenerating}
          />

          <button
            onClick={handleGenerate}
            disabled={selectedPlatforms.length === 0 || isGenerating}
            className="w-full px-6 py-3 bg-gradient-to-r from-orchid to-indigo text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
          >
            {isGenerating ? 'Generating...' : `Generate for ${selectedPlatforms.length} Platform${selectedPlatforms.length !== 1 ? 's' : ''}`}
          </button>
        </>
      )}

      {showResults && (
        <>
          <SocialPlatformResults
            results={MOCK_RESULTS}
            onCopy={(platform) => console.log(`Copied ${platform}`)}
            onRegenerate={(platform) => console.log(`Regenerating ${platform}`)}
          />

          <button
            onClick={handleReset}
            className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
          >
            Start Over
          </button>
        </>
      )}
    </div>
  );
}

export default AllStatesShowcase;
