/**
 * Integration Tests for Generation Update API
 *
 * These tests are designed to run against a real API endpoint.
 * Requires a test user account and valid authentication.
 *
 * Run with: npm run test:integration
 */

import { describe, it, expect, beforeAll } from '@jest/globals';

// Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const TEST_USER_TOKEN = process.env.TEST_USER_TOKEN; // Set this in your .env.test

// Test data
let testGenerationId: string;
let testArticleId: string;

/**
 * Helper function to make authenticated API requests
 */
async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(TEST_USER_TOKEN && { Authorization: `Bearer ${TEST_USER_TOKEN}` }),
      ...options.headers,
    },
  });
}

describe('Generation Update API - Integration Tests', () => {
  beforeAll(async () => {
    // Setup: Create a test article and generation
    // Note: You'll need to implement these helper endpoints or use existing test data
    console.log('Setting up test data...');

    // For now, use existing IDs from your test database
    // In a real integration test, you would:
    // 1. Create a test article
    // 2. Generate initial content
    // 3. Use those IDs for testing

    testArticleId = process.env.TEST_ARTICLE_ID || 'replace-with-real-article-id';
    testGenerationId = process.env.TEST_GENERATION_ID || 'replace-with-real-generation-id';
  });

  describe('Authentication', () => {
    it('should reject unauthenticated requests', async () => {
      const response = await fetch(
        `${API_BASE_URL}/api/generations/${testGenerationId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: 'Test content' }),
        }
      );

      expect(response.status).toBe(401);

      const data = await response.json();
      expect(data.error).toBe('Authentication required');
    });
  });

  describe('Video Script Updates', () => {
    it('should successfully update a video script', async () => {
      const updatedContent = `
Hey everyone! This is an updated video script from integration test.

Running at: ${new Date().toISOString()}

This script has been edited by the user to include custom messaging.
      `.trim();

      const response = await apiRequest(`/api/generations/${testGenerationId}`, {
        method: 'PATCH',
        body: JSON.stringify({ content: updatedContent }),
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.generation.id).toBe(testGenerationId);
      expect(data.generation.content).toBe(updatedContent);
      expect(data.generation.updated_at).toBeDefined();
    });

    it('should reject empty content', async () => {
      const response = await apiRequest(`/api/generations/${testGenerationId}`, {
        method: 'PATCH',
        body: JSON.stringify({ content: '   ' }),
      });

      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error).toContain('empty');
    });

    it('should trim whitespace from content', async () => {
      const contentWithWhitespace = '  \n  Test content with whitespace  \n  ';
      const expectedTrimmed = 'Test content with whitespace';

      const response = await apiRequest(`/api/generations/${testGenerationId}`, {
        method: 'PATCH',
        body: JSON.stringify({ content: contentWithWhitespace }),
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.generation.content).toBe(expectedTrimmed);
    });
  });

  describe('Key Insights Updates', () => {
    // Note: This test requires a KEY_INSIGHTS type generation
    const keyInsightsGenerationId = process.env.TEST_KEY_INSIGHTS_GEN_ID || 'skip';

    it.skip('should successfully update key insights', async () => {
      if (keyInsightsGenerationId === 'skip') {
        console.log('Skipping: No KEY_INSIGHTS generation ID provided');
        return;
      }

      const updatedInsights = [
        'First updated insight from integration test',
        'Second updated insight with timestamp: ' + new Date().toISOString(),
        'Third updated insight demonstrating array handling',
      ];

      const response = await apiRequest(
        `/api/generations/${keyInsightsGenerationId}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ content_array: updatedInsights }),
        }
      );

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.generation.content_array).toEqual(updatedInsights);
    });

    it.skip('should reject empty insights array', async () => {
      if (keyInsightsGenerationId === 'skip') {
        console.log('Skipping: No KEY_INSIGHTS generation ID provided');
        return;
      }

      const response = await apiRequest(
        `/api/generations/${keyInsightsGenerationId}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ content_array: [] }),
        }
      );

      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error).toContain('empty');
    });
  });

  describe('Social Media Updates with Character Limits', () => {
    // Note: This test requires SOCIAL_MEDIA type generations for each platform
    const twitterGenerationId = process.env.TEST_TWITTER_GEN_ID || 'skip';

    it.skip('should successfully update Twitter post under 280 characters', async () => {
      if (twitterGenerationId === 'skip') {
        console.log('Skipping: No Twitter generation ID provided');
        return;
      }

      const twitterContent = 'BREAKING: Test update from integration test! 🚀 #testing';

      const response = await apiRequest(`/api/generations/${twitterGenerationId}`, {
        method: 'PATCH',
        body: JSON.stringify({ content: twitterContent }),
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.generation.content).toBe(twitterContent);
    });

    it.skip('should reject Twitter post over 280 characters', async () => {
      if (twitterGenerationId === 'skip') {
        console.log('Skipping: No Twitter generation ID provided');
        return;
      }

      // Create content over 280 characters
      const longContent = 'a'.repeat(281);

      const response = await apiRequest(`/api/generations/${twitterGenerationId}`, {
        method: 'PATCH',
        body: JSON.stringify({ content: longContent }),
      });

      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error).toContain('twitter character limit');
      expect(data.current_length).toBe(281);
      expect(data.max_length).toBe(280);
    });
  });

  describe('Authorization', () => {
    it('should reject updates to generations owned by other users', async () => {
      // Use a generation ID that belongs to a different user
      const otherUserGenerationId = process.env.TEST_OTHER_USER_GEN_ID || 'skip';

      if (otherUserGenerationId === 'skip') {
        console.log('Skipping: No other user generation ID provided');
        return;
      }

      const response = await apiRequest(
        `/api/generations/${otherUserGenerationId}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ content: 'Attempting to update' }),
        }
      );

      expect(response.status).toBe(403);

      const data = await response.json();
      expect(data.error).toContain('not authorized');
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent generation', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      const response = await apiRequest(`/api/generations/${fakeId}`, {
        method: 'PATCH',
        body: JSON.stringify({ content: 'Test content' }),
      });

      expect(response.status).toBe(404);

      const data = await response.json();
      expect(data.error).toBe('Generation not found');
    });

    it('should return 400 for malformed request body', async () => {
      const response = await apiRequest(`/api/generations/${testGenerationId}`, {
        method: 'PATCH',
        body: JSON.stringify({}), // Missing required fields
      });

      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error).toBeDefined();
    });

    it('should handle invalid JSON gracefully', async () => {
      const response = await fetch(
        `${API_BASE_URL}/api/generations/${testGenerationId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...(TEST_USER_TOKEN && { Authorization: `Bearer ${TEST_USER_TOKEN}` }),
          },
          body: 'invalid json{',
        }
      );

      expect(response.status).toBe(500);
    });
  });

  describe('Concurrent Updates', () => {
    it('should handle concurrent updates correctly', async () => {
      const updates = [
        { content: 'First concurrent update' },
        { content: 'Second concurrent update' },
        { content: 'Third concurrent update' },
      ];

      // Send all updates concurrently
      const responses = await Promise.all(
        updates.map((update) =>
          apiRequest(`/api/generations/${testGenerationId}`, {
            method: 'PATCH',
            body: JSON.stringify(update),
          })
        )
      );

      // All should succeed
      responses.forEach((response) => {
        expect(response.status).toBe(200);
      });

      // Final state should be one of the updates
      const results = await Promise.all(responses.map((r) => r.json()));
      const finalContent = results[results.length - 1].generation.content;

      expect(
        updates.some((u) => u.content === finalContent)
      ).toBe(true);
    });
  });
});

/**
 * Setup script for integration tests
 *
 * Run this before integration tests to create necessary test data
 */
export async function setupIntegrationTests() {
  console.log('Setting up integration test environment...');

  // 1. Create test article
  // 2. Generate initial content
  // 3. Export IDs for use in tests

  console.log('Setup complete. Test IDs:');
  console.log('TEST_ARTICLE_ID:', testArticleId);
  console.log('TEST_GENERATION_ID:', testGenerationId);
}

/**
 * Cleanup script for integration tests
 *
 * Run this after integration tests to remove test data
 */
export async function cleanupIntegrationTests() {
  console.log('Cleaning up integration test data...');

  // 1. Delete test generations
  // 2. Delete test article
  // 3. Clean up any other test artifacts

  console.log('Cleanup complete.');
}
