/**
 * Migration Script: PersonalizedOutput → Generation
 *
 * Transforms existing PersonalizedOutput records into separate Generation records
 * for better querying and filtering capabilities.
 *
 * Each PersonalizedOutput record can have:
 * - personalizedKeyInsights (array) → 1 Generation record (KEY_INSIGHTS)
 * - personalizedVideoScript (string) → 1 Generation record (VIDEO_SCRIPT)
 * - personalizedEmailTemplate (string) → 1 Generation record (EMAIL_TEMPLATE)
 * - personalizedSocialContent (object) → 1-4 Generation records (SOCIAL_MEDIA)
 *
 * Usage:
 *   DIRECT_URL="postgresql://..." npx tsx scripts/migrate-to-generations.ts [--dry-run]
 */

import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DIRECT_URL
});

interface SocialContent {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
}

interface MigrationStats {
  totalPersonalizedOutputs: number;
  totalGenerationsCreated: number;
  byType: Record<string, number>;
  errors: Array<{ id: string; error: string }>;
}

const stats: MigrationStats = {
  totalPersonalizedOutputs: 0,
  totalGenerationsCreated: 0,
  byType: {
    KEY_INSIGHTS: 0,
    VIDEO_SCRIPT: 0,
    EMAIL_TEMPLATE: 0,
    SOCIAL_MEDIA: 0
  },
  errors: []
};

async function migratePersonalizedOutputs(dryRun: boolean = false) {
  console.log(`\n🚀 Starting migration ${dryRun ? '(DRY RUN)' : '(LIVE)'}\n`);

  try {
    // Fetch all PersonalizedOutput records
    const personalizedOutputs = await prisma.personalizedOutput.findMany({
      orderBy: { createdAt: 'asc' }
    });

    stats.totalPersonalizedOutputs = personalizedOutputs.length;
    console.log(`📊 Found ${personalizedOutputs.length} PersonalizedOutput records to migrate\n`);

    if (personalizedOutputs.length === 0) {
      console.log('✅ No records to migrate');
      return;
    }

    // Process each PersonalizedOutput record
    for (const po of personalizedOutputs) {
      console.log(`\n📝 Processing PersonalizedOutput: ${po.id}`);
      console.log(`   User: ${po.userId}, Article: ${po.articleId}`);

      const generationsToCreate = [];

      // 1. Migrate Key Insights (array)
      if (po.personalizedKeyInsights && po.personalizedKeyInsights.length > 0) {
        console.log(`   ✓ Found KEY_INSIGHTS (${po.personalizedKeyInsights.length} insights)`);
        generationsToCreate.push({
          id: undefined, // Let DB generate
          userId: po.userId,
          articleId: po.articleId,
          contentType: 'KEY_INSIGHTS' as const,
          platform: null,
          content: null,
          contentArray: po.personalizedKeyInsights,
          tokensUsed: po.tokensUsed,
          generatedAt: po.lastGeneratedAt || po.createdAt,
          truetoneSnapshot: po.truetoneSettings
        });
        stats.byType.KEY_INSIGHTS++;
      }

      // 2. Migrate Video Script (string)
      if (po.personalizedVideoScript && po.personalizedVideoScript.trim()) {
        console.log(`   ✓ Found VIDEO_SCRIPT`);
        generationsToCreate.push({
          id: undefined,
          userId: po.userId,
          articleId: po.articleId,
          contentType: 'VIDEO_SCRIPT' as const,
          platform: null,
          content: po.personalizedVideoScript,
          contentArray: [],
          tokensUsed: po.tokensUsed,
          generatedAt: po.lastGeneratedAt || po.createdAt,
          truetoneSnapshot: po.truetoneSettings
        });
        stats.byType.VIDEO_SCRIPT++;
      }

      // 3. Migrate Email Template (string)
      if (po.personalizedEmailTemplate && po.personalizedEmailTemplate.trim()) {
        console.log(`   ✓ Found EMAIL_TEMPLATE`);
        generationsToCreate.push({
          id: undefined,
          userId: po.userId,
          articleId: po.articleId,
          contentType: 'EMAIL_TEMPLATE' as const,
          platform: null,
          content: po.personalizedEmailTemplate,
          contentArray: [],
          tokensUsed: po.tokensUsed,
          generatedAt: po.lastGeneratedAt || po.createdAt,
          truetoneSnapshot: po.truetoneSettings
        });
        stats.byType.EMAIL_TEMPLATE++;
      }

      // 4. Migrate Social Content (object with platforms)
      if (po.personalizedSocialContent) {
        try {
          const socialContent = po.personalizedSocialContent as SocialContent;
          const platforms: Array<{ key: keyof SocialContent; enum: string }> = [
            { key: 'facebook', enum: 'FACEBOOK' },
            { key: 'instagram', enum: 'INSTAGRAM' },
            { key: 'twitter', enum: 'TWITTER' },
            { key: 'linkedin', enum: 'LINKEDIN' }
          ];

          for (const { key, enum: platformEnum } of platforms) {
            if (socialContent[key] && (socialContent[key] as string).trim()) {
              console.log(`   ✓ Found SOCIAL_MEDIA (${platformEnum})`);
              generationsToCreate.push({
                id: undefined,
                userId: po.userId,
                articleId: po.articleId,
                contentType: 'SOCIAL_MEDIA' as const,
                platform: platformEnum,
                content: socialContent[key] as string,
                contentArray: [],
                tokensUsed: po.tokensUsed ? Math.floor(po.tokensUsed / 4) : null, // Divide tokens among platforms
                generatedAt: po.lastGeneratedAt || po.createdAt,
                truetoneSnapshot: po.truetoneSettings
              });
              stats.byType.SOCIAL_MEDIA++;
            }
          }
        } catch (error) {
          console.error(`   ❌ Error parsing social content for ${po.id}:`, error);
          stats.errors.push({
            id: po.id,
            error: `Failed to parse social content: ${error}`
          });
        }
      }

      // Create Generation records
      if (generationsToCreate.length > 0) {
        console.log(`   📦 Creating ${generationsToCreate.length} Generation records`);

        if (!dryRun) {
          try {
            await prisma.generation.createMany({
              data: generationsToCreate
            });
            stats.totalGenerationsCreated += generationsToCreate.length;
            console.log(`   ✅ Successfully created ${generationsToCreate.length} generations`);
          } catch (error) {
            console.error(`   ❌ Error creating generations for ${po.id}:`, error);
            stats.errors.push({
              id: po.id,
              error: `Failed to create generations: ${error}`
            });
          }
        } else {
          stats.totalGenerationsCreated += generationsToCreate.length;
          console.log(`   ✅ [DRY RUN] Would create ${generationsToCreate.length} generations`);
        }
      } else {
        console.log(`   ⚠️  No content found to migrate`);
      }
    }

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 MIGRATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total PersonalizedOutputs processed: ${stats.totalPersonalizedOutputs}`);
    console.log(`Total Generations created: ${stats.totalGenerationsCreated}`);
    console.log(`\nBreakdown by type:`);
    console.log(`  - KEY_INSIGHTS: ${stats.byType.KEY_INSIGHTS}`);
    console.log(`  - VIDEO_SCRIPT: ${stats.byType.VIDEO_SCRIPT}`);
    console.log(`  - EMAIL_TEMPLATE: ${stats.byType.EMAIL_TEMPLATE}`);
    console.log(`  - SOCIAL_MEDIA: ${stats.byType.SOCIAL_MEDIA}`);

    if (stats.errors.length > 0) {
      console.log(`\n❌ Errors encountered: ${stats.errors.length}`);
      stats.errors.forEach(err => {
        console.log(`  - ${err.id}: ${err.error}`);
      });
    } else {
      console.log(`\n✅ No errors encountered`);
    }

    if (dryRun) {
      console.log(`\n⚠️  This was a DRY RUN - no data was actually migrated`);
      console.log(`   Run without --dry-run to perform the migration`);
    } else {
      console.log(`\n✅ Migration completed successfully!`);
      console.log(`   PersonalizedOutput records are preserved as backup`);
    }

  } catch (error) {
    console.error('\n❌ Fatal error during migration:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');

// Run migration
migratePersonalizedOutputs(dryRun).catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
