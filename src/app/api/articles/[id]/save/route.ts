import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();

    if (!kindeUser || !kindeUser.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const params = await context.params;
    const articleId = params.id;

    const body = await request.json();
    const { action } = body;

    if (!['save', 'unsave'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "save" or "unsave"' },
        { status: 400 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { kindeId: kindeUser.id },
      select: {
        id: true,
        savedArticleIds: true,
        subscriptionTier: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Only paid users can save articles
    if (user.subscriptionTier === 'FREE') {
      return NextResponse.json(
        { error: 'Upgrade required to save articles' },
        { status: 403 }
      );
    }

    // Verify article exists and is published
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: { id: true, status: true },
    });

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // Only allow saving published articles
    if (article.status !== 'PUBLISHED') {
      return NextResponse.json(
        { error: 'Cannot save unpublished articles' },
        { status: 400 }
      );
    }

    const currentSavedIds = user.savedArticleIds || [];
    const isSaved = currentSavedIds.includes(articleId);

    let newSavedIds: string[];

    if (action === 'save') {
      if (isSaved) {
        // Already saved, no change needed
        newSavedIds = currentSavedIds;
      } else {
        // Add to saved articles
        newSavedIds = [...currentSavedIds, articleId];
      }
    } else {
      // Remove from saved articles
      newSavedIds = currentSavedIds.filter((id: string) => id !== articleId);
    }

    // Update user's saved articles
    await prisma.user.update({
      where: { id: user.id },
      data: { savedArticleIds: newSavedIds },
    });

    // Count total saves for this article across all users
    const saveCount = await prisma.user.count({
      where: {
        savedArticleIds: {
          has: articleId,
        },
      },
    });

    return NextResponse.json({
      success: true,
      saved: action === 'save',
      saveCount,
      message: action === 'save'
        ? 'Article saved successfully'
        : 'Article removed from saved',
    });
  } catch (error) {
    console.error('[SAVE_ARTICLE_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to check if article is saved by current user
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();

    if (!kindeUser || !kindeUser.id) {
      return NextResponse.json(
        { saved: false, saveCount: 0 },
        { status: 200 }
      );
    }

    const params = await context.params;
    const articleId = params.id;

    const user = await prisma.user.findUnique({
      where: { kindeId: kindeUser.id },
      select: { savedArticleIds: true },
    });

    const isSaved = user?.savedArticleIds?.includes(articleId) || false;

    // Count total saves for this article across all users
    const saveCount = await prisma.user.count({
      where: {
        savedArticleIds: {
          has: articleId,
        },
      },
    });

    return NextResponse.json({
      saved: isSaved,
      saveCount,
    });
  } catch (error) {
    console.error('[GET_SAVED_ARTICLE_ERROR]', error);
    return NextResponse.json(
      { saved: false, saveCount: 0 },
      { status: 200 }
    );
  }
}
