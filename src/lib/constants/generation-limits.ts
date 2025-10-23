/**
 * AI Generation Limits Configuration
 *
 * Centralized constants for generation limits across tiers
 */

export const GENERATION_LIMITS = {
  FREE_TIER: 3,
  PAID_TIER: 25,
} as const;

export type GenerationLimits = typeof GENERATION_LIMITS;
