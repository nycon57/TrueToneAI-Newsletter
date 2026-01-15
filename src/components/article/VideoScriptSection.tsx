'use client';

import { useState } from 'react';
import { Video } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CopyButton } from './CopyButton';
import { AIGenerationPanel } from '@/components/ai/AIGenerationPanel';
import { EditableContentSection } from './EditableContentSection';
import { updateVideoScript, handleGenerationUpdateError } from '@/lib/api/generations-client';
import { toast } from 'sonner';
import type { ContentSectionProps } from './types';

export function VideoScriptSection({
  article,
  isAuthenticated,
  isPaid,
  generationStats,
  cachedContent,
  onGenerationSave,
  onGenerationComplete,
}: ContentSectionProps) {
  const [isRegenerating, setIsRegenerating] = useState(false);

  const defaultScript = article.defaultVideoScript || article.videoScript || '';
  const generationId = article.generation_ids?.videoScript;
  const hasGeneration = article.generation_stats?.hasVideoScript && !isRegenerating;

  const handleSaveVideoScript = async (content: string) => {
    if (!generationId) {
      toast.error('Cannot save: No generation ID found');
      return;
    }

    try {
      await updateVideoScript(generationId, content);
      toast.success('Video Script saved successfully!');
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
      {/* Default Video Script */}
      <div className="p-6 bg-gradient-to-br from-red-50 to-red-50/50 rounded-xl border border-red-200">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Video className="h-5 w-5 text-red-600" />
            <h4 className="font-bold text-gray-900">Default Video Script</h4>
            <Badge className="bg-red-100 text-red-700 border-0 text-xs">30-60 sec</Badge>
          </div>
          <CopyButton
            content={defaultScript}
            label="Script"
            variant="default"
            className="bg-red-600 hover:bg-red-700 text-white"
          />
        </div>
        <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
          {defaultScript}
        </div>
      </div>

      {/* AI Generation Panel */}
      {isAuthenticated && !hasGeneration && (
        <AIGenerationPanel
          articleId={article.id}
          contentType="video_script"
          userTier={isPaid ? 'paid' : 'free'}
          remainingGenerations={generationStats.remaining}
          initialContent={cachedContent}
          hasExistingGeneration={article.generation_stats?.hasVideoScript || false}
          onContentGenerated={(content) => onGenerationSave('video_script', content)}
          onGenerationComplete={handleGenerationCompleteLocal}
        />
      )}

      {/* AI Generated Video Script */}
      {isAuthenticated && hasGeneration && generationId && (
        <EditableContentSection
          title="AI Generated Content"
          content={article.videoScript || ''}
          onSave={handleSaveVideoScript}
          onRegenerate={handleRegenerate}
          icon={Video}
          iconColor="text-red-600"
          bgColor="from-red-50 to-red-50/50"
          borderColor="border-red-200"
          buttonColor="bg-red-600 hover:bg-red-700"
          multiline={true}
          contentType="video_script"
        />
      )}
    </div>
  );
}
