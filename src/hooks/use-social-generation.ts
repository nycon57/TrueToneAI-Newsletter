/**
 * React Hook for Platform-Specific Social Media Generation
 *
 * Consumes /api/ai/social-generate endpoint with Server-Sent Events (SSE)
 * Handles streaming, error recovery, and state management
 */

import { useState, useCallback, useRef } from 'react';
import type { SocialPlatform } from '@/types/social-media';
import type {
  PlatformSpecificGenerationRequest,
  PlatformGenerationStreamEvent
} from '@/types/social-generation';
import { toast } from 'sonner';

export interface UseSocialGenerationOptions {
  onPlatformStart?: (platform: SocialPlatform) => void;
  onPlatformComplete?: (platform: SocialPlatform, content: string) => void;
  onPlatformError?: (platform: SocialPlatform, error: string) => void;
  onAllComplete?: (results: Partial<Record<SocialPlatform, string>>) => void;
  onUsageUpdate?: (generationsUsed: number, generationsRemaining: number) => void;
  onError?: (error: string) => void;
}

export interface UseSocialGenerationState {
  isGenerating: boolean;
  streamingPlatforms: Set<SocialPlatform>; // Platforms currently streaming
  completedPlatforms: Set<SocialPlatform>; // Platforms that finished
  results: Partial<Record<SocialPlatform, string>>; // Final results
  streamingContent: Partial<Record<SocialPlatform, string>>; // Real-time streaming content
  errors: Partial<Record<SocialPlatform, string>>; // Per-platform errors
  generationsUsed: number;
  generationsRemaining: number | null;
}

export function useSocialGeneration(options: UseSocialGenerationOptions = {}) {
  const [state, setState] = useState<UseSocialGenerationState>({
    isGenerating: false,
    streamingPlatforms: new Set(),
    completedPlatforms: new Set(),
    results: {},
    streamingContent: {},
    errors: {},
    generationsUsed: 0,
    generationsRemaining: null
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const eventSourceRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);

  /**
   * Parse SSE data chunk
   */
  const parseSSEChunk = (chunk: string): PlatformGenerationStreamEvent | null => {
    try {
      // SSE format: "data: {json}\n\n"
      const lines = chunk.split('\n').filter(line => line.trim());
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const jsonStr = line.substring(6); // Remove "data: " prefix
          return JSON.parse(jsonStr);
        }
      }
      return null;
    } catch (error) {
      console.error('[useSocialGeneration] Failed to parse SSE chunk:', error);
      return null;
    }
  };

  /**
   * Handle SSE event
   */
  const handleEvent = useCallback((event: PlatformGenerationStreamEvent) => {
    switch (event.type) {
      case 'platform_start':
        if (event.platform) {
          setState(prev => ({
            ...prev,
            streamingPlatforms: new Set([...prev.streamingPlatforms, event.platform!]),
            streamingContent: {
              ...prev.streamingContent,
              [event.platform!]: ''
            }
          }));
          options.onPlatformStart?.(event.platform);
        }
        break;

      case 'platform_chunk':
        if (event.platform && event.chunk) {
          setState(prev => ({
            ...prev,
            streamingContent: {
              ...prev.streamingContent,
              [event.platform!]: (prev.streamingContent[event.platform!] || '') + event.chunk
            }
          }));
        }
        break;

      case 'platform_complete':
        if (event.platform && event.content) {
          setState(prev => {
            const newStreamingPlatforms = new Set(prev.streamingPlatforms);
            newStreamingPlatforms.delete(event.platform!);

            return {
              ...prev,
              streamingPlatforms: newStreamingPlatforms,
              completedPlatforms: new Set([...prev.completedPlatforms, event.platform!]),
              results: {
                ...prev.results,
                [event.platform!]: event.content
              },
              streamingContent: {
                ...prev.streamingContent,
                [event.platform!]: event.content
              }
            };
          });
          options.onPlatformComplete?.(event.platform, event.content);
        }
        break;

      case 'all_complete':
        setState(prev => ({
          ...prev,
          isGenerating: false,
          generationsUsed: event.generationsUsed || prev.generationsUsed,
          generationsRemaining: event.generationsRemaining ?? prev.generationsRemaining
        }));

        if (event.generationsUsed && event.generationsRemaining !== undefined) {
          options.onUsageUpdate?.(event.generationsUsed, event.generationsRemaining);
        }

        // Call onAllComplete with final results - defer to avoid setState during render
        setState(prev => {
          // Use queueMicrotask to defer callback execution
          queueMicrotask(() => {
            options.onAllComplete?.(prev.results);
          });
          return prev;
        });
        break;

      case 'error':
        if (event.platform) {
          // Platform-specific error
          setState(prev => {
            const newStreamingPlatforms = new Set(prev.streamingPlatforms);
            newStreamingPlatforms.delete(event.platform!);

            return {
              ...prev,
              streamingPlatforms: newStreamingPlatforms,
              errors: {
                ...prev.errors,
                [event.platform!]: event.error || 'Unknown error'
              }
            };
          });
          options.onPlatformError?.(event.platform, event.error || 'Unknown error');
          toast.error(`Failed to generate ${event.platform}: ${event.error}`);
        } else {
          // Global error
          setState(prev => ({
            ...prev,
            isGenerating: false
          }));
          options.onError?.(event.error || 'Unknown error');
          toast.error(event.error || 'Generation failed');
        }
        break;

      case 'usage_update':
        if (event.generationsRemaining !== undefined) {
          setState(prev => ({
            ...prev,
            generationsRemaining: event.generationsRemaining!
          }));
        }
        break;
    }
  }, [options]);

  /**
   * Generate content for selected platforms
   */
  const generate = useCallback(async (request: PlatformSpecificGenerationRequest) => {
    // Reset state - but preserve results for platforms not being regenerated
    setState(prev => {
      // If regenerating, keep results for other platforms
      const preservedResults = request.regenerate
        ? Object.fromEntries(
            Object.entries(prev.results).filter(([platform]) =>
              !request.platforms.includes(platform as SocialPlatform)
            )
          )
        : {};

      return {
        isGenerating: true,
        streamingPlatforms: new Set(),
        completedPlatforms: new Set(),
        results: preservedResults,
        streamingContent: {},
        errors: {},
        generationsUsed: 0,
        generationsRemaining: null
      };
    });

    // Create abort controller for cancellation
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/ai/social-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('Response body is empty');
      }

      // Read SSE stream
      const reader = response.body.getReader();
      eventSourceRef.current = reader;
      const decoder = new TextDecoder();

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          console.log('[useSocialGeneration] Stream complete');
          break;
        }

        // Decode chunk and add to buffer
        buffer += decoder.decode(value, { stream: true });

        // Process complete SSE messages (separated by \n\n)
        const messages = buffer.split('\n\n');
        buffer = messages.pop() || ''; // Keep incomplete message in buffer

        for (const message of messages) {
          if (message.trim()) {
            const event = parseSSEChunk(message);
            if (event) {
              handleEvent(event);
            }
          }
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('[useSocialGeneration] Generation cancelled');
        toast.info('Generation cancelled');
      } else {
        console.error('[useSocialGeneration] Generation error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to generate content';
        options.onError?.(errorMessage);
        toast.error(errorMessage);
      }

      setState(prev => ({
        ...prev,
        isGenerating: false
      }));
    } finally {
      abortControllerRef.current = null;
      eventSourceRef.current = null;
    }
  }, [handleEvent, options]);

  /**
   * Cancel ongoing generation
   */
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.cancel();
      eventSourceRef.current = null;
    }

    setState(prev => ({
      ...prev,
      isGenerating: false,
      streamingPlatforms: new Set()
    }));
  }, []);

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    cancel();
    setState({
      isGenerating: false,
      streamingPlatforms: new Set(),
      completedPlatforms: new Set(),
      results: {},
      streamingContent: {},
      errors: {},
      generationsUsed: 0,
      generationsRemaining: null
    });
  }, [cancel]);

  return {
    ...state,
    generate,
    cancel,
    reset
  };
}
