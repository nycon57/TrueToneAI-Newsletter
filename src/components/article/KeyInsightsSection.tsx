'use client';

import { useState } from 'react';
import { CheckIcon, Lightbulb } from 'lucide-react';
import { CopyButton } from './CopyButton';
import { AIGenerationPanel } from '@/components/ai/AIGenerationPanel';
import { EditableKeyInsights } from './EditableKeyInsights';
import { updateKeyInsights, handleGenerationUpdateError } from '@/lib/api/generations-client';
import { toast } from 'sonner';
import type { ContentSectionProps } from './types';

export function KeyInsightsSection({
  article,
  isAuthenticated,
  isPaid,
  generationStats,
  cachedContent,
  onGenerationSave,
  onGenerationComplete,
}: ContentSectionProps) {
  const [isRegenerating, setIsRegenerating] = useState(false);

  const defaultInsights = article.defaultKeyInsights || article.keyInsights || [];
  const defaultInsightsText = defaultInsights.join('\n• ') || '';
  const fullDefaultInsightsText = `Key Insights:\n\n• ${defaultInsightsText}`;
  const generationId = article.generation_ids?.keyInsights;
  const hasGeneration = article.generation_stats?.hasKeyInsights && !isRegenerating;

  const handleSaveInsights = async (insights: string[]) => {
    if (!generationId) {
      toast.error('Cannot save: No generation ID found');
      return;
    }

    try {
      await updateKeyInsights(generationId, insights);
      toast.success('Key Insights saved successfully!');
    } catch (error) {
      const errorMessage = handleGenerationUpdateError(error);
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleRegenerate = () => {
    setIsRegenerating(true);
  };

  const handleGenerationCompleteLocal = () => {
    setIsRegenerating(false);
    onGenerationComplete();
  };

  return (
    <div className="mt-6 space-y-4">
      {/* Default Key Insights */}
      <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-50/50 rounded-xl border border-purple-200">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-purple-600" />
            <h4 className="font-bold text-gray-900">Default Key Insights</h4>
          </div>
          <CopyButton
            content={fullDefaultInsightsText}
            label="Insights"
            variant="default"
            className="bg-purple-600 hover:bg-purple-700 text-white"
          />
        </div>
        <div className="space-y-2">
          {defaultInsights.map((insight, idx) => (
            <div key={`insight-${idx}-${insight.slice(0, 20)}`} className="flex items-start gap-2">
              <CheckIcon className="h-4 w-4 text-purple-600 mt-1 flex-shrink-0" />
              <span className="text-sm text-gray-700">{insight}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Generation Panel */}
      {isAuthenticated && !hasGeneration && (
        <AIGenerationPanel
          articleId={article.id}
          contentType="key_insights"
          userTier={isPaid ? 'paid' : 'free'}
          remainingGenerations={generationStats.remaining}
          initialContent={cachedContent}
          hasExistingGeneration={article.generation_stats?.hasKeyInsights || false}
          onContentGenerated={(content) => onGenerationSave('key_insights', content)}
          onGenerationComplete={handleGenerationCompleteLocal}
        />
      )}

      {/* AI Generated Key Insights */}
      {isAuthenticated && hasGeneration && generationId && (
        <EditableKeyInsights
          insights={article.keyInsights || []}
          onSave={handleSaveInsights}
          onRegenerate={handleRegenerate}
          maxInsights={6}
          maxLength={500}
        />
      )}
    </div>
  );
}
