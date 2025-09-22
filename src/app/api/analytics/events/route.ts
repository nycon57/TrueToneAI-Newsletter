import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { QueuedEvent, AnalyticsEvent } from '@/lib/analytics/types'
import { 
  checkRateLimit, 
  getClientIdentifier, 
  RATE_LIMIT_CONFIGS,
  getRateLimitHeaders 
} from '@/lib/utils/rateLimit'
import { ANALYTICS_CONFIG } from '@/lib/utils/constants'


// POST: Batch process analytics events
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { events } = body
    
    // Validate input
    if (!events || !Array.isArray(events)) {
      return NextResponse.json(
        { error: 'Events array is required' },
        { status: 400 }
      )
    }
    
    if (events.length === 0) {
      return NextResponse.json(
        { success: true, processed: 0 },
        { status: 200 }
      )
    }
    
    if (events.length > ANALYTICS_CONFIG.MAX_EVENTS_PER_BATCH) {
      return NextResponse.json(
        { error: `Maximum ${ANALYTICS_CONFIG.MAX_EVENTS_PER_BATCH} events per batch` },
        { status: 400 }
      )
    }
    
    // Rate limiting
    const clientId = getClientIdentifier(request, 'events')
    
    if (!checkRateLimit(clientId, RATE_LIMIT_CONFIGS.EVENTS)) {
      const rateLimitHeaders = getRateLimitHeaders(clientId, RATE_LIMIT_CONFIGS.EVENTS)
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { 
          status: 429,
          headers: rateLimitHeaders
        }
      )
    }
    
    const processedEvents: string[] = []
    const errors: string[] = []
    
    // Optimize: Batch validate all unique sessions upfront to reduce database calls
    const uniqueSessionIds = [...new Set(events.map((e: QueuedEvent) => e.sessionId))]
    const validSessions = new Set()
    
    // Fetch all unique sessions in parallel
    const sessionValidationResults = await Promise.allSettled(
      uniqueSessionIds.map(sessionId => 
        prisma.userSession.findUnique({ where: { sessionId } })
      )
    )
    
    // Build set of valid session IDs
    sessionValidationResults.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        validSessions.add(uniqueSessionIds[index])
      }
    })
    
    // Process events with pre-validated sessions
    const eventProcessingPromises = events.map(async (queuedEvent: QueuedEvent) => {
      try {
        const { event, sessionId, userId, timestamp } = queuedEvent
        
        // Quick session validation using pre-fetched data
        if (!validSessions.has(sessionId)) {
          // Retry once for race conditions
          const session = await prisma.userSession.findUnique({
            where: { sessionId }
          })
          
          if (!session) {
            return { error: `Session ${sessionId} not found` }
          }
          validSessions.add(sessionId)
        }
        
        // Create base analytics event
        const analyticsEvent = await prisma.analyticsEvent.create({
          data: {
            sessionId,
            userId: userId || undefined,
            eventType: event.type,
            eventAction: event.action,
            eventCategory: event.category || undefined,
            eventLabel: event.label || undefined,
            eventValue: event.value ? parseFloat(event.value.toString()) : undefined,
            pagePath: event.metadata?.pagePath || undefined,
            elementId: event.metadata?.elementId || undefined,
            elementType: event.metadata?.elementType || undefined,
            metadata: event.metadata || undefined,
            timestamp: new Date(timestamp)
          }
        })
        
        // Handle specific event types and session updates in parallel
        await Promise.all([
          handleSpecificEventTypes(event, sessionId, userId, timestamp),
          prisma.userSession.update({
            where: { sessionId },
            data: {
              eventsCount: { increment: 1 },
              lastActiveAt: new Date(timestamp)
            }
          })
        ])
        
        return { success: true, eventId: analyticsEvent.id }
        
      } catch (eventError) {
        console.error('Error processing event:', eventError)
        return { error: `Failed to process event: ${eventError instanceof Error ? eventError.message : String(eventError)}` }
      }
    })
    
    // Execute all event processing in parallel with controlled concurrency
    const results = await Promise.allSettled(eventProcessingPromises)
    
    // Process results
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        if (result.value.success) {
          processedEvents.push(result.value.eventId)
        } else if (result.value.error) {
          errors.push(result.value.error)
        }
      } else {
        errors.push(`Promise rejected: ${result.reason}`)
      }
    })
    
    // Return processing results
    return NextResponse.json({
      success: true,
      processed: processedEvents.length,
      errors: errors.length > 0 ? errors : undefined
    })
    
  } catch (error) {
    console.error('Events processing error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle specific event types that need additional processing
async function handleSpecificEventTypes(
  event: AnalyticsEvent, 
  sessionId: string, 
  userId?: string, 
  timestamp?: Date
) {
  const eventTimestamp = timestamp ? new Date(timestamp) : new Date()
  
  try {
    // Handle page view events
    if (event.type === 'view' && event.action === 'page_view') {
      const pageViewEvent = event as AnalyticsEvent & {
        pagePath?: string;
        pageTitle?: string;
        referrer?: string;
        timeOnPage?: number;
        scrollDepth?: number;
        exitPage?: boolean;
        bounce?: boolean;
      };
      await prisma.pageView.create({
        data: {
          sessionId,
          userId: userId || undefined,
          pagePath: pageViewEvent.pagePath || pageViewEvent.metadata?.pagePath || '',
          pageTitle: pageViewEvent.pageTitle || pageViewEvent.metadata?.pageTitle || undefined,
          referrer: pageViewEvent.referrer || pageViewEvent.metadata?.referrer || undefined,
          timeOnPage: pageViewEvent.timeOnPage || pageViewEvent.metadata?.timeOnPage || undefined,
          scrollDepth: pageViewEvent.scrollDepth || pageViewEvent.metadata?.scrollDepth || undefined,
          exitPage: pageViewEvent.exitPage || pageViewEvent.metadata?.exitPage || false,
          bounce: pageViewEvent.bounce || pageViewEvent.metadata?.bounce || false,
          timestamp: eventTimestamp
        }
      })
      
      // Update session page view counter
      await prisma.userSession.update({
        where: { sessionId },
        data: {
          pageViews: { increment: 1 }
        }
      })
    }
    
    // Handle AI chat events
    if (event.type === 'ai_chat') {
      const chatEvent = event as AnalyticsEvent & {
        conversationId?: string;
        selectedArticle?: string;
        selectedContentType?: string;
        tokensUsed?: number;
        sessionDuration?: number;
        errorOccurred?: boolean;
      };  
      const conversationId = chatEvent.conversationId || chatEvent.metadata?.conversationId
      
      if (!conversationId) {
        return // Skip if no conversation ID
      }
      
      // Find or create chat analytics record
      let chatAnalytics = await prisma.chatAnalytics.findFirst({
        where: {
          sessionId,
          conversationId
        }
      })
      
      if (!chatAnalytics) {
        chatAnalytics = await prisma.chatAnalytics.create({
          data: {
            sessionId,
            userId: userId || undefined,
            conversationId,
            selectedArticle: chatEvent.selectedArticle || chatEvent.metadata?.selectedArticle || undefined,
            selectedContentType: chatEvent.selectedContentType || chatEvent.metadata?.selectedContentType || undefined,
            startedAt: eventTimestamp
          }
        })
      }
      
      // Update chat analytics based on action
      const updateData: {
        messageCount?: { increment: number };
        tokensUsed?: { increment: number };
        endedAt?: Date;
        sessionDuration?: number;
        errorCount?: { increment: number };
      } = {}
      
      if (chatEvent.action === 'message_sent') {
        updateData.messageCount = { increment: 1 }
        
        if (chatEvent.tokensUsed || chatEvent.metadata?.tokensUsed) {
          updateData.tokensUsed = {
            increment: chatEvent.tokensUsed || chatEvent.metadata?.tokensUsed || 0
          }
        }
      }
      
      if (chatEvent.action === 'conversation_ended') {
        updateData.endedAt = eventTimestamp
        
        if (chatEvent.sessionDuration || chatEvent.metadata?.sessionDuration) {
          updateData.sessionDuration = chatEvent.sessionDuration || chatEvent.metadata?.sessionDuration
        }
      }
      
      if (chatEvent.errorOccurred || chatEvent.metadata?.errorOccurred) {
        updateData.errorCount = { increment: 1 }
      }
      
      if (Object.keys(updateData).length > 0) {
        await prisma.chatAnalytics.update({
          where: { id: chatAnalytics.id },
          data: updateData
        })
      }
    }
    
    // Handle like events (enhance existing like tracking)
    if (event.type === 'like' && event.action === 'like_toggle') {
      // The like event will be handled by the existing likes API
      // This analytics event provides additional context and metrics
      
      // Could aggregate like metrics here for analytics dashboard
      // For example, track like trends, popular content, etc.
    }
    
  } catch (error) {
    console.error('Error handling specific event type:', error)
    // Don't throw - we still want to track the base analytics event
  }
}

// GET: Retrieve analytics events with filtering and aggregation
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    const userId = searchParams.get('userId')
    const eventType = searchParams.get('eventType')
    const eventAction = searchParams.get('eventAction')
    const pagePath = searchParams.get('pagePath')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const limit = parseInt(searchParams.get('limit') || ANALYTICS_CONFIG.DEFAULT_EVENTS_LIMIT.toString())
    const offset = parseInt(searchParams.get('offset') || '0')
    const aggregate = searchParams.get('aggregate') === 'true'
    
    // Rate limiting
    const clientId = getClientIdentifier(request, 'events_get')
    
    if (!checkRateLimit(clientId, RATE_LIMIT_CONFIGS.EVENTS_GET)) {
      const rateLimitHeaders = getRateLimitHeaders(clientId, RATE_LIMIT_CONFIGS.EVENTS_GET)
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { 
          status: 429,
          headers: rateLimitHeaders
        }
      )
    }
    
    // Build where clause
    const where: {
      sessionId?: string;
      userId?: string;
      eventType?: string;
      eventAction?: string;
      pagePath?: string;
      timestamp?: { gte?: Date; lte?: Date };
    } = {}
    
    if (sessionId) where.sessionId = sessionId
    if (userId) where.userId = userId
    if (eventType) where.eventType = eventType
    if (eventAction) where.eventAction = eventAction
    if (pagePath) where.pagePath = pagePath
    
    if (startDate || endDate) {
      where.timestamp = {}
      if (startDate) where.timestamp.gte = new Date(startDate)
      if (endDate) where.timestamp.lte = new Date(endDate)
    }
    
    if (aggregate) {
      // Return aggregated analytics data
      const [
        eventCounts,
        topPages,
        topEvents,
        hourlyDistribution
      ] = await Promise.all([
        // Event type breakdown
        prisma.analyticsEvent.groupBy({
          by: ['eventType'],
          _count: true,
          where,
          orderBy: { _count: { eventType: 'desc' } }
        }),
        
        // Top pages by events
        prisma.analyticsEvent.groupBy({
          by: ['pagePath'],
          _count: true,
          where: { ...where, pagePath: { not: null } },
          orderBy: { _count: { pagePath: 'desc' } },
          take: ANALYTICS_CONFIG.TOP_PAGES_LIMIT
        }),
        
        // Top event actions
        prisma.analyticsEvent.groupBy({
          by: ['eventType', 'eventAction'],
          _count: true,
          where,
          orderBy: { _count: { eventType: 'desc' } },
          take: ANALYTICS_CONFIG.TOP_EVENTS_LIMIT
        }),
        
        // Hourly distribution (last 24 hours)
        prisma.analyticsEvent.groupBy({
          by: ['timestamp'],
          _count: true,
          where: {
            ...where,
            timestamp: {
              gte: new Date(Date.now() - ANALYTICS_CONFIG.ANALYTICS_WINDOW_24H_MS)
            }
          }
        })
      ])
      
      return NextResponse.json({
        eventCounts: eventCounts.reduce((acc, item) => {
          acc[item.eventType] = item._count
          return acc
        }, {} as Record<string, number>),
        
        topPages: topPages.map(item => ({
          path: item.pagePath,
          events: item._count
        })),
        
        topEvents: topEvents.map(item => ({
          type: item.eventType,
          action: item.eventAction,
          count: item._count
        })),
        
        hourlyDistribution: hourlyDistribution.map(item => ({
          hour: item.timestamp,
          count: item._count
        }))
      })
      
    } else {
      // Return raw events
      const events = await prisma.analyticsEvent.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        take: Math.min(limit, ANALYTICS_CONFIG.MAX_EVENTS_PER_GET_REQUEST),
        skip: offset,
        include: {
          session: {
            select: {
              deviceType: true,
              countryCode: true
            }
          }
        }
      })
      
      const total = await prisma.analyticsEvent.count({ where })
      
      return NextResponse.json({
        events,
        total,
        limit,
        offset
      })
    }
    
  } catch (error) {
    console.error('Events retrieval error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}