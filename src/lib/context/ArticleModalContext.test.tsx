/**
 * Manual Testing Guide for ArticleModalContext
 *
 * This file provides test scenarios to verify the ArticleModalContext
 * works correctly. Run these tests manually in your browser.
 */

'use client';

import React from 'react';
import { ArticleModalProvider, useArticleModal, type Article } from './ArticleModalContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// ============================================================================
// Test Data
// ============================================================================

const mockArticles: Article[] = [
  {
    id: 'article-1',
    title: 'Federal Reserve Cuts Interest Rates',
    summary: 'The Fed announces a 0.25% rate cut, creating opportunities for homebuyers.',
    content_type: 'article',
    category: 'mortgage',
    tags: ['rates', 'fed', 'housing'],
    published_at: '2025-10-25T12:00:00Z',
    keyInsights: [
      'Mortgage rates likely to decrease in coming weeks',
      'Good opportunity for refinancing',
      'Increased buyer competition expected',
    ],
    videoScript: 'Hey everyone! Big news from the Fed today...',
    emailTemplate: 'Subject: Fed Rate Cut - What It Means For You\n\nHi there...',
    socialContent: {
      twitter: 'Breaking: Fed cuts rates! Time to talk strategy. #mortgage',
      facebook: 'Great news for homebuyers! Let\'s discuss your options.',
    },
    is_personalized: false,
  },
  {
    id: 'article-2',
    title: 'New FHA Loan Limits for 2025',
    summary: 'FHA raises loan limits, giving first-time buyers more purchasing power.',
    content_type: 'article',
    category: 'programs',
    tags: ['fha', 'first-time-buyer', 'loan-limits'],
    published_at: '2025-10-24T10:00:00Z',
    keyInsights: [
      'FHA limits up 8% nationwide',
      'More buying power in high-cost areas',
      'Lower down payment requirements',
    ],
    videoScript: 'Hey everyone, big news from FHA!...',
    emailTemplate: 'Subject: New FHA Limits = More Buying Power!\n\nHello...',
    socialContent: {
      instagram: 'FHA limits are UP for 2025! Let\'s talk #homebuying',
    },
    is_personalized: true,
    generation_stats: {
      total: 5,
      hasKeyInsights: true,
      hasVideoScript: true,
      hasEmailTemplate: true,
      hasSocialMedia: true,
      socialPlatforms: ['instagram', 'facebook', 'twitter'],
    },
  },
];

// ============================================================================
// Test Scenarios
// ============================================================================

export function ArticleModalTestSuite() {
  return (
    <ArticleModalProvider
      onArticleOpen={(id) => console.log('✅ Article opened:', id)}
      onArticleClose={() => console.log('✅ Article closed')}
    >
      <div className="container mx-auto py-8 space-y-8">
        <h1 className="text-3xl font-bold">ArticleModal Test Suite</h1>

        <TestScenario1_BasicOpen />
        <TestScenario2_OptimisticUpdate />
        <TestScenario3_DeepLink />
        <TestScenario4_MultipleArticles />
        <TestScenario5_StateInspection />

        {/* Status Display */}
        <ModalStatus />
      </div>
    </ArticleModalProvider>
  );
}

// ============================================================================
// Test Scenario 1: Basic Modal Open/Close
// ============================================================================

function TestScenario1_BasicOpen() {
  const { openArticle, closeArticle, isOpen } = useArticleModal();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test 1: Basic Open/Close</CardTitle>
        <CardDescription>
          Open modal without data (will show loading state)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={() => openArticle('article-1')}>
            Open Article 1 (No Data)
          </Button>
          <Button onClick={() => closeArticle()} variant="outline">
            Close Modal
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          Status: {isOpen ? '✅ Modal Open' : '❌ Modal Closed'}
        </div>
        <div className="text-xs bg-muted p-2 rounded">
          Expected: Modal opens with loading state, URL updates to ?article=article-1
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Test Scenario 2: Optimistic Update (With Article Data)
// ============================================================================

function TestScenario2_OptimisticUpdate() {
  const { openArticle } = useArticleModal();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test 2: Optimistic Update</CardTitle>
        <CardDescription>
          Open modal with article data (no loading state)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          {mockArticles.map((article) => (
            <Button
              key={article.id}
              onClick={() => openArticle(article.id, article)}
              variant="outline"
              className="justify-start"
            >
              Open: {article.title}
            </Button>
          ))}
        </div>
        <div className="text-xs bg-muted p-2 rounded">
          Expected: Modal opens immediately with article content, no loading state
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Test Scenario 3: Deep Linking
// ============================================================================

function TestScenario3_DeepLink() {
  const { openArticle } = useArticleModal();

  const copyDeepLink = (articleId: string) => {
    const url = `${window.location.origin}${window.location.pathname}?article=${articleId}`;
    navigator.clipboard.writeText(url);
    alert('Deep link copied! Paste in new tab to test.');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test 3: Deep Linking</CardTitle>
        <CardDescription>
          Copy URL with article parameter and open in new tab
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          {mockArticles.map((article) => (
            <div key={article.id} className="flex gap-2">
              <Button
                onClick={() => openArticle(article.id, article)}
                variant="outline"
                className="flex-1 justify-start"
              >
                {article.title}
              </Button>
              <Button
                onClick={() => copyDeepLink(article.id)}
                size="sm"
                variant="secondary"
              >
                Copy Link
              </Button>
            </div>
          ))}
        </div>
        <div className="text-xs bg-muted p-2 rounded">
          Expected: Copied URL opens modal when pasted in new tab
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Test Scenario 4: Multiple Articles
// ============================================================================

function TestScenario4_MultipleArticles() {
  const { openArticle, isArticleOpen } = useArticleModal();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test 4: Article Selection</CardTitle>
        <CardDescription>
          Open different articles and verify active state
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          {mockArticles.map((article) => (
            <Button
              key={article.id}
              onClick={() => openArticle(article.id, article)}
              variant={isArticleOpen(article.id) ? 'default' : 'outline'}
              className="justify-start"
            >
              {isArticleOpen(article.id) && '✓ '}
              {article.title}
            </Button>
          ))}
        </div>
        <div className="text-xs bg-muted p-2 rounded">
          Expected: Checkmark shows on currently open article
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Test Scenario 5: State Inspection
// ============================================================================

function TestScenario5_StateInspection() {
  const modalState = useArticleModal();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test 5: State Inspection</CardTitle>
        <CardDescription>
          View current modal state
        </CardDescription>
      </CardHeader>
      <CardContent>
        <pre className="bg-muted p-4 rounded text-xs overflow-auto">
          {JSON.stringify(
            {
              isOpen: modalState.isOpen,
              articleId: modalState.articleId,
              hasArticle: !!modalState.article,
              articleTitle: modalState.article?.title,
              isLoading: modalState.isLoading,
              error: modalState.error,
            },
            null,
            2
          )}
        </pre>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Modal Status Display
// ============================================================================

function ModalStatus() {
  const { isOpen, articleId, article, isLoading, error } = useArticleModal();

  return (
    <Card className="sticky bottom-4 border-2 border-primary">
      <CardHeader>
        <CardTitle className="text-sm">Current Modal Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div>Open: <strong>{isOpen ? 'Yes' : 'No'}</strong></div>
        <div>Article ID: <strong>{articleId || 'None'}</strong></div>
        <div>Article Loaded: <strong>{article ? 'Yes' : 'No'}</strong></div>
        <div>Loading: <strong>{isLoading ? 'Yes' : 'No'}</strong></div>
        <div>Error: <strong>{error || 'None'}</strong></div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Testing Instructions
// ============================================================================

/*
MANUAL TESTING CHECKLIST:

1. Basic Functionality
   ✓ Click "Open Article 1" - Modal opens
   ✓ URL updates to include ?article=article-1
   ✓ Click "Close Modal" - Modal closes
   ✓ URL parameter is removed
   ✓ Scroll position is preserved

2. Optimistic Updates
   ✓ Click article with data - Opens immediately (no loading)
   ✓ Article content displays correctly
   ✓ No loading spinner appears

3. Deep Linking
   ✓ Copy deep link
   ✓ Paste in new browser tab
   ✓ Modal opens automatically on page load
   ✓ Article content loads

4. Browser Navigation
   ✓ Open modal
   ✓ Click browser back button
   ✓ Modal closes
   ✓ Click browser forward button
   ✓ Modal reopens

5. State Management
   ✓ Open article 1
   ✓ Verify checkmark appears
   ✓ Open article 2
   ✓ Verify checkmark moves
   ✓ State inspector shows correct data

6. Scroll Lock
   ✓ Scroll page down
   ✓ Open modal
   ✓ Verify cannot scroll background
   ✓ Close modal
   ✓ Verify scroll position restored

7. Multiple Opens
   ✓ Open same article twice
   ✓ Verify no duplicate fetches
   ✓ Switch between articles
   ✓ Verify state updates correctly

8. Error Handling
   ✓ Open article with invalid ID
   ✓ Verify error message displays
   ✓ Verify can close modal
   ✓ No console errors

Expected Console Logs:
- "✅ Article opened: article-1"
- "✅ Article closed"

Check URL for:
- ?article=article-1 when open
- No parameter when closed

All tests should pass without errors!
*/
