/**
 * Analytics Types and Interfaces
 * Type definitions for the comprehensive analytics tracking system
 */

import type { Device } from '@/generated/prisma'

// Base event interface that all analytics events must implement
export interface BaseAnalyticsEvent {
  type: AnalyticsEventType
  action: string
  category: string
  label?: string
  value?: number
  metadata?: Record<string, any>
}

// All supported event types in the analytics system
export type AnalyticsEventType = 
  | 'click'
  | 'view' 
  | 'scroll'
  | 'form'
  | 'ai_chat'
  | 'like'
  | 'copy'
  | 'navigation'
  | 'performance'
  | 'error'

// Session tracking interface for user journey analytics
export interface AnalyticsSession {
  sessionId: string
  userId?: string
  startedAt: Date
  lastActiveAt: Date
  deviceType: Device
  userAgent?: string
  ipAddress?: string
  location?: {
    countryCode?: string
    region?: string
    city?: string
  }
}

// Page view tracking with engagement metrics
export interface PageViewEvent extends BaseAnalyticsEvent {
  type: 'view'
  action: 'page_view'
  pagePath: string
  pageTitle?: string
  referrer?: string
  timeOnPage?: number
  scrollDepth?: number
  exitPage?: boolean
  bounce?: boolean
}

// Click tracking for all interactive elements
export interface ClickEvent extends BaseAnalyticsEvent {
  type: 'click'
  action: 'button_click' | 'link_click' | 'element_click'
  elementId?: string
  elementType: string
  elementText?: string
  position?: {
    x: number
    y: number
  }
}

// Like/engagement tracking (enhanced from existing system)
export interface LikeEvent extends BaseAnalyticsEvent {
  type: 'like'
  action: 'like_toggle'
  category: 'engagement'
  contentId: string
  contentType: string
  contentTitle: string
  liked: boolean
  likeCount: number
}

// Copy/share tracking for marketing content
export interface CopyEvent extends BaseAnalyticsEvent {
  type: 'copy'
  action: 'copy_content'
  category: 'content_interaction'
  contentId: string
  contentType: 'email_template' | 'video_script' | 'social_content' | 'article'
  contentLength?: number
}

// AI chat usage analytics
export interface AIChatEvent extends BaseAnalyticsEvent {
  type: 'ai_chat'
  action: 'message_sent' | 'conversation_started' | 'conversation_ended'
  category: 'ai_interaction'
  conversationId: string
  messageCount?: number
  sessionDuration?: number
  selectedArticle?: string
  selectedContentType?: string
  tokensUsed?: number
  responseTime?: number
  errorOccurred?: boolean
}

// Form interaction tracking
export interface FormEvent extends BaseAnalyticsEvent {
  type: 'form'
  action: 'form_submit' | 'form_start' | 'form_error' | 'field_focus'
  formId?: string
  fieldName?: string
  formProgress?: number
  errors?: string[]
}

// Navigation tracking for user journey analysis
export interface NavigationEvent extends BaseAnalyticsEvent {
  type: 'navigation'
  action: 'route_change' | 'back_button' | 'external_link'
  fromPath?: string
  toPath: string
  navigationMethod: 'pushState' | 'replaceState' | 'popState' | 'reload'
}

// Performance monitoring events
export interface PerformanceEvent extends BaseAnalyticsEvent {
  type: 'performance'
  action: 'page_load' | 'api_call' | 'resource_load'
  duration: number
  resource?: string
  success: boolean
  errorMessage?: string
}

// Error tracking events
export interface ErrorEvent extends BaseAnalyticsEvent {
  type: 'error'
  action: 'javascript_error' | 'api_error' | 'network_error'
  errorMessage: string
  errorStack?: string
  component?: string
  severity: 'low' | 'medium' | 'high' | 'critical'
}

// Union type of all possible analytics events
export type AnalyticsEvent = 
  | PageViewEvent
  | ClickEvent
  | LikeEvent
  | CopyEvent
  | AIChatEvent
  | FormEvent
  | NavigationEvent
  | PerformanceEvent
  | ErrorEvent

// Configuration for analytics service
export interface AnalyticsConfig {
  // Event batching configuration
  batchSize: number
  flushInterval: number // milliseconds
  
  // Feature flags
  enablePageViews: boolean
  enableClickTracking: boolean
  enablePerformanceTracking: boolean
  enableErrorTracking: boolean
  enableAIChatTracking: boolean
  
  // Third-party integrations
  clarity?: {
    enabled: boolean
    projectId?: string
  }
  sentry?: {
    enabled: boolean
    dsn?: string
  }
  
  // Geolocation settings
  enableGeolocation: boolean
  geolocationProvider?: 'ipapi' | 'ipinfo' | 'maxmind'
  
  // Performance settings
  sampleRate: number // 0-1, percentage of events to track
  maxEventsPerSession: number
  sessionTimeout: number // milliseconds
}

// Event queue item for batching
export interface QueuedEvent {
  event: AnalyticsEvent
  sessionId: string
  userId?: string
  timestamp: Date
  retryCount: number
}

// Analytics context for React components
export interface AnalyticsContext {
  sessionId: string
  userId?: string
  deviceType: Device
  isTrackingEnabled: boolean
  trackEvent: (event: AnalyticsEvent) => void
  trackPageView: (pagePath: string, pageTitle?: string) => void
  trackClick: (elementType: string, elementId?: string, metadata?: Record<string, any>) => void
  trackLike: (contentId: string, contentType: string, liked: boolean, likeCount: number) => void
  trackCopy: (contentType: string, contentId: string, contentLength?: number) => void
  trackAIChat: (action: string, conversationId: string, metadata?: Record<string, any>) => void
}

// Database models (matching Prisma schema)
export interface DBUserSession {
  id: string
  userId?: string
  sessionId: string
  ipAddress?: string
  userAgent?: string
  deviceType: Device
  countryCode?: string
  region?: string
  city?: string
  startedAt: Date
  lastActiveAt: Date
  endedAt?: Date
  pageViews: number
  eventsCount: number
}

export interface DBAnalyticsEvent {
  id: string
  sessionId: string
  userId?: string
  eventType: string
  eventAction: string
  eventCategory?: string
  eventLabel?: string
  eventValue?: number
  pagePath?: string
  elementId?: string
  elementType?: string
  metadata?: any
  timestamp: Date
}

export interface DBPageView {
  id: string
  sessionId: string
  userId?: string
  pagePath: string
  pageTitle?: string
  referrer?: string
  timeOnPage?: number
  scrollDepth?: number
  exitPage: boolean
  bounce: boolean
  timestamp: Date
}

export interface DBChatAnalytics {
  id: string
  sessionId: string
  userId?: string
  conversationId: string
  messageCount: number
  sessionDuration?: number
  selectedArticle?: string
  selectedContentType?: string
  tokensUsed?: number
  errorCount: number
  startedAt: Date
  endedAt?: Date
}

// Analytics reporting interfaces for dashboards
export interface AnalyticsReport {
  period: {
    start: Date
    end: Date
  }
  metrics: {
    totalUsers: number
    totalSessions: number
    totalPageViews: number
    totalEvents: number
    averageSessionDuration: number
    bounceRate: number
    topPages: Array<{ path: string; views: number }>
    topEvents: Array<{ type: string; action: string; count: number }>
    deviceBreakdown: Record<Device, number>
    geographicBreakdown: Record<string, number>
  }
}

export interface ContentEngagementReport {
  period: {
    start: Date
    end: Date
  }
  engagement: {
    totalLikes: number
    totalCopies: number
    topContent: Array<{
      contentId: string
      contentType: string
      contentTitle: string
      likes: number
      copies: number
      engagementRate: number
    }>
    contentTypeBreakdown: Record<string, {
      likes: number
      copies: number
      views: number
    }>
  }
}

export interface AIChatReport {
  period: {
    start: Date
    end: Date
  }
  usage: {
    totalConversations: number
    totalMessages: number
    averageConversationLength: number
    averageSessionDuration: number
    tokensUsed: number
    errorRate: number
    topArticles: Array<{
      article: string
      conversationCount: number
      averageDuration: number
    }>
    contentTypeUsage: Record<string, number>
  }
}