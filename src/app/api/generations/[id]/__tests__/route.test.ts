/**
 * Tests for PATCH /api/generations/[id]
 *
 * These tests verify:
 * - Authentication and authorization
 * - Content type validation
 * - Character limit enforcement for social media
 * - Proper error handling
 * - Successful updates
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { NextRequest } from 'next/server';
import { PATCH } from '../route';

// Mock dependencies
jest.mock('@/lib/api/auth-cached');
jest.mock('@/lib/supabase/server');

const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  subscription_tier: 'PAID'
};

const mockGeneration = {
  id: 'gen-123',
  user_id: 'user-123',
  article_id: 'article-123',
  content_type: 'VIDEO_SCRIPT',
  content: 'Original video script content',
  content_array: [],
  platform: null,
  generated_at: new Date().toISOString()
};

describe('PATCH /api/generations/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Authentication', () => {
    it('should return 401 when user is not authenticated', async () => {
      const { getCachedApiUserSafe } = await import('@/lib/api/auth-cached');
      (getCachedApiUserSafe as jest.Mock).mockResolvedValue(null);

      const req = new NextRequest('http://localhost/api/generations/gen-123', {
        method: 'PATCH',
        body: JSON.stringify({ content: 'Updated content' })
      });

      const context = { params: Promise.resolve({ id: 'gen-123' }) };
      const response = await PATCH(req, context);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Authentication required');
    });
  });

  describe('Authorization', () => {
    it('should return 403 when generation belongs to another user', async () => {
      const { getCachedApiUserSafe } = await import('@/lib/api/auth-cached');
      const { createClient } = await import('@/lib/supabase/server');

      (getCachedApiUserSafe as jest.Mock).mockResolvedValue(mockUser);

      const mockSupabase = {
        from: jest.fn(() => ({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              single: jest.fn().mockResolvedValue({
                data: { ...mockGeneration, user_id: 'different-user-456' },
                error: null
              })
            }))
          }))
        }))
      };

      (createClient as jest.Mock).mockResolvedValue(mockSupabase);

      const req = new NextRequest('http://localhost/api/generations/gen-123', {
        method: 'PATCH',
        body: JSON.stringify({ content: 'Updated content' })
      });

      const context = { params: Promise.resolve({ id: 'gen-123' }) };
      const response = await PATCH(req, context);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe('Not authorized to update this generation');
    });
  });

  describe('Validation', () => {
    it('should return 400 when neither content nor content_array is provided', async () => {
      const { getCachedApiUserSafe } = await import('@/lib/api/auth-cached');
      (getCachedApiUserSafe as jest.Mock).mockResolvedValue(mockUser);

      const req = new NextRequest('http://localhost/api/generations/gen-123', {
        method: 'PATCH',
        body: JSON.stringify({})
      });

      const context = { params: Promise.resolve({ id: 'gen-123' }) };
      const response = await PATCH(req, context);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Either content or content_array must be provided');
    });

    it('should return 400 when content is empty string', async () => {
      const { getCachedApiUserSafe } = await import('@/lib/api/auth-cached');
      const { createClient } = await import('@/lib/supabase/server');

      (getCachedApiUserSafe as jest.Mock).mockResolvedValue(mockUser);

      const mockSupabase = {
        from: jest.fn(() => ({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              single: jest.fn().mockResolvedValue({
                data: mockGeneration,
                error: null
              })
            }))
          }))
        }))
      };

      (createClient as jest.Mock).mockResolvedValue(mockSupabase);

      const req = new NextRequest('http://localhost/api/generations/gen-123', {
        method: 'PATCH',
        body: JSON.stringify({ content: '   ' })
      });

      const context = { params: Promise.resolve({ id: 'gen-123' }) };
      const response = await PATCH(req, context);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('content cannot be empty');
    });

    it('should return 400 when content_array is empty for KEY_INSIGHTS', async () => {
      const { getCachedApiUserSafe } = await import('@/lib/api/auth-cached');
      const { createClient } = await import('@/lib/supabase/server');

      (getCachedApiUserSafe as jest.Mock).mockResolvedValue(mockUser);

      const mockSupabase = {
        from: jest.fn(() => ({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              single: jest.fn().mockResolvedValue({
                data: { ...mockGeneration, content_type: 'KEY_INSIGHTS' },
                error: null
              })
            }))
          }))
        }))
      };

      (createClient as jest.Mock).mockResolvedValue(mockSupabase);

      const req = new NextRequest('http://localhost/api/generations/gen-123', {
        method: 'PATCH',
        body: JSON.stringify({ content_array: [] })
      });

      const context = { params: Promise.resolve({ id: 'gen-123' }) };
      const response = await PATCH(req, context);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('content_array cannot be empty');
    });

    it('should return 400 when content_array contains empty strings', async () => {
      const { getCachedApiUserSafe } = await import('@/lib/api/auth-cached');
      const { createClient } = await import('@/lib/supabase/server');

      (getCachedApiUserSafe as jest.Mock).mockResolvedValue(mockUser);

      const mockSupabase = {
        from: jest.fn(() => ({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              single: jest.fn().mockResolvedValue({
                data: { ...mockGeneration, content_type: 'KEY_INSIGHTS' },
                error: null
              })
            }))
          }))
        }))
      };

      (createClient as jest.Mock).mockResolvedValue(mockSupabase);

      const req = new NextRequest('http://localhost/api/generations/gen-123', {
        method: 'PATCH',
        body: JSON.stringify({ content_array: ['Valid insight', '   ', 'Another insight'] })
      });

      const context = { params: Promise.resolve({ id: 'gen-123' }) };
      const response = await PATCH(req, context);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('All insights must be non-empty strings');
    });
  });

  describe('Social Media Character Limits', () => {
    it('should return 400 when Twitter content exceeds 280 characters', async () => {
      const { getCachedApiUserSafe } = await import('@/lib/api/auth-cached');
      const { createClient } = await import('@/lib/supabase/server');

      (getCachedApiUserSafe as jest.Mock).mockResolvedValue(mockUser);

      const longContent = 'a'.repeat(281);
      const mockSupabase = {
        from: jest.fn(() => ({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              single: jest.fn().mockResolvedValue({
                data: { ...mockGeneration, content_type: 'SOCIAL_MEDIA', platform: 'TWITTER' },
                error: null
              })
            }))
          }))
        }))
      };

      (createClient as jest.Mock).mockResolvedValue(mockSupabase);

      const req = new NextRequest('http://localhost/api/generations/gen-123', {
        method: 'PATCH',
        body: JSON.stringify({ content: longContent })
      });

      const context = { params: Promise.resolve({ id: 'gen-123' }) };
      const response = await PATCH(req, context);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('twitter character limit');
      expect(data.current_length).toBe(281);
      expect(data.max_length).toBe(280);
    });

    it('should allow Instagram content up to 2200 characters', async () => {
      const { getCachedApiUserSafe } = await import('@/lib/api/auth-cached');
      const { createClient } = await import('@/lib/supabase/server');

      (getCachedApiUserSafe as jest.Mock).mockResolvedValue(mockUser);

      const validContent = 'a'.repeat(2200);
      const mockSupabase = {
        from: jest.fn(() => ({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              single: jest.fn().mockResolvedValue({
                data: { ...mockGeneration, content_type: 'SOCIAL_MEDIA', platform: 'INSTAGRAM' },
                error: null
              })
            }))
          })),
          update: jest.fn(() => ({
            eq: jest.fn(() => ({
              select: jest.fn(() => ({
                single: jest.fn().mockResolvedValue({
                  data: {
                    id: 'gen-123',
                    content: validContent,
                    content_array: [],
                    generated_at: new Date().toISOString()
                  },
                  error: null
                })
              }))
            }))
          }))
        }))
      };

      (createClient as jest.Mock).mockResolvedValue(mockSupabase);

      const req = new NextRequest('http://localhost/api/generations/gen-123', {
        method: 'PATCH',
        body: JSON.stringify({ content: validContent })
      });

      const context = { params: Promise.resolve({ id: 'gen-123' }) };
      const response = await PATCH(req, context);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });
  });

  describe('Successful Updates', () => {
    it('should successfully update VIDEO_SCRIPT content', async () => {
      const { getCachedApiUserSafe } = await import('@/lib/api/auth-cached');
      const { createClient } = await import('@/lib/supabase/server');

      (getCachedApiUserSafe as jest.Mock).mockResolvedValue(mockUser);

      const updatedContent = 'This is the updated video script content';
      const now = new Date().toISOString();

      const mockSupabase = {
        from: jest.fn(() => ({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              single: jest.fn().mockResolvedValue({
                data: mockGeneration,
                error: null
              })
            }))
          })),
          update: jest.fn(() => ({
            eq: jest.fn(() => ({
              select: jest.fn(() => ({
                single: jest.fn().mockResolvedValue({
                  data: {
                    id: 'gen-123',
                    content: updatedContent,
                    content_array: [],
                    generated_at: now
                  },
                  error: null
                })
              }))
            }))
          }))
        }))
      };

      (createClient as jest.Mock).mockResolvedValue(mockSupabase);

      const req = new NextRequest('http://localhost/api/generations/gen-123', {
        method: 'PATCH',
        body: JSON.stringify({ content: updatedContent })
      });

      const context = { params: Promise.resolve({ id: 'gen-123' }) };
      const response = await PATCH(req, context);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.generation.id).toBe('gen-123');
      expect(data.generation.content).toBe(updatedContent);
    });

    it('should successfully update KEY_INSIGHTS content_array', async () => {
      const { getCachedApiUserSafe } = await import('@/lib/api/auth-cached');
      const { createClient } = await import('@/lib/supabase/server');

      (getCachedApiUserSafe as jest.Mock).mockResolvedValue(mockUser);

      const updatedInsights = [
        'First key insight',
        'Second key insight',
        'Third key insight'
      ];
      const now = new Date().toISOString();

      const mockSupabase = {
        from: jest.fn(() => ({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              single: jest.fn().mockResolvedValue({
                data: { ...mockGeneration, content_type: 'KEY_INSIGHTS' },
                error: null
              })
            }))
          })),
          update: jest.fn(() => ({
            eq: jest.fn(() => ({
              select: jest.fn(() => ({
                single: jest.fn().mockResolvedValue({
                  data: {
                    id: 'gen-123',
                    content: null,
                    content_array: updatedInsights,
                    generated_at: now
                  },
                  error: null
                })
              }))
            }))
          }))
        }))
      };

      (createClient as jest.Mock).mockResolvedValue(mockSupabase);

      const req = new NextRequest('http://localhost/api/generations/gen-123', {
        method: 'PATCH',
        body: JSON.stringify({ content_array: updatedInsights })
      });

      const context = { params: Promise.resolve({ id: 'gen-123' }) };
      const response = await PATCH(req, context);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.generation.id).toBe('gen-123');
      expect(data.generation.content_array).toEqual(updatedInsights);
    });

    it('should trim whitespace from content', async () => {
      const { getCachedApiUserSafe } = await import('@/lib/api/auth-cached');
      const { createClient } = await import('@/lib/supabase/server');

      (getCachedApiUserSafe as jest.Mock).mockResolvedValue(mockUser);

      const contentWithWhitespace = '  \n  Updated content with whitespace  \n  ';
      const trimmedContent = 'Updated content with whitespace';
      const now = new Date().toISOString();

      const mockSupabase = {
        from: jest.fn(() => ({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              single: jest.fn().mockResolvedValue({
                data: mockGeneration,
                error: null
              })
            }))
          })),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          update: jest.fn((data: any) => {
            // Verify trimmed content was passed to update
            expect(data.content).toBe(trimmedContent);

            return {
              eq: jest.fn(() => ({
                select: jest.fn(() => ({
                  single: jest.fn().mockResolvedValue({
                    data: {
                      id: 'gen-123',
                      content: trimmedContent,
                      content_array: [],
                      generated_at: now
                    },
                    error: null
                  })
                }))
              }))
            };
          })
        }))
      };

      (createClient as jest.Mock).mockResolvedValue(mockSupabase);

      const req = new NextRequest('http://localhost/api/generations/gen-123', {
        method: 'PATCH',
        body: JSON.stringify({ content: contentWithWhitespace })
      });

      const context = { params: Promise.resolve({ id: 'gen-123' }) };
      const response = await PATCH(req, context);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.generation.content).toBe(trimmedContent);
    });
  });

  describe('Error Handling', () => {
    it('should return 404 when generation does not exist', async () => {
      const { getCachedApiUserSafe } = await import('@/lib/api/auth-cached');
      const { createClient } = await import('@/lib/supabase/server');

      (getCachedApiUserSafe as jest.Mock).mockResolvedValue(mockUser);

      const mockSupabase = {
        from: jest.fn(() => ({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              single: jest.fn().mockResolvedValue({
                data: null,
                error: { message: 'Not found' }
              })
            }))
          }))
        }))
      };

      (createClient as jest.Mock).mockResolvedValue(mockSupabase);

      const req = new NextRequest('http://localhost/api/generations/non-existent', {
        method: 'PATCH',
        body: JSON.stringify({ content: 'Updated content' })
      });

      const context = { params: Promise.resolve({ id: 'non-existent' }) };
      const response = await PATCH(req, context);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Generation not found');
    });

    it('should return 500 when database update fails', async () => {
      const { getCachedApiUserSafe } = await import('@/lib/api/auth-cached');
      const { createClient } = await import('@/lib/supabase/server');

      (getCachedApiUserSafe as jest.Mock).mockResolvedValue(mockUser);

      const mockSupabase = {
        from: jest.fn(() => ({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              single: jest.fn().mockResolvedValue({
                data: mockGeneration,
                error: null
              })
            }))
          })),
          update: jest.fn(() => ({
            eq: jest.fn(() => ({
              select: jest.fn(() => ({
                single: jest.fn().mockResolvedValue({
                  data: null,
                  error: { message: 'Database error', code: 'DB_ERROR' }
                })
              }))
            }))
          }))
        }))
      };

      (createClient as jest.Mock).mockResolvedValue(mockSupabase);

      const req = new NextRequest('http://localhost/api/generations/gen-123', {
        method: 'PATCH',
        body: JSON.stringify({ content: 'Updated content' })
      });

      const context = { params: Promise.resolve({ id: 'gen-123' }) };
      const response = await PATCH(req, context);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to update generation');
    });
  });
});
