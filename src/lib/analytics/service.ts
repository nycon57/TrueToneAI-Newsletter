/**
 * Analytics Service
 * Core analytics tracking service with event batching, session management, and third-party integrations
 */

// Generate UUID v4 using crypto API
function uuidv4(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  
  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}
import type { Device } from '@/generated/prisma'
import type {
  AnalyticsEvent,
  AnalyticsConfig,
  AnalyticsSession,
  QueuedEvent,
  ClickEvent,
  PageViewEvent,
  LikeEvent,
  CopyEvent,
  AIChatEvent
} from './types'

// Default configuration for analytics service
const DEFAULT_CONFIG: AnalyticsConfig = {
  batchSize: 10,
  flushInterval: 5000, // 5 seconds
  enablePageViews: true,
  enableClickTracking: true,
  enablePerformanceTracking: true,
  enableErrorTracking: true,
  enableAIChatTracking: true,
  clarity: {
    enabled: true
  },
  sentry: {
    enabled: true
  },
  enableGeolocation: true,
  geolocationProvider: 'ipapi',
  sampleRate: 1.0,
  maxEventsPerSession: 1000,
  sessionTimeout: 30 * 60 * 1000 // 30 minutes
}

/**
 * Main Analytics Service Class
 * Handles event collection, batching, session management, and data persistence
 */
class AnalyticsService {
  private config: AnalyticsConfig
  private eventQueue: QueuedEvent[] = []
  private currentSession: AnalyticsSession | null = null
  private flushTimer: NodeJS.Timeout | null = null
  private sessionUpdateTimer: NodeJS.Timeout | null = null
  private isInitialized = false
  private initPromise: Promise<void> | null = null
  private deviceType: Device = 'UNKNOWN'
  private requestCache = new Map<string, { data: unknown; timestamp: number }>()
  private readonly CACHE_TTL = 30000 // 30 seconds
  private performanceMetrics = {
    initializationTime: 0,
    averageFlushTime: 0,
    eventProcessingTime: 0,
    memoryUsage: 0,
    networkRequests: 0
  }
  
  constructor(config?: Partial<AnalyticsConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    
    if (typeof window !== 'undefined') {
      // Non-blocking initialization using requestIdleCallback
      this.initializeAsync()
    }
  }

  /**
   * Non-blocking initialization using browser idle time
   */
  private initializeAsync(): void {
    const startTime = performance.now()
    
    const initStep = () => {
      if (this.isInitialized) return
      
      try {
        // Quick synchronous operations first
        this.deviceType = this.detectDeviceType()
        this.setupEventListeners()
        this.startFlushTimer()
        
        // Mark as ready for basic tracking
        this.isInitialized = true
        
        // Schedule async operations for next idle period
        if (typeof requestIdleCallback !== 'undefined') {
          requestIdleCallback(() => this.completeInitialization())
        } else {
          // Fallback for browsers without requestIdleCallback
          setTimeout(() => this.completeInitialization(), 0)
        }
        
        this.performanceMetrics.initializationTime = performance.now() - startTime
        
        console.log('📊 Analytics service initialized (fast path)', {
          initTime: this.performanceMetrics.initializationTime,
          deviceType: this.deviceType
        })
      } catch (error) {
        console.error('Failed to initialize analytics service:', error)
      }
    }
    
    // Use requestIdleCallback for optimal performance
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(initStep)
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(initStep, 0)
    }
  }

  /**
   * Complete initialization with async operations
   */
  private async completeInitialization(): Promise<void> {
    try {
      // Initialize or restore session (async)
      await this.initializeSession()
      
      // Initialize third-party integrations (async)
      await this.initializeIntegrations()
      
      console.log('📊 Analytics service fully initialized', {
        sessionId: this.currentSession?.sessionId
      })
    } catch (error) {
      console.error('Failed to complete analytics initialization:', error)
      // Don't prevent basic functionality from working
    }
  }

  /**
   * Public method to ensure full initialization when needed
   */
  public async ensureInitialized(): Promise<void> {
    if (this.initPromise) return this.initPromise
    
    if (!this.currentSession) {
      this.initPromise = this.completeInitialization()
      return this.initPromise
    }
  }

  /**
   * Detect device type from user agent string
   */
  private detectDeviceType(): Device {
    if (typeof window === 'undefined') return 'UNKNOWN'
    
    const userAgent = navigator.userAgent.toLowerCase()
    
    if (/mobile|android|iphone|ipod/.test(userAgent)) {
      return 'MOBILE'
    } else if (/ipad|tablet/.test(userAgent)) {
      return 'TABLET'
    } else if (/windows|mac|linux/.test(userAgent)) {
      return 'DESKTOP'
    }
    
    return 'UNKNOWN'
  }

  /**
   * Initialize or restore user session
   */
  private async initializeSession(): Promise<void> {
    console.log('📊 Initializing session...')
    
    const existingSessionId = sessionStorage.getItem('analytics_session_id')
    const sessionStartTime = sessionStorage.getItem('analytics_session_start')
    
    console.log('📊 Checking for existing session:', {
      existingSessionId,
      sessionStartTime
    })
    
    // Check if existing session is still valid
    if (existingSessionId && sessionStartTime) {
      const startTime = new Date(parseInt(sessionStartTime))
      const now = new Date()
      const sessionAge = now.getTime() - startTime.getTime()
      
      console.log('📊 Existing session age check:', {
        sessionAge,
        sessionTimeout: this.config.sessionTimeout,
        isValid: sessionAge < this.config.sessionTimeout
      })
      
      if (sessionAge < this.config.sessionTimeout) {
        // Restore existing session
        console.log('📊 Restoring existing session:', existingSessionId)
        this.currentSession = {
          sessionId: existingSessionId,
          startedAt: startTime,
          lastActiveAt: now,
          deviceType: this.deviceType,
          userAgent: navigator.userAgent,
          ipAddress: await this.getClientIP()
        }
        
        // Update last active time
        this.updateSessionActivity()
        return
      } else {
        console.log('📊 Existing session expired, creating new one')
      }
    } else {
      console.log('📊 No existing session found, creating new one')
    }
    
    // Create new session
    const sessionId = uuidv4()
    const now = new Date()
    
    console.log('📊 Creating new session:', sessionId)
    
    this.currentSession = {
      sessionId,
      startedAt: now,
      lastActiveAt: now,
      deviceType: this.deviceType,
      userAgent: navigator.userAgent,
      ipAddress: await this.getClientIP()
    }
    
    // Store session info in sessionStorage
    sessionStorage.setItem('analytics_session_id', sessionId)
    sessionStorage.setItem('analytics_session_start', now.getTime().toString())
    
    console.log('📊 Session stored in sessionStorage, now creating in database...')
    
    // Create session in database and wait for completion
    await this.createSession()
    
    // Add a small delay to ensure database consistency
    console.log('📊 Adding delay for database consistency...')
    await new Promise(resolve => setTimeout(resolve, 100))
    
    console.log('📊 Session initialization complete')
  }

  /**
   * Get client IP address for geolocation
   */
  private async getClientIP(): Promise<string | undefined> {
    if (!this.config.enableGeolocation) return undefined
    
    try {
      // Use a simple IP detection service
      const response = await fetch('https://api.ipify.org?format=json')
      const data = await response.json()
      return data.ip
    } catch (error) {
      console.warn('Failed to get client IP:', error)
      return undefined
    }
  }

  /**
   * Optimized HTTP request with caching and connection reuse
   */
  private async makeOptimizedRequest(url: string, options: RequestInit): Promise<unknown> {
    const cacheKey = `${url}-${JSON.stringify(options)}`
    const cached = this.requestCache.get(cacheKey)
    
    // Return cached response if valid
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data
    }
    
    this.performanceMetrics.networkRequests++
    
    try {
      const response = await fetch(url, {
        ...options,
        keepalive: true, // Enable connection reuse
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      // Cache successful responses
      if (response.status === 200) {
        this.requestCache.set(cacheKey, { data, timestamp: Date.now() })
        
        // Cleanup old cache entries to prevent memory leaks
        if (this.requestCache.size > 100) {
          const oldestKey = this.requestCache.keys().next().value
          this.requestCache.delete(oldestKey)
        }
      }
      
      return data
    } catch (error) {
      console.error('Optimized request failed:', { url, error })
      throw error
    }
  }

  /**
   * Create session in database with optimized requests
   */
  private async createSession(): Promise<void> {
    if (!this.currentSession) {
      console.error('❌ Cannot create session - currentSession is null')
      return
    }
    
    const sessionData = {
      sessionId: this.currentSession.sessionId,
      userAgent: this.currentSession.userAgent,
      deviceType: this.currentSession.deviceType,
      ipAddress: this.currentSession.ipAddress,
      startedAt: this.currentSession.startedAt
    }
    
    console.log('📊 Creating session with data:', sessionData)
    
    try {
      const responseData = await this.makeOptimizedRequest('/api/analytics/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sessionData)
      })
      
      console.log('✅ Analytics session created successfully:', {
        sessionId: this.currentSession.sessionId,
        response: responseData
      })
    } catch (error) {
      console.error('❌ Failed to create session in database:', {
        error: error instanceof Error ? error.message : String(error),
        sessionId: this.currentSession.sessionId,
        sessionData
      })
      // Don't throw - allow analytics to continue with degraded functionality
    }
  }

  /**
   * Update session activity timestamp with proper timer management
   */
  private updateSessionActivity(): void {
    if (!this.currentSession) return
    
    this.currentSession.lastActiveAt = new Date()
    
    // Debounced session update to database with separate timer
    if (this.sessionUpdateTimer) {
      clearTimeout(this.sessionUpdateTimer)
    }
    
    this.sessionUpdateTimer = setTimeout(() => {
      this.updateSessionInDatabase()
    }, 10000) // Update every 10 seconds
  }

  /**
   * Update session in database with optimized requests
   */
  private async updateSessionInDatabase(): Promise<void> {
    if (!this.currentSession) return
    
    try {
      await this.makeOptimizedRequest('/api/analytics/sessions', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId: this.currentSession.sessionId,
          lastActiveAt: this.currentSession.lastActiveAt
        })
      })
    } catch (error) {
      console.error('Failed to update session:', error)
    }
  }

  /**
   * Set up automatic event listeners with optimized performance
   */
  private setupEventListeners(): void {
    if (typeof window === 'undefined') return
    
    // Page visibility change tracking
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.flush() // Flush events before page becomes hidden
      }
    })
    
    // Before unload - flush pending events
    window.addEventListener('beforeunload', () => {
      this.flush()
    })
    
    // Automatic click tracking for buttons
    if (this.config.enableClickTracking) {
      document.addEventListener('click', (event) => {
        this.handleAutoClick(event)
      })
    }
    
    // Optimized scroll tracking with passive listeners and throttling
    let scrollTimeout: NodeJS.Timeout
    const handleScroll = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        this.trackScrollDepth()
      }, 100)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // Update cached document height on resize
    const handleResize = () => {
      this.updateDocumentHeight()
      this.lastScrollMilestone = 0 // Reset milestone tracking
    }
    
    window.addEventListener('resize', handleResize, { passive: true })
    
    // Initialize document height
    this.updateDocumentHeight()
  }

  /**
   * Handle automatic click tracking
   */
  private handleAutoClick(event: MouseEvent): void {
    const target = event.target as HTMLElement
    if (!target) return
    
    // Skip if element has data-analytics-ignore attribute
    if (target.getAttribute('data-analytics-ignore') === 'true') return
    
    // Determine element type and properties
    const elementType = target.tagName.toLowerCase()
    const elementId = target.id || undefined
    const elementText = target.textContent?.trim().slice(0, 100) || undefined
    
    // Only track interactive elements
    const interactiveElements = ['button', 'a', 'input', 'select', 'textarea']
    const hasClickHandler = target.onclick !== null
    const isClickable = interactiveElements.includes(elementType) || hasClickHandler
    
    if (!isClickable) return
    
    this.trackClick({
      type: 'click',
      action: elementType === 'a' ? 'link_click' : 'button_click',
      category: 'interaction',
      elementType,
      elementId,
      elementText,
      position: {
        x: event.clientX,
        y: event.clientY
      }
    })
  }

  /**
   * Optimized scroll depth tracking with cached calculations
   */
  private cachedDocumentHeight = 0
  private lastScrollMilestone = 0
  
  private updateDocumentHeight(): void {
    this.cachedDocumentHeight = document.documentElement.scrollHeight - window.innerHeight
  }
  
  private trackScrollDepth(): void {
    // Update cached height if needed (only when window resizes)
    if (this.cachedDocumentHeight === 0) {
      this.updateDocumentHeight()
    }
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const scrollDepth = Math.round((scrollTop / this.cachedDocumentHeight) * 100)
    
    // Only track significant scroll milestones and avoid duplicates
    const milestones = [25, 50, 75, 90, 100]
    const currentMilestone = milestones.find(m => scrollDepth >= m && m > this.lastScrollMilestone)
    
    if (currentMilestone) {
      this.lastScrollMilestone = currentMilestone
      this.trackEvent({
        type: 'scroll',
        action: 'scroll_depth',
        category: 'engagement',
        value: currentMilestone,
        metadata: {
          scrollDepth,
          pagePath: window.location.pathname
        }
      })
    }
  }

  /**
   * Initialize third-party integrations
   */
  private async initializeIntegrations(): Promise<void> {
    // Initialize Microsoft Clarity
    if (this.config.clarity?.enabled && this.config.clarity.projectId) {
      await this.initializeClarity()
    }
    
    // Initialize Sentry
    if (this.config.sentry?.enabled && this.config.sentry.dsn) {
      await this.initializeSentry()
    }
  }

  /**
   * Initialize Microsoft Clarity
   */
  private async initializeClarity(): Promise<void> {
    try {
      if (typeof window !== 'undefined' && !window.clarity) {
        const { clarity } = await import('@microsoft/clarity')
        clarity.init(this.config.clarity?.projectId || '')
        console.log('📊 Microsoft Clarity initialized')
      }
    } catch (error) {
      console.error('Failed to initialize Clarity:', error)
    }
  }

  /**
   * Initialize Sentry
   */
  private async initializeSentry(): Promise<void> {
    try {
      // Sentry should be initialized in the app root, but we can set user context here
      if (this.currentSession?.userId) {
        // Set user context for Sentry if available
        console.log('📊 Sentry user context updated')
      }
    } catch (error) {
      console.error('Failed to initialize Sentry:', error)
    }
  }

  /**
   * Set user context for session
   */
  public async setUser(userId: string): Promise<void> {
    console.log('📊 setUser called with userId:', userId)
    
    if (!this.currentSession) {
      console.error('❌ Cannot set user - no current session exists')
      return
    }
    
    console.log('📊 Current session before setUser:', {
      sessionId: this.currentSession.sessionId,
      existingUserId: this.currentSession.userId,
      newUserId: userId
    })
    
    this.currentSession.userId = userId
    
    // Update session in database
    const patchData = {
      sessionId: this.currentSession.sessionId,
      userId: userId
    }
    
    console.log('📊 Sending PATCH request with data:', patchData)
    
    try {
      const responseData = await this.makeOptimizedRequest('/api/analytics/sessions', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(patchData)
      })
      console.log('✅ Analytics session updated with userId successfully:', {
        userId,
        sessionId: this.currentSession.sessionId,
        response: responseData
      })
    } catch (error) {
      console.error('❌ Failed to update session with userId:', {
        error: error instanceof Error ? error.message : String(error),
        userId,
        sessionId: this.currentSession.sessionId,
        patchData
      })
      // Don't throw - allow analytics to continue
    }
    
    // Update user context in third-party services
    if (this.config.clarity?.enabled) {
      window.clarity?.('set', 'userId', userId)
    }
  }

  /**
   * Track a generic analytics event with performance monitoring
   */
  public trackEvent(event: AnalyticsEvent): void {
    const startTime = performance.now()
    
    if (!this.isInitialized) {
      console.warn('Analytics service not initialized')
      return
    }
    
    // Ensure session is initialized for tracking
    if (!this.currentSession) {
      this.ensureInitialized().catch(error => {
        console.error('Failed to ensure initialization:', error)
      })
      return
    }
    
    // Apply sampling rate
    if (Math.random() > this.config.sampleRate) {
      return
    }
    
    // Check session event limit
    if (this.eventQueue.length >= this.config.maxEventsPerSession) {
      console.warn('Maximum events per session reached')
      return
    }
    
    const queuedEvent: QueuedEvent = {
      event: {
        ...event,
        metadata: {
          ...event.metadata,
          pagePath: window.location.pathname,
          pageTitle: document.title,
          timestamp: new Date().toISOString()
        }
      },
      sessionId: this.currentSession.sessionId,
      userId: this.currentSession.userId,
      timestamp: new Date(),
      retryCount: 0
    }
    
    this.eventQueue.push(queuedEvent)
    this.updateSessionActivity()
    
    // Track processing time
    this.trackPerformanceMetric('eventProcessingTime', performance.now() - startTime)
    
    // Check if we should flush events
    if (this.eventQueue.length >= this.config.batchSize) {
      this.flush()
    }
  }

  /**
   * Track page view with engagement metrics
   */
  public trackPageView(pagePath: string, pageTitle?: string): void {
    if (!this.config.enablePageViews) return
    
    const pageViewEvent: PageViewEvent = {
      type: 'view',
      action: 'page_view',
      category: 'navigation',
      pagePath,
      pageTitle: pageTitle || document.title,
      referrer: document.referrer || undefined
    }
    
    this.trackEvent(pageViewEvent)
  }

  /**
   * Track click events
   */
  public trackClick(clickData: Partial<ClickEvent>): void {
    if (!this.config.enableClickTracking) return
    
    const clickEvent: ClickEvent = {
      type: 'click',
      action: 'button_click',
      category: 'interaction',
      elementType: 'button',
      ...clickData
    }
    
    this.trackEvent(clickEvent)
  }

  /**
   * Track like/engagement events (enhanced from existing system)
   */
  public trackLike(contentId: string, contentType: string, contentTitle: string, liked: boolean, likeCount: number): void {
    const likeEvent: LikeEvent = {
      type: 'like',
      action: 'like_toggle',
      category: 'engagement',
      contentId,
      contentType,
      contentTitle,
      liked,
      likeCount,
      value: liked ? 1 : -1
    }
    
    this.trackEvent(likeEvent)
  }

  /**
   * Track content copy events
   */
  public trackCopy(contentType: string, contentId: string, contentLength?: number): void {
    const copyEvent: CopyEvent = {
      type: 'copy',
      action: 'copy_content',
      category: 'content_interaction',
      contentId,
      contentType: contentType as any,
      contentLength,
      value: contentLength
    }
    
    this.trackEvent(copyEvent)
  }

  /**
   * Track AI chat usage
   */
  public trackAIChat(action: string, conversationId: string, metadata?: Record<string, unknown>): void {
    if (!this.config.enableAIChatTracking) return
    
    const chatEvent: AIChatEvent = {
      type: 'ai_chat',
      action: action as any,
      category: 'ai_interaction',
      conversationId,
      ...metadata
    }
    
    this.trackEvent(chatEvent)
  }

  /**
   * Start the event flushing timer
   */
  private startFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer)
    }
    
    this.flushTimer = setInterval(() => {
      if (this.eventQueue.length > 0) {
        this.flush()
      }
    }, this.config.flushInterval)
  }

  /**
   * Flush all queued events to the server with performance tracking
   */
  public async flush(): Promise<void> {
    if (this.eventQueue.length === 0) return
    
    const startTime = performance.now()
    const eventsToSend = [...this.eventQueue]
    this.eventQueue = []
    
    try {
      const result = await this.makeOptimizedRequest('/api/analytics/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          events: eventsToSend
        })
      })
      
      this.performanceMetrics.averageFlushTime = 
        (this.performanceMetrics.averageFlushTime + (performance.now() - startTime)) / 2
      
      console.log(`📊 Sent ${eventsToSend.length} analytics events`, result)
    } catch (error) {
      console.error('Failed to send analytics events:', error)
      
      // Re-queue failed events with retry logic
      eventsToSend.forEach(event => {
        if (event.retryCount < 3) {
          event.retryCount++
          this.eventQueue.push(event)
          console.log(`🔄 Retrying event (attempt ${event.retryCount + 1})`)
        } else {
          console.warn('🚫 Event dropped after 3 retries:', event.event.type)
        }
      })
    }
  }

  /**
   * End the current session
   */
  public async endSession(): Promise<void> {
    if (!this.currentSession) return
    
    // Flush any remaining events
    await this.flush()
    
    // Update session end time in database
    try {
      await this.makeOptimizedRequest('/api/analytics/sessions', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId: this.currentSession.sessionId,
          endedAt: new Date()
        })
      })
    } catch (error) {
      console.error('Failed to end session:', error)
    }
    
    // Clear session storage
    sessionStorage.removeItem('analytics_session_id')
    sessionStorage.removeItem('analytics_session_start')
    
    this.currentSession = null
  }

  /**
   * Get current session information
   */
  public getSession(): AnalyticsSession | null {
    return this.currentSession
  }

  /**
   * Check if analytics is initialized and ready
   */
  public isReady(): boolean {
    return this.isInitialized
  }

  /**
   * Cleanup method to prevent memory leaks
   */
  public destroy(): void {
    // Clear all timers
    if (this.flushTimer) {
      clearInterval(this.flushTimer)
      this.flushTimer = null
    }
    
    if (this.sessionUpdateTimer) {
      clearTimeout(this.sessionUpdateTimer)
      this.sessionUpdateTimer = null
    }
    
    // Clear caches and queues
    this.eventQueue = []
    this.requestCache.clear()
    this.currentSession = null
    this.isInitialized = false
    this.initPromise = null
    
    // Reset performance metrics
    this.performanceMetrics = {
      initializationTime: 0,
      averageFlushTime: 0,
      eventProcessingTime: 0,
      memoryUsage: 0,
      networkRequests: 0
    }
    
    console.log('📊 Analytics service destroyed and cleaned up')
  }

  /**
   * Get performance metrics for monitoring
   */
  public getPerformanceMetrics() {
    return {
      ...this.performanceMetrics,
      memoryUsage: this.eventQueue.length + this.requestCache.size,
      cacheSize: this.requestCache.size,
      queueSize: this.eventQueue.length
    }
  }

  /**
   * Track performance metric with threshold monitoring
   */
  private trackPerformanceMetric(metric: 'initializationTime' | 'averageFlushTime' | 'eventProcessingTime' | 'memoryUsage' | 'networkRequests', value: number): void {
    this.performanceMetrics[metric] = value
    
    // Define thresholds for monitoring
    const thresholds = {
      initializationTime: 100, // 100ms
      averageFlushTime: 1000,  // 1 second
      eventProcessingTime: 50, // 50ms
      memoryUsage: 1000,       // 1000 items
      networkRequests: 100     // 100 requests per session
    }
    
    if (value > thresholds[metric]) {
      console.warn(`📊 Performance threshold exceeded: ${metric} = ${value}ms (threshold: ${thresholds[metric]}ms)`)
    }
  }
}

// Create singleton instance
export const analytics = new AnalyticsService()

// Export the service class for testing
export { AnalyticsService }