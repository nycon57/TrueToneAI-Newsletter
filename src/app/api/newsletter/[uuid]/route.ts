import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
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

    const supabase = await createClient();

    // Fetch user data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('firstName, name')
      .eq('id', userUuid)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Fetch post data by UUID
    const { data: post, error: postError } = await supabase
      .from('newsletter_posts')
      .select('id, title, content, publishedAt')
      .eq('id', uuid)
      .eq('publishedStatus', 'PUBLISHED')
      .single();

    if (postError || !post) {
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
        title?: string;
        article_title?: string;
        summary?: string;
        article_summary?: string;
        position?: number;
        content_type?: string;
        article_topic?: string;
        key_insights?: string[] | null;
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

    // Like feature has been removed

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
          title: article.title || article.article_title || 'Untitled Article',
          summary: article.summary || article.article_summary || 'No summary available',
          position: article.position || 1,
          contentType: article.content_type || 'article',
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
        }))
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