'use client';

import { motion } from 'motion/react';
import { Mail } from 'lucide-react';
import { AIGenerationPanel } from '@/components/ai/AIGenerationPanel';

interface EmailContentViewProps {
  articleId: string;
  initialContent?: string;
  hasExistingGeneration?: boolean;
  userTier?: 'free' | 'paid' | 'premium';
  remainingGenerations?: number;
  onContentGenerated?: (content: string) => void;
}

export function EmailContentView({
  articleId,
  initialContent,
  hasExistingGeneration = false,
  userTier = 'free',
  remainingGenerations = 3,
  onContentGenerated,
}: EmailContentViewProps) {
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
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-sm">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Email Template
              </h2>
              <p className="text-gray-600 mt-1">
                Create personalized email templates for your clients
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
          <AIGenerationPanel
            articleId={articleId}
            contentType="email_template"
            userTier={userTier}
            remainingGenerations={remainingGenerations}
            initialContent={initialContent}
            hasExistingGeneration={hasExistingGeneration}
            onContentGenerated={onContentGenerated}
          />
        </motion.div>

        {/* Bottom Spacing for sticky footer */}
        <div className="h-20" />
      </div>
    </div>
  );
}
