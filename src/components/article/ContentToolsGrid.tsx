'use client';

import { Lightbulb, Video, Mail, Share2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Article } from './types';

export type ContentSection = 'insights' | 'video' | 'email' | 'social' | null;

interface ContentToolsGridProps {
  article: Article;
  activeSection: ContentSection;
  onSectionChange: (section: ContentSection) => void;
}

export function ContentToolsGrid({
  article,
  activeSection,
  onSectionChange,
}: ContentToolsGridProps) {
  const toggleSection = (section: ContentSection) => {
    onSectionChange(activeSection === section ? null : section);
  };

  return (
    <div className="border-t border-gray-200 -mx-6 px-6 pt-6 mt-6 bg-gray-50/50">
      <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
        Content Tools
      </h4>
      <div className="grid grid-cols-2 gap-3">
        {article.keyInsights && article.keyInsights.length > 0 && (
          <Button
            onClick={() => toggleSection('insights')}
            variant={activeSection === 'insights' ? 'default' : 'outline'}
            className={cn(
              "h-auto py-4 px-4 flex-col items-start gap-1.5 relative",
              activeSection === 'insights'
                ? "bg-purple-600 hover:bg-purple-700 text-white border-purple-600"
                : "bg-white hover:bg-purple-50 border-gray-300"
            )}
          >
            {article.generation_stats?.hasKeyInsights && (
              <Sparkles className="absolute top-2 right-2 h-3.5 w-3.5 text-amber-500" />
            )}
            <Lightbulb className={cn("h-5 w-5", activeSection === 'insights' ? "text-white" : "text-purple-600")} />
            <span className={cn("text-sm font-semibold", activeSection === 'insights' ? "text-white" : "text-gray-900")}>
              Key Insights
            </span>
          </Button>
        )}

        {article.videoScript && (
          <Button
            onClick={() => toggleSection('video')}
            variant={activeSection === 'video' ? 'default' : 'outline'}
            className={cn(
              "h-auto py-4 px-4 flex-col items-start gap-1.5 relative",
              activeSection === 'video'
                ? "bg-red-600 hover:bg-red-700 text-white border-red-600"
                : "bg-white hover:bg-red-50 border-gray-300"
            )}
          >
            {article.generation_stats?.hasVideoScript && (
              <Sparkles className="absolute top-2 right-2 h-3.5 w-3.5 text-amber-500" />
            )}
            <Video className={cn("h-5 w-5", activeSection === 'video' ? "text-white" : "text-red-600")} />
            <span className={cn("text-sm font-semibold", activeSection === 'video' ? "text-white" : "text-gray-900")}>
              Video Script
            </span>
          </Button>
        )}

        {article.emailTemplate && (
          <Button
            onClick={() => toggleSection('email')}
            variant={activeSection === 'email' ? 'default' : 'outline'}
            className={cn(
              "h-auto py-4 px-4 flex-col items-start gap-1.5 relative",
              activeSection === 'email'
                ? "bg-green-600 hover:bg-green-700 text-white border-green-600"
                : "bg-white hover:bg-green-50 border-gray-300"
            )}
          >
            {article.generation_stats?.hasEmailTemplate && (
              <Sparkles className="absolute top-2 right-2 h-3.5 w-3.5 text-amber-500" />
            )}
            <Mail className={cn("h-5 w-5", activeSection === 'email' ? "text-white" : "text-green-600")} />
            <span className={cn("text-sm font-semibold", activeSection === 'email' ? "text-white" : "text-gray-900")}>
              Email Template
            </span>
          </Button>
        )}

        {article.socialContent && (
          <Button
            onClick={() => toggleSection('social')}
            variant={activeSection === 'social' ? 'default' : 'outline'}
            className={cn(
              "h-auto py-4 px-4 flex-col items-start gap-1.5 relative",
              activeSection === 'social'
                ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                : "bg-white hover:bg-blue-50 border-gray-300"
            )}
          >
            {article.generation_stats?.hasSocialMedia && (
              <Sparkles className="absolute top-2 right-2 h-3.5 w-3.5 text-amber-500" />
            )}
            <Share2 className={cn("h-5 w-5", activeSection === 'social' ? "text-white" : "text-blue-600")} />
            <span className={cn("text-sm font-semibold", activeSection === 'social' ? "text-white" : "text-gray-900")}>
              Social Media
            </span>
          </Button>
        )}
      </div>
    </div>
  );
}
