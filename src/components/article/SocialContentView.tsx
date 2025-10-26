'use client';

import { motion } from 'motion/react';
import { Share2 } from 'lucide-react';
import { SocialMediaGenerationPanel } from '@/components/ai/SocialMediaGenerationPanel';

interface SocialContentViewProps {
  articleId: string;
  initialResults?: any;
  userTier?: 'free' | 'paid' | 'premium';
  remainingGenerations?: number;
  onContentGenerated?: (results: any) => void;
}

export function SocialContentView({
  articleId,
  initialResults,
  userTier = 'free',
  remainingGenerations = 3,
  onContentGenerated,
}: SocialContentViewProps) {
  return (
    <div className="h-full overflow-y-auto scroll-smooth">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-sm">
              <Share2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Social Media Posts
              </h2>
              <p className="text-gray-600 mt-1">
                Generate platform-specific social media content
              </p>
            </div>
          </div>
        </motion.div>

        {/* AI Generation Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <SocialMediaGenerationPanel
            articleId={articleId}
            userTier={userTier}
            remainingGenerations={remainingGenerations}
            initialResults={initialResults}
            onContentGenerated={onContentGenerated}
          />
        </motion.div>

        {/* Bottom Spacing for sticky footer */}
        <div className="h-20" />
      </div>
    </div>
  );
}
