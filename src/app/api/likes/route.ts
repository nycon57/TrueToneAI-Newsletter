import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { ContentType, Device } from '@/generated/prisma';
import { 
  checkRateLimit, 
  getClientIdentifier, 
  RATE_LIMIT_CONFIGS,
  getRateLimitHeaders 
} from '@/lib/utils/rateLimit';

// Helper function to detect device type from user agent
function getDeviceType(headers: Headers): Device {
  const userAgent = headers.get('user-agent')?.toLowerCase() || '';
  
  if (/mobile|android|iphone|ipod/.test(userAgent)) {
    return 'MOBILE';
  } else if (/ipad|tablet/.test(userAgent)) {
    return 'TABLET';
  } else if (/windows|mac|linux/.test(userAgent)) {
    return 'DESKTOP';
  }
  
  return 'UNKNOWN';
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postId, contentId, contentType, contentTitle } = body;
    
    // Validate required fields
    if (!postId || !contentId || !contentType || !contentTitle) {
      return NextResponse.json(
        { error: 'Missing required fields: postId, contentId, contentType, contentTitle' },
        { status: 400 }
      );
    }
    
    // Validate contentType
    const validContentTypes: ContentType[] = [
      'ARTICLE',
      'KEY_INSIGHTS',
      'VIDEO_SCRIPT',
      'EMAIL_TEMPLATE',
      'SOCIAL_CONTENT'
    ];
    
    if (!validContentTypes.includes(contentType)) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400 }
      );
    }
    
    // Get user ID from the request (in a real app, this would come from auth)
    // For now, we'll use the userId from the body or a header
    const userId = body.userId || request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User authentication required' },
        { status: 401 }
      );
    }
    
    // Rate limiting
    const clientId = getClientIdentifier(request, `likes:${userId}`)
    
    if (!checkRateLimit(clientId, RATE_LIMIT_CONFIGS.LIKES)) {
      const rateLimitHeaders = getRateLimitHeaders(clientId, RATE_LIMIT_CONFIGS.LIKES)
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { 
          status: 429,
          headers: rateLimitHeaders
        }
      );
    }
    
    // Get device type
    const deviceType = getDeviceType(request.headers);
    
    // Check if like already exists
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId_contentId_contentType: {
          userId,
          postId,
          contentId,
          contentType
        }
      }
    });
    
    let liked = false;
    let likeCount = 0;
    
    if (existingLike) {
      // Unlike - remove the like
      await prisma.like.delete({
        where: { id: existingLike.id }
      });
      liked = false;
    } else {
      // Like - create new like
      await prisma.like.create({
        data: {
          userId,
          postId,
          contentId,
          contentType,
          contentTitle,
          deviceType
        }
      });
      liked = true;
    }
    
    // Get updated count
    likeCount = await prisma.like.count({
      where: {
        postId,
        contentId,
        contentType
      }
    });
    
    return NextResponse.json({
      liked,
      count: likeCount
    });
    
  } catch (error) {
    console.error('Like API error:', error);
    
    if (error instanceof Error && error.message.includes('Foreign key constraint')) {
      return NextResponse.json(
        { error: 'Invalid user or post ID' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch like stats (optional)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    
    if (!postId) {
      return NextResponse.json(
        { error: 'postId parameter is required' },
        { status: 400 }
      );
    }
    
    // Get like statistics
    const stats = await prisma.like.groupBy({
      by: ['contentId', 'contentType'],
      where: { postId },
      _count: true
    });
    
    const formattedStats = stats.map(stat => ({
      contentId: stat.contentId,
      contentType: stat.contentType,
      count: stat._count
    }));
    
    return NextResponse.json({
      postId,
      stats: formattedStats,
      total: formattedStats.reduce((sum, stat) => sum + stat.count, 0)
    });
    
  } catch (error) {
    console.error('Like stats API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}