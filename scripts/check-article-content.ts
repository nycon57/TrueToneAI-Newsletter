import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function checkArticleContent() {
  try {
    // Get all articles with their content information
    const articles = await prisma.article.findMany({
      select: {
        id: true,
        title: true,
        content: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Analyze the results
    const totalArticles = articles.length;
    const articlesWithContent = articles.filter(
      (a) => a.content !== null && a.content !== ''
    );
    const articlesWithoutContent = articles.filter(
      (a) => a.content === null || a.content === ''
    );

    console.log('\n=== ARTICLE CONTENT ANALYSIS ===\n');
    console.log(`Total articles: ${totalArticles}`);
    console.log(`Articles with content: ${articlesWithContent.length}`);
    console.log(`Articles without content: ${articlesWithoutContent.length}`);

    // Show articles without content
    if (articlesWithoutContent.length > 0) {
      console.log('\n=== ARTICLES WITHOUT CONTENT ===\n');
      articlesWithoutContent.forEach((article, index) => {
        console.log(`${index + 1}. ID: ${article.id}`);
        console.log(`   Title: ${article.title}`);
        console.log('');
      });
    }

    // Show sample content from articles that have it (first 3)
    if (articlesWithContent.length > 0) {
      console.log('\n=== SAMPLE CONTENT FROM ARTICLES ===\n');
      const samplesToShow = Math.min(3, articlesWithContent.length);

      for (let i = 0; i < samplesToShow; i++) {
        const article = articlesWithContent[i];
        console.log(`${i + 1}. ID: ${article.id}`);
        console.log(`   Title: ${article.title}`);
        console.log(`   Content length: ${article.content?.length || 0} characters`);
        console.log(`   Content preview (first 200 chars):`);
        console.log(`   ${article.content?.substring(0, 200)}\n`);
        console.log('');
      }
    }

    // Show detailed breakdown
    console.log('\n=== DETAILED BREAKDOWN ===\n');
    articles.forEach((article, index) => {
      const hasContent = article.content !== null && article.content !== '';
      const contentLength = article.content?.length || 0;

      console.log(`${index + 1}. ${article.title}`);
      console.log(`   ID: ${article.id}`);
      console.log(`   Has Content: ${hasContent ? 'YES' : 'NO'}`);
      console.log(`   Content Length: ${contentLength} characters`);
      console.log('');
    });

  } catch (error) {
    console.error('Error checking article content:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkArticleContent();
