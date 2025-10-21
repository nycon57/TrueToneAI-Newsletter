'use client';

import { motion } from 'motion/react';
import { FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ArticleCard } from '@/components/article/ArticleCard';
import { UpgradePrompt } from '@/components/upgrade/UpgradePrompt';

interface Article {
  id: string;
  title: string;
  summary: string;
  content_type: string;
  industry?: string;
  category?: string;
  tags?: string[];
  keyInsights?: string[];
  videoScript?: string;
  emailTemplate?: string;
  socialContent?: {
    facebook: string;
    linkedin: string;
    twitter: string;
    instagram: string;
  };
  is_personalized: boolean;
  tier: string;
  is_saved?: boolean;
  published_at: string;
}

interface ArticlesListProps {
  articles: Article[];
  isAuthenticated: boolean;
  isFreeUser: boolean;
}

/**
 * Client component for rendering articles with animations
 * Receives data from server component parent
 */
export function ArticlesList({ articles, isAuthenticated, isFreeUser }: ArticlesListProps) {
  if (articles.length === 0) {
    return (
      <Card className="shadow-lg border-0">
        <CardContent className="p-8 text-center">
          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No articles available</h3>
          <p className="text-gray-600">Check back later for new content.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {articles.map((article, index) => (
        <motion.div
          key={article.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.15 }}
        >
          <ArticleCard
            article={article}
            isAuthenticated={isAuthenticated}
            isPaid={!isFreeUser}
          />
        </motion.div>
      ))}

      {/* Show upgrade prompt after 3rd article for free users */}
      {isFreeUser && articles.length >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          <UpgradePrompt />
        </motion.div>
      )}
    </>
  );
}
