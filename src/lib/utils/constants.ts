/**
 * Configuration constants for API endpoints
 * Extracted from magic numbers across the codebase for better maintainability
 */

// Analytics Event Processing
export const ANALYTICS_CONFIG = {
  MAX_EVENTS_PER_BATCH: 100,
  MAX_EVENTS_PER_GET_REQUEST: 1000,
  DEFAULT_EVENTS_LIMIT: 100,
  DEFAULT_SESSIONS_LIMIT: 50,
  
  // Session timeout and retry settings
  SESSION_VALIDATION_RETRY_COUNT: 1,
  RACE_CONDITION_DELAY_MS: 100,
  
  // Time windows for analytics queries
  ANALYTICS_WINDOW_24H_MS: 24 * 60 * 60 * 1000,
  ANALYTICS_WINDOW_7D_MS: 7 * 24 * 60 * 60 * 1000,
  
  // Top results limits
  TOP_PAGES_LIMIT: 10,
  TOP_EVENTS_LIMIT: 20,
  TOP_COUNTRIES_LIMIT: 10,
} as const

// Geolocation API Configuration
export const GEOLOCATION_CONFIG = {
  TIMEOUT_MS: 3000,
  MAX_RETRIES: 1,
  
  // Excluded IPs that shouldn't be geolocated
  EXCLUDED_IPS: ['127.0.0.1', 'localhost', '::1'] as const,
} as const

// Database Query Limits
export const DATABASE_CONFIG = {
  DEFAULT_PAGINATION_LIMIT: 50,
  MAX_PAGINATION_LIMIT: 1000,
  DEFAULT_PAGINATION_OFFSET: 0,
  
  // Batch processing limits
  MAX_PARALLEL_QUERIES: 10,
  QUERY_TIMEOUT_MS: 30000,
} as const

// Content Validation
export const CONTENT_CONFIG = {
  // Like system limits
  LIKE_BATCH_SIZE: 100,
  
  // Content type validation
  VALID_CONTENT_TYPES: [
    'ARTICLE',
    'KEY_INSIGHTS', 
    'VIDEO_SCRIPT',
    'EMAIL_TEMPLATE',
    'SOCIAL_CONTENT'
  ] as const,
  
  // String length limits
  MAX_CONTENT_TITLE_LENGTH: 255,
  MAX_EVENT_LABEL_LENGTH: 100,
  MAX_PAGE_PATH_LENGTH: 500,
} as const

// Performance and Resource Management
export const PERFORMANCE_CONFIG = {
  // Memory cleanup intervals
  RATE_LIMIT_CLEANUP_INTERVAL_MS: 5 * 60 * 1000, // 5 minutes
  
  // Request size limits (in bytes)
  MAX_REQUEST_BODY_SIZE: 1024 * 1024, // 1MB
  MAX_JSON_PAYLOAD_SIZE: 512 * 1024, // 512KB
  
  // Concurrent processing limits
  MAX_CONCURRENT_EVENTS: 50,
  MAX_CONCURRENT_SESSIONS: 25,
} as const

// Error Handling and Retry Logic
export const ERROR_CONFIG = {
  // Retry configuration
  DEFAULT_RETRY_COUNT: 3,
  RETRY_DELAY_BASE_MS: 1000,
  RETRY_DELAY_MAX_MS: 10000,
  
  // Circuit breaker thresholds
  CIRCUIT_BREAKER_FAILURE_THRESHOLD: 5,
  CIRCUIT_BREAKER_TIMEOUT_MS: 60000,
  
  // External service timeouts
  EXTERNAL_API_TIMEOUT_MS: 5000,
} as const

// User Agent Detection Patterns
export const USER_AGENT_CONFIG = {
  MOBILE_PATTERNS: ['mobile', 'android', 'iphone', 'ipod'] as const,
  TABLET_PATTERNS: ['ipad', 'tablet'] as const,
  DESKTOP_PATTERNS: ['windows', 'mac', 'linux'] as const,
} as const

// HTTP Response Configuration
export const HTTP_CONFIG = {
  // Standard response sizes
  DEFAULT_SUCCESS_STATUS: 200,
  DEFAULT_ERROR_STATUS: 500,
  
  // Cache headers
  CACHE_CONTROL_PUBLIC_MAX_AGE: 3600, // 1 hour
  CACHE_CONTROL_PRIVATE_MAX_AGE: 300, // 5 minutes
  
  // CORS configuration
  CORS_MAX_AGE: 86400, // 24 hours
  CORS_ALLOWED_METHODS: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'] as const,
} as const