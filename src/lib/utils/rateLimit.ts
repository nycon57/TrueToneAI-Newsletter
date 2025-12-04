import { NextRequest } from 'next/server'

// Rate limiting configuration
export interface RateLimitConfig {
  limit: number
  windowMs: number
  identifier?: string
}

// Rate limit entry with LRU tracking
interface RateLimitEntry {
  count: number
  resetTime: number
  lastAccessed: number
}

// Default configurations for different endpoints
export const RATE_LIMIT_CONFIGS = {
  DEFAULT: { limit: 100, windowMs: 60000 }, // 100 requests per minute
  LIKES: { limit: 10, windowMs: 60000 }, // 10 requests per minute
  SESSIONS: { limit: 100, windowMs: 60000 }, // 100 requests per minute
  SESSION_UPDATES: { limit: 200, windowMs: 60000 }, // 200 requests per minute
  SESSION_GET: { limit: 50, windowMs: 60000 }, // 50 requests per minute
  EVENTS: { limit: 500, windowMs: 60000 }, // 500 requests per minute
  EVENTS_GET: { limit: 100, windowMs: 60000 }, // 100 requests per minute
  // AI endpoint rate limits - more restrictive to prevent abuse
  AI_PERSONALIZE: { limit: 20, windowMs: 60000 }, // 20 requests per minute
  AI_SOCIAL_GENERATE: { limit: 15, windowMs: 60000 }, // 15 requests per minute
  AI_CHAT: { limit: 30, windowMs: 60000 }, // 30 requests per minute
  AI_VOICE_ANALYZE: { limit: 5, windowMs: 60000 }, // 5 requests per minute (expensive operation)
  AI_SAVE_GENERATION: { limit: 30, windowMs: 60000 }, // 30 requests per minute
} as const

// Memory-based rate limiting with LRU eviction (in production, use Redis)
const MAX_RATE_LIMIT_ENTRIES = 10000
const rateLimitMap = new Map<string, RateLimitEntry>()

// Performance metrics for monitoring
let rateLimitMetrics = {
  totalRequests: 0,
  allowedRequests: 0,
  deniedRequests: 0,
  cacheEvictions: 0,
  memoryUsage: 0
}

/**
 * Add entry to rate limit map with LRU eviction
 */
function addRateLimitEntry(identifier: string, entry: RateLimitEntry): void {
  // If at capacity, evict least recently used entry
  if (rateLimitMap.size >= MAX_RATE_LIMIT_ENTRIES) {
    let oldestKey = ''
    let oldestTime = Date.now()
    
    // Find least recently used entry
    for (const [key, data] of rateLimitMap.entries()) {
      if (data.lastAccessed < oldestTime) {
        oldestTime = data.lastAccessed
        oldestKey = key
      }
    }
    
    if (oldestKey) {
      rateLimitMap.delete(oldestKey)
      rateLimitMetrics.cacheEvictions++
    }
  }
  
  rateLimitMap.set(identifier, entry)
  rateLimitMetrics.memoryUsage = rateLimitMap.size
}

/**
 * Check if a request should be rate limited with optimized memory management
 * @param identifier - Unique identifier for the client (IP, user ID, etc.)
 * @param config - Rate limiting configuration
 * @returns true if request is allowed, false if rate limited
 */
export function checkRateLimit(
  identifier: string, 
  config: RateLimitConfig = RATE_LIMIT_CONFIGS.DEFAULT
): boolean {
  const now = Date.now()
  rateLimitMetrics.totalRequests++
  
  const rateLimitData = rateLimitMap.get(identifier)
  
  // Initialize or reset if window has expired
  if (!rateLimitData || now > rateLimitData.resetTime) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + config.windowMs,
      lastAccessed: now
    }
    
    addRateLimitEntry(identifier, newEntry)
    rateLimitMetrics.allowedRequests++
    return true
  }
  
  // Update last accessed time for LRU
  rateLimitData.lastAccessed = now
  
  // Check if limit exceeded
  if (rateLimitData.count >= config.limit) {
    rateLimitMetrics.deniedRequests++
    return false
  }
  
  // Increment and allow
  rateLimitData.count++
  rateLimitMetrics.allowedRequests++
  return true
}

/**
 * Extract client identifier from request with enhanced parsing
 * @param request - Next.js request object
 * @param prefix - Optional prefix for the identifier
 * @returns Client identifier string
 */
export function getClientIdentifier(request: NextRequest, prefix = ''): string {
  // Get IP from various headers (in order of preference)
  const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                  request.headers.get('x-real-ip') ||
                  request.headers.get('cf-connecting-ip') || // Cloudflare
                  request.headers.get('x-client-ip') ||
                  'unknown'
  
  // Create identifier with prefix if provided
  const identifier = prefix ? `${prefix}:${clientIp}` : clientIp
  
  // Ensure identifier length is reasonable to prevent memory issues
  return identifier.length > 255 ? identifier.substring(0, 255) : identifier
}

/**
 * Get rate limit headers for response with LRU tracking
 * @param identifier - Client identifier
 * @param config - Rate limiting configuration
 * @returns Headers object with rate limit info
 */
export function getRateLimitHeaders(
  identifier: string,
  config: RateLimitConfig = RATE_LIMIT_CONFIGS.DEFAULT
): Record<string, string> {
  const rateLimitData = rateLimitMap.get(identifier)
  const now = Date.now()
  
  if (!rateLimitData || now > rateLimitData.resetTime) {
    return {
      'X-RateLimit-Limit': config.limit.toString(),
      'X-RateLimit-Remaining': (config.limit - 1).toString(),
      'X-RateLimit-Reset': new Date(now + config.windowMs).toISOString()
    }
  }
  
  // Update last accessed for LRU
  rateLimitData.lastAccessed = now
  
  const remaining = Math.max(0, config.limit - rateLimitData.count)
  
  return {
    'X-RateLimit-Limit': config.limit.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': new Date(rateLimitData.resetTime).toISOString()
  }
}

/**
 * Clean up expired rate limit entries with enhanced monitoring
 */
export function cleanupRateLimitMap(): void {
  const now = Date.now()
  const initialSize = rateLimitMap.size
  let cleanedCount = 0
  
  // Remove expired entries
  for (const [key, data] of rateLimitMap.entries()) {
    if (now > data.resetTime) {
      rateLimitMap.delete(key)
      cleanedCount++
    }
  }
  
  // Update metrics
  rateLimitMetrics.memoryUsage = rateLimitMap.size
  
  if (cleanedCount > 0) {
    console.log(`🧹 Rate limit cleanup: removed ${cleanedCount} expired entries (${initialSize} → ${rateLimitMap.size})`)
  }
}

/**
 * Get rate limiting performance metrics
 */
export function getRateLimitMetrics() {
  return {
    ...rateLimitMetrics,
    currentCacheSize: rateLimitMap.size,
    maxCacheSize: MAX_RATE_LIMIT_ENTRIES,
    cacheUtilization: (rateLimitMap.size / MAX_RATE_LIMIT_ENTRIES) * 100,
    allowedRate: rateLimitMetrics.totalRequests > 0 
      ? (rateLimitMetrics.allowedRequests / rateLimitMetrics.totalRequests) * 100 
      : 0
  }
}

/**
 * Reset rate limiting metrics (useful for testing)
 */
export function resetRateLimitMetrics(): void {
  rateLimitMetrics = {
    totalRequests: 0,
    allowedRequests: 0,
    deniedRequests: 0,
    cacheEvictions: 0,
    memoryUsage: 0
  }
}

/**
 * Force cleanup of rate limit cache (useful for testing or maintenance)
 */
export function clearRateLimitCache(): void {
  const size = rateLimitMap.size
  rateLimitMap.clear()
  rateLimitMetrics.memoryUsage = 0
  console.log(`🧹 Rate limit cache cleared: removed ${size} entries`)
}

// Enhanced auto-cleanup with monitoring
if (typeof setInterval !== 'undefined') {
  // Clean up expired entries every 2 minutes (more frequent)
  setInterval(cleanupRateLimitMap, 2 * 60 * 1000)
  
  // Log metrics every 10 minutes in development
  if (process.env.NODE_ENV === 'development') {
    setInterval(() => {
      const metrics = getRateLimitMetrics()
      if (metrics.totalRequests > 0) {
        console.log('📊 Rate limit metrics:', metrics)
      }
    }, 10 * 60 * 1000)
  }
}