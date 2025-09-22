import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { Device } from '@/generated/prisma'
import { 
  checkRateLimit, 
  getClientIdentifier, 
  RATE_LIMIT_CONFIGS,
  getRateLimitHeaders 
} from '@/lib/utils/rateLimit'
import { ANALYTICS_CONFIG, GEOLOCATION_CONFIG } from '@/lib/utils/constants'

// Helper function to detect device type from user agent
function getDeviceType(userAgent: string): Device {
  const ua = userAgent.toLowerCase()
  
  if (/mobile|android|iphone|ipod/.test(ua)) {
    return 'MOBILE'
  } else if (/ipad|tablet/.test(ua)) {
    return 'TABLET'
  } else if (/windows|mac|linux/.test(ua)) {
    return 'DESKTOP'
  }
  
  return 'UNKNOWN'
}


// Helper function to get geolocation data from IP address with timeout and retry
async function getGeolocationFromIP(ipAddress: string): Promise<{
  countryCode?: string
  region?: string
  city?: string
}> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), GEOLOCATION_CONFIG.TIMEOUT_MS)
  
  try {
    // Using ipapi.co for geolocation (free tier available) with timeout
    const response = await fetch(`https://ipapi.co/${ipAddress}/json/`, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'TrueToneAI-Newsletter/1.0'
      }
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      throw new Error(`Geolocation API failed with status: ${response.status}`)
    }
    
    const data = await response.json()
    
    return {
      countryCode: data.country_code?.substring(0, 2) || undefined,
      region: data.region || undefined,
      city: data.city || undefined
    }
  } catch (error) {
    clearTimeout(timeoutId)
    
    // Log specific error types for debugging
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.warn(`Geolocation API timeout after ${GEOLOCATION_CONFIG.TIMEOUT_MS}ms for IP: ${ipAddress}`)
      } else {
        console.warn('Failed to get geolocation:', error.message)
      }
    }
    
    return {}
  }
}


// POST: Create new analytics session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, userAgent, deviceType, ipAddress, startedAt, userId } = body
    
    // Validate required fields
    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId is required' },
        { status: 400 }
      )
    }
    
    // Rate limiting
    const clientId = getClientIdentifier(request, 'session')
    
    if (!checkRateLimit(clientId, RATE_LIMIT_CONFIGS.SESSIONS)) {
      const rateLimitHeaders = getRateLimitHeaders(clientId, RATE_LIMIT_CONFIGS.SESSIONS)
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { 
          status: 429,
          headers: rateLimitHeaders
        }
      )
    }
    
    // Get geolocation data if IP address is provided
    let geolocation = {}
    if (ipAddress && !GEOLOCATION_CONFIG.EXCLUDED_IPS.includes(ipAddress)) {
      geolocation = await getGeolocationFromIP(ipAddress)
    }
    
    // Detect device type from user agent if not provided
    const detectedDeviceType = deviceType || (userAgent ? getDeviceType(userAgent) : 'UNKNOWN')
    
    // Check if session already exists
    const existingSession = await prisma.userSession.findUnique({
      where: { sessionId: sessionId }
    })
    
    if (existingSession) {
      return NextResponse.json(
        { error: 'Session already exists' },
        { status: 409 }
      )
    }
    
    // Create new session
    const session = await prisma.userSession.create({
      data: {
        sessionId,
        userId: userId || undefined,
        userAgent: userAgent || undefined,
        deviceType: detectedDeviceType,
        ipAddress: ipAddress || undefined,
        startedAt: startedAt ? new Date(startedAt) : new Date(),
        lastActiveAt: new Date(),
        ...geolocation
      }
    })
    
    return NextResponse.json({
      sessionId: session.sessionId,
      deviceType: session.deviceType,
      location: {
        countryCode: session.countryCode,
        region: session.region,
        city: session.city
      }
    })
    
  } catch (error) {
    console.error('Session creation error:', error)
    
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'Session already exists' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH: Update existing session (last activity, end time, etc.)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, lastActiveAt, endedAt, userId } = body
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId is required' },
        { status: 400 }
      )
    }
    
    // Rate limiting
    const clientId = getClientIdentifier(request, 'session_update')
    
    if (!checkRateLimit(clientId, RATE_LIMIT_CONFIGS.SESSION_UPDATES)) {
      const rateLimitHeaders = getRateLimitHeaders(clientId, RATE_LIMIT_CONFIGS.SESSION_UPDATES)
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { 
          status: 429,
          headers: rateLimitHeaders
        }
      )
    }
    
    // Find existing session
    const existingSession = await prisma.userSession.findUnique({
      where: { sessionId }
    })
    
    if (!existingSession) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }
    
    // Update session
    const updateData: {
      lastActiveAt?: Date;
      endedAt?: Date;
      userId?: string;
    } = {}
    
    if (lastActiveAt) {
      updateData.lastActiveAt = new Date(lastActiveAt)
    }
    
    if (endedAt) {
      updateData.endedAt = new Date(endedAt)
    }
    
    if (userId && !existingSession.userId) {
      updateData.userId = userId
    }
    
    const updatedSession = await prisma.userSession.update({
      where: { sessionId },
      data: updateData
    })
    
    return NextResponse.json({
      sessionId: updatedSession.sessionId,
      lastActiveAt: updatedSession.lastActiveAt,
      endedAt: updatedSession.endedAt
    })
    
  } catch (error) {
    console.error('Session update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET: Retrieve session analytics data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || ANALYTICS_CONFIG.DEFAULT_SESSIONS_LIMIT.toString())
    const offset = parseInt(searchParams.get('offset') || '0')
    
    // Rate limiting
    const clientId = getClientIdentifier(request, 'session_get')
    
    if (!checkRateLimit(clientId, RATE_LIMIT_CONFIGS.SESSION_GET)) {
      const rateLimitHeaders = getRateLimitHeaders(clientId, RATE_LIMIT_CONFIGS.SESSION_GET)
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { 
          status: 429,
          headers: rateLimitHeaders
        }
      )
    }
    
    if (sessionId) {
      // Get specific session with related data
      const session = await prisma.userSession.findUnique({
        where: { sessionId },
        include: {
          events: {
            orderBy: { timestamp: 'desc' },
            take: limit,
            skip: offset
          },
          pageViewsRel: {
            orderBy: { timestamp: 'desc' },
            take: limit,
            skip: offset
          },
          chatSessions: {
            orderBy: { startedAt: 'desc' },
            take: limit,
            skip: offset
          }
        }
      })
      
      if (!session) {
        return NextResponse.json(
          { error: 'Session not found' },
          { status: 404 }
        )
      }
      
      return NextResponse.json(session)
      
    } else if (userId) {
      // Get user's sessions
      const sessions = await prisma.userSession.findMany({
        where: { userId },
        orderBy: { startedAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          _count: {
            select: {
              events: true,
              pageViewsRel: true,
              chatSessions: true
            }
          }
        }
      })
      
      return NextResponse.json({
        sessions,
        total: sessions.length
      })
      
    } else {
      // Get session analytics summary
      const now = new Date()
      const last24Hours = new Date(now.getTime() - ANALYTICS_CONFIG.ANALYTICS_WINDOW_24H_MS)
      const last7Days = new Date(now.getTime() - ANALYTICS_CONFIG.ANALYTICS_WINDOW_7D_MS)
      
      const [
        totalSessions,
        activeSessions,
        sessionsLast24h,
        sessionsLast7d,
        deviceBreakdown,
        countryBreakdown
      ] = await Promise.all([
        prisma.userSession.count(),
        prisma.userSession.count({
          where: { endedAt: null }
        }),
        prisma.userSession.count({
          where: { startedAt: { gte: last24Hours } }
        }),
        prisma.userSession.count({
          where: { startedAt: { gte: last7Days } }
        }),
        prisma.userSession.groupBy({
          by: ['deviceType'],
          _count: true,
          where: { startedAt: { gte: last7Days } }
        }),
        prisma.userSession.groupBy({
          by: ['countryCode'],
          _count: true,
          where: { 
            startedAt: { gte: last7Days },
            countryCode: { not: null }
          },
          orderBy: { _count: { countryCode: 'desc' } },
          take: ANALYTICS_CONFIG.TOP_COUNTRIES_LIMIT
        })
      ])
      
      return NextResponse.json({
        summary: {
          totalSessions,
          activeSessions,
          sessionsLast24h,
          sessionsLast7d
        },
        deviceBreakdown: deviceBreakdown.reduce((acc, item) => {
          acc[item.deviceType] = item._count
          return acc
        }, {} as Record<string, number>),
        countryBreakdown: countryBreakdown.reduce((acc, item) => {
          if (item.countryCode) {
            acc[item.countryCode] = item._count
          }
          return acc
        }, {} as Record<string, number>)
      })
    }
    
  } catch (error) {
    console.error('Session retrieval error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}