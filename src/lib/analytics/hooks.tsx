/**
 * Analytics React Hooks and Context
 * React integration for the analytics tracking system
 */

'use client'

import React, { createContext, useContext, useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { analytics } from './service'
import type { AnalyticsContext, AnalyticsEvent, Device } from './types'

// Analytics Context
const AnalyticsReactContext = createContext<AnalyticsContext | null>(null)

/**
 * Analytics Provider Component
 * Wraps the app to provide analytics tracking capabilities
 */
interface AnalyticsProviderProps {
  children: React.ReactNode
  userId?: string
  enableAutoTracking?: boolean
  config?: {
    enablePageViews?: boolean
    enableClickTracking?: boolean
    enablePerformanceTracking?: boolean
  }
}

export function AnalyticsProvider({ 
  children, 
  userId, 
  enableAutoTracking = true,
  config = {}
}: AnalyticsProviderProps) {
  const [isReady, setIsReady] = useState(false)
  const [sessionId, setSessionId] = useState<string>('')
  const [deviceType, setDeviceType] = useState<Device>('UNKNOWN')
  const pathname = usePathname()
  const previousPathname = useRef<string>('')
  
  // Memoized analytics configuration to prevent unnecessary re-renders
  const analyticsConfig = useMemo(() => ({
    enablePageViews: config.enablePageViews ?? true,
    enableClickTracking: config.enableClickTracking ?? true,
    enablePerformanceTracking: config.enablePerformanceTracking ?? true
  }), [config.enablePageViews, config.enableClickTracking, config.enablePerformanceTracking])
  
  // Optimized initialization with non-blocking approach
  useEffect(() => {
    let mounted = true
    
    const initializeAnalytics = async () => {
      try {
        // Non-blocking check for analytics readiness
        if (analytics.isReady()) {
          const session = analytics.getSession()
          if (mounted && session) {
            setSessionId(session.sessionId)
            setDeviceType(session.deviceType)
          }
          if (mounted) {
            setIsReady(true)
          }
        } else {
          // Ensure full initialization if not ready
          await analytics.ensureInitialized()
          
          if (mounted) {
            const session = analytics.getSession()
            if (session) {
              setSessionId(session.sessionId)
              setDeviceType(session.deviceType)
            }
            setIsReady(true)
          }
        }
      } catch (error) {
        console.error('Failed to initialize analytics:', error)
        // Still mark as ready to prevent blocking
        if (mounted) {
          setIsReady(true)
        }
      }
    }
    
    initializeAnalytics()
    
    return () => {
      mounted = false
    }
  }, [])
  
  // Optimized user context setting with proper dependency management
  useEffect(() => {
    if (!isReady || !userId) return
    
    let cancelled = false
    
    const setUserInAnalytics = async () => {
      try {
        await analytics.setUser(userId)
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to set user in analytics provider:', error)
        }
      }
    }
    
    setUserInAnalytics()
    
    return () => {
      cancelled = true
    }
  }, [isReady, userId])
  
  // Optimized page view tracking with memoized config
  useEffect(() => {
    if (!isReady || !enableAutoTracking || !analyticsConfig.enablePageViews) return
    
    // Track page view if pathname changed
    if (pathname !== previousPathname.current) {
      analytics.trackPageView(pathname, document.title)
      previousPathname.current = pathname
    }
  }, [pathname, isReady, enableAutoTracking, analyticsConfig.enablePageViews])
  
  // Memoized analytics context methods to prevent unnecessary re-renders
  const trackEvent = useCallback((event: AnalyticsEvent) => {
    if (isReady) {
      analytics.trackEvent(event)
    }
  }, [isReady])
  
  const trackPageView = useCallback((pagePath: string, pageTitle?: string) => {
    if (isReady) {
      analytics.trackPageView(pagePath, pageTitle)
    }
  }, [isReady])
  
  const trackClick = useCallback((elementType: string, elementId?: string, metadata?: Record<string, unknown>) => {
    if (isReady) {
      analytics.trackClick({
        type: 'click',
        action: elementType === 'a' ? 'link_click' : 'button_click',
        category: 'interaction',
        elementType,
        elementId,
        metadata
      })
    }
  }, [isReady])
  
  const trackLike = useCallback((contentId: string, contentType: string, liked: boolean, likeCount: number) => {
    if (isReady) {
      analytics.trackLike(contentId, contentType, `${contentType}: ${contentId}`, liked, likeCount)
    }
  }, [isReady])
  
  const trackCopy = useCallback((contentType: string, contentId: string, contentLength?: number) => {
    if (isReady) {
      analytics.trackCopy(contentType, contentId, contentLength)
    }
  }, [isReady])
  
  const trackAIChat = useCallback((action: string, conversationId: string, metadata?: Record<string, unknown>) => {
    if (isReady) {
      analytics.trackAIChat(action, conversationId, metadata)
    }
  }, [isReady])
  
  // Memoized context value to prevent unnecessary provider re-renders
  const contextValue: AnalyticsContext = useMemo(() => ({
    sessionId,
    userId,
    deviceType,
    isTrackingEnabled: isReady,
    trackEvent,
    trackPageView,
    trackClick,
    trackLike,
    trackCopy,
    trackAIChat
  }), [sessionId, userId, deviceType, isReady, trackEvent, trackPageView, trackClick, trackLike, trackCopy, trackAIChat])
  
  // Cleanup analytics service on unmount
  useEffect(() => {
    return () => {
      analytics.destroy()
    }
  }, [])
  
  return (
    <AnalyticsReactContext.Provider value={contextValue}>
      {children}
    </AnalyticsReactContext.Provider>
  )
}

/**
 * Hook to access analytics context
 */
export function useAnalytics(): AnalyticsContext {
  const context = useContext(AnalyticsReactContext)
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider')
  }
  return context
}

/**
 * Custom hook for optimized document height tracking
 */
function useDocumentHeight() {
  const [documentHeight, setDocumentHeight] = useState(0)
  
  useEffect(() => {
    const updateHeight = () => {
      setDocumentHeight(
        document.documentElement.scrollHeight - window.innerHeight
      )
    }
    
    updateHeight()
    window.addEventListener('resize', updateHeight, { passive: true })
    
    return () => {
      window.removeEventListener('resize', updateHeight)
    }
  }, [])
  
  return documentHeight
}

/**
 * Optimized hook for page view tracking with engagement metrics
 */
export function usePageView(pagePath?: string, pageTitle?: string) {
  const { trackPageView, isTrackingEnabled } = useAnalytics()
  const pathname = usePathname()
  const documentHeight = useDocumentHeight()
  const startTime = useRef<number>(Date.now())
  const scrollDepth = useRef<number>(0)
  
  // Memoize the computed path and title to prevent unnecessary re-renders
  const trackingData = useMemo(() => ({
    path: pagePath || pathname,
    title: pageTitle || (typeof document !== 'undefined' ? document.title : '')
  }), [pagePath, pathname, pageTitle])
  
  // Throttled scroll handler with optimized DOM queries
  const throttledScrollHandler = useMemo(() => {
    let lastCallTime = 0
    const throttleDelay = 100
    
    return () => {
      const now = Date.now()
      if (now - lastCallTime >= throttleDelay) {
        lastCallTime = now
        
        if (documentHeight > 0) {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop
          const currentScrollDepth = Math.round((scrollTop / documentHeight) * 100)
          
          if (currentScrollDepth > scrollDepth.current) {
            scrollDepth.current = Math.min(100, currentScrollDepth)
          }
        }
      }
    }
  }, [documentHeight])
  
  // Memoized beforeunload handler to prevent recreation
  const beforeUnloadHandler = useCallback(() => {
    const timeOnPage = Math.round((Date.now() - startTime.current) / 1000)
    
    // Send final page view data
    analytics.trackEvent({
      type: 'view',
      action: 'page_exit',
      category: 'engagement',
      value: timeOnPage,
      metadata: {
        pagePath: trackingData.path,
        timeOnPage,
        scrollDepth: scrollDepth.current,
        exitPage: true
      }
    })
  }, [trackingData.path])
  
  useEffect(() => {
    if (!isTrackingEnabled) return
    
    // Track page view
    trackPageView(trackingData.path, trackingData.title)
    
    // Reset metrics for new page
    startTime.current = Date.now()
    scrollDepth.current = 0
    
    // Add optimized event listeners
    window.addEventListener('scroll', throttledScrollHandler, { passive: true })
    window.addEventListener('beforeunload', beforeUnloadHandler)
    
    return () => {
      window.removeEventListener('scroll', throttledScrollHandler)
      window.removeEventListener('beforeunload', beforeUnloadHandler)
    }
  }, [trackingData.path, trackingData.title, trackPageView, isTrackingEnabled, throttledScrollHandler, beforeUnloadHandler])
  
  // Memoized return value to prevent unnecessary re-renders
  return useMemo(() => ({
    getTimeOnPage: () => Math.round((Date.now() - startTime.current) / 1000),
    getScrollDepth: () => scrollDepth.current
  }), [])
}

/**
 * Optimized hook for click tracking with automatic element detection
 */
export function useClickTracking(elementRef: React.RefObject<HTMLElement>, metadata?: Record<string, unknown>) {
  const { trackClick, isTrackingEnabled } = useAnalytics()
  
  // Memoize metadata to prevent unnecessary effect re-runs
  const memoizedMetadata = useMemo(() => metadata || {}, [metadata])
  
  // Memoized click handler to prevent recreation on every render
  const handleClick = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement
    const elementType = target.tagName.toLowerCase()
    const elementId = target.id || undefined
    const elementText = target.textContent?.trim().slice(0, 100) || undefined
    
    trackClick(elementType, elementId, {
      ...memoizedMetadata,
      elementText,
      position: {
        x: event.clientX,
        y: event.clientY
      }
    })
  }, [trackClick, memoizedMetadata])
  
  useEffect(() => {
    if (!isTrackingEnabled || !elementRef.current) return
    
    const element = elementRef.current
    element.addEventListener('click', handleClick)
    
    return () => {
      element.removeEventListener('click', handleClick)
    }
  }, [elementRef, handleClick, isTrackingEnabled])
}

/**
 * Optimized hook for form analytics tracking
 */
export function useFormTracking(formId: string) {
  const { trackEvent, isTrackingEnabled } = useAnalytics()
  const formRef = useRef<HTMLFormElement>(null)
  const startTime = useRef<number>(0)
  const fieldInteractions = useRef<Set<string>>(new Set())
  
  // Memoized event handlers to prevent recreation on every render
  const handleFormStart = useCallback(() => {
    startTime.current = Date.now()
    trackEvent({
      type: 'form',
      action: 'form_start',
      category: 'interaction',
      label: formId
    })
  }, [trackEvent, formId])
  
  const handleFormSubmit = useCallback(() => {
    const duration = Date.now() - startTime.current
    const fieldsCompleted = fieldInteractions.current.size
    
    trackEvent({
      type: 'form',
      action: 'form_submit',
      category: 'interaction',
      label: formId,
      value: duration,
      metadata: {
        duration,
        fieldsCompleted,
        formProgress: 100
      }
    })
  }, [trackEvent, formId])
  
  const handleFieldFocus = useCallback((event: FocusEvent) => {
    const target = event.target as HTMLInputElement
    const fieldName = target.name || target.id || 'unknown'
    
    if (!fieldInteractions.current.has(fieldName)) {
      fieldInteractions.current.add(fieldName)
      
      trackEvent({
        type: 'form',
        action: 'field_focus',
        category: 'interaction',
        label: formId,
        metadata: {
          fieldName,
          fieldType: target.type
        }
      })
    }
  }, [trackEvent, formId])
  
  useEffect(() => {
    if (!isTrackingEnabled || !formRef.current) return
    
    const form = formRef.current
    
    form.addEventListener('focusin', handleFormStart, { once: true })
    form.addEventListener('submit', handleFormSubmit)
    form.addEventListener('focusin', handleFieldFocus)
    
    return () => {
      form.removeEventListener('focusin', handleFormStart)
      form.removeEventListener('submit', handleFormSubmit)
      form.removeEventListener('focusin', handleFieldFocus)
    }
  }, [isTrackingEnabled, handleFormStart, handleFormSubmit, handleFieldFocus])
  
  // Memoized return value to prevent unnecessary re-renders
  return useMemo(() => ({
    formRef,
    getFormProgress: () => {
      const totalFields = formRef.current?.querySelectorAll('input, textarea, select').length || 1
      return Math.round((fieldInteractions.current.size / totalFields) * 100)
    }
  }), [])
}

/**
 * Optimized hook for AI chat analytics
 */
export function useAIChatTracking(conversationId: string) {
  const { trackAIChat, isTrackingEnabled } = useAnalytics()
  const startTime = useRef<number>(0)
  const messageCount = useRef<number>(0)
  const hasStarted = useRef<boolean>(false)
  
  // Memoized conversation methods to prevent unnecessary re-renders
  const startConversation = useCallback((selectedArticle?: string, selectedContentType?: string) => {
    if (!isTrackingEnabled || hasStarted.current) return
    
    startTime.current = Date.now()
    hasStarted.current = true
    
    trackAIChat('conversation_started', conversationId, {
      selectedArticle,
      selectedContentType
    })
  }, [trackAIChat, conversationId, isTrackingEnabled])
  
  const trackMessage = useCallback((tokensUsed?: number, responseTime?: number, errorOccurred?: boolean) => {
    if (!isTrackingEnabled || !hasStarted.current) return
    
    messageCount.current++
    
    trackAIChat('message_sent', conversationId, {
      messageCount: messageCount.current,
      tokensUsed,
      responseTime,
      errorOccurred
    })
  }, [trackAIChat, conversationId, isTrackingEnabled])
  
  const endConversation = useCallback(() => {
    if (!isTrackingEnabled || !hasStarted.current) return
    
    const sessionDuration = Math.round((Date.now() - startTime.current) / 1000)
    
    trackAIChat('conversation_ended', conversationId, {
      sessionDuration,
      messageCount: messageCount.current
    })
    
    hasStarted.current = false
  }, [trackAIChat, conversationId, isTrackingEnabled])
  
  // Auto-end conversation on unmount with proper cleanup
  useEffect(() => {
    return () => {
      if (hasStarted.current) {
        endConversation()
      }
    }
  }, [endConversation])
  
  // Memoized return value to prevent unnecessary re-renders
  return useMemo(() => ({
    startConversation,
    trackMessage,
    endConversation,
    getSessionDuration: () => hasStarted.current ? Math.round((Date.now() - startTime.current) / 1000) : 0,
    getMessageCount: () => messageCount.current
  }), [startConversation, trackMessage, endConversation])
}

/**
 * Optimized higher-order component for automatic analytics tracking
 */
export function withAnalytics<P extends object>(
  Component: React.ComponentType<P>,
  trackingConfig?: {
    trackClicks?: boolean
    trackPageViews?: boolean
    eventMetadata?: Record<string, unknown>
  }
) {
  // Memoize the wrapped component to prevent unnecessary re-creation
  const AnalyticsWrappedComponent = React.memo((props: P) => {
    const elementRef = useRef<HTMLDivElement>(null)
    
    // Memoize the tracking config to prevent unnecessary effect re-runs
    const memoizedConfig = useMemo(() => trackingConfig || {}, [trackingConfig])
    
    // Apply click tracking if enabled
    useClickTracking(
      memoizedConfig?.trackClicks ? elementRef : { current: null },
      memoizedConfig?.eventMetadata
    )
    
    return (
      <div ref={elementRef}>
        <Component {...props} />
      </div>
    )
  })
  
  AnalyticsWrappedComponent.displayName = `withAnalytics(${Component.displayName || Component.name})`
  
  return AnalyticsWrappedComponent
}