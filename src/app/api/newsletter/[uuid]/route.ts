import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { randomUUID } from 'crypto';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    const { uuid } = await params;
    const { searchParams } = new URL(request.url);
    const userUuid = searchParams.get('u');

    if (!uuid) {
      return NextResponse.json(
        { error: 'Article UUID is required' },
        { status: 400 }
      );
    }

    if (!userUuid) {
      return NextResponse.json(
        { error: 'User UUID is required' },
        { status: 400 }
      );
    }

    // Fetch user data
    const user = await prisma.user.findUnique({
      where: { id: userUuid },
      select: { 
        firstName: true,
        name: true 
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Fetch post data by UUID
    const post = await prisma.post.findFirst({
      where: { 
        id: uuid,
        publishedStatus: 'PUBLISHED'
      },
      select: { 
        id: true,
        title: true,
        content: true,
        publishedAt: true
      }
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Newsletter not found or not published' },
        { status: 404 }
      );
    }

    // Parse the JSONB content to extract article data
    const content = post.content as {
      articles?: Array<{
        id?: string;
        contentID?: string;
        title: string;
        summary: string;
        position: number;
        content_type: string;
        article_topic?: string;
        key_insights?: string[];
        video_script?: string;
        email_template?: string;
        social_content?: {
          facebook?: string;
          linkedin?: string;
          twitter?: string;
          instagram?: string;
        };
        value_props?: Array<{
          icon: string;
          position: number;
          heading: string;
          description: string;
        }>;
        cta?: {
          text: string;
          url: string;
        };
      }>;
    };
    const articles = content.articles || [];

    // Optimize: Fetch user likes and like counts in parallel to eliminate N+1 query
    const [userLikes, likeCounts] = await Promise.all([
      prisma.like.findMany({
        where: {
          userId: userUuid,
          postId: post.id
        },
        select: {
          contentId: true,
          contentType: true
        }
      }),
      prisma.like.groupBy({
        by: ['contentId'],
        where: {
          postId: post.id
        },
        _count: true
      })
    ]);

    // Convert like counts to a map for easy access
    const likeCountsMap = likeCounts.reduce((acc, item) => {
      acc[item.contentId] = item._count;
      return acc;
    }, {} as Record<string, number>);

    // Transform the data to match the expected response structure
    const response = {
      user: {
        firstName: user.firstName || user.name?.split(' ')[0] || 'Friend'
      },
      newsletter: {
        id: post.id,
        title: post.title,
        publishedAt: post.publishedAt,
        articles: articles.map((article) => ({
          id: article.id || randomUUID(),
          contentID: article.contentID || article.id || randomUUID(),
          title: article.title,
          summary: article.summary,
          position: article.position,
          contentType: article.content_type,
          articleTopic: article.article_topic,
          keyInsights: article.key_insights || [],
          videoScript: article.video_script,
          emailTemplate: article.email_template,
          socialContent: {
            facebook: article.social_content?.facebook || '',
            linkedin: article.social_content?.linkedin || '',
            twitter: article.social_content?.twitter || '',
            instagram: article.social_content?.instagram || ''
          },
          // Ad-specific fields
          valueProps: article.value_props || [],
          cta: article.cta || null
        })),
        // Include user's likes and like counts
        userLikes: userLikes,
        likeCounts: likeCountsMap
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Newsletter API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}