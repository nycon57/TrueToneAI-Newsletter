'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';
import { CopyButton } from './CopyButton';
import { AIGenerationPanel } from '@/components/ai/AIGenerationPanel';
import { EditableContentSection } from './EditableContentSection';
import { updateEmailTemplate, handleGenerationUpdateError } from '@/lib/api/generations-client';
import { toast } from 'sonner';
import type { ContentSectionProps } from './types';

export function EmailTemplateSection({
  article,
  isAuthenticated,
  isPaid,
  generationStats,
  cachedContent,
  onGenerationSave,
  onGenerationComplete,
}: ContentSectionProps) {
  const [isRegenerating, setIsRegenerating] = useState(false);

  const defaultEmail = article.defaultEmailTemplate || article.emailTemplate || '';
  const generationId = article.generation_ids?.emailTemplate;
  const hasGeneration = article.generation_stats?.hasEmailTemplate && !isRegenerating;

  const handleSaveEmailTemplate = async (content: string) => {
    if (!generationId) {
      toast.error('Cannot save: No generation ID found');
      return;
    }

    try {
      await updateEmailTemplate(generationId, content);
      toast.success('Email Template saved successfully!');
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
      {/* Default Email Template */}
      <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50/50 rounded-xl border border-green-200">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-green-700" />
            <h4 className="font-bold text-gray-900">Default Email Template</h4>
          </div>
          <CopyButton
            content={defaultEmail}
            label="Email"
            variant="default"
            className="bg-green-600 hover:bg-green-700 text-white"
          />
        </div>
        <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
          {defaultEmail}
        </div>
      </div>

      {/* AI Generation Panel */}
      {isAuthenticated && !hasGeneration && (
        <AIGenerationPanel
          articleId={article.id}
          contentType="email_template"
          userTier={isPaid ? 'paid' : 'free'}
          remainingGenerations={generationStats.remaining}
          initialContent={cachedContent}
          hasExistingGeneration={article.generation_stats?.hasEmailTemplate || false}
          onContentGenerated={(content) => onGenerationSave('email_template', content)}
          onGenerationComplete={handleGenerationCompleteLocal}
        />
      )}

      {/* AI Generated Email Template */}
      {isAuthenticated && hasGeneration && generationId && (
        <EditableContentSection
          title="AI Generated Content"
          content={article.emailTemplate || ''}
          onSave={handleSaveEmailTemplate}
          onRegenerate={handleRegenerate}
          icon={Mail}
          iconColor="text-green-700"
          bgColor="from-green-50 to-emerald-50/50"
          borderColor="border-green-200"
          buttonColor="bg-green-600 hover:bg-green-700"
          multiline={true}
          contentType="email_template"
        />
      )}
    </div>
  );
}
