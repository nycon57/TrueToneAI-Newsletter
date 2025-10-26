'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Video,
  Mail,
  Share2,
  Bot,
  Copy,
  CheckIcon,
  ChevronDown,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type ActionType = 'video' | 'email' | 'social' | 'ai';

interface SocialContent {
  facebook: string;
  linkedin: string;
  twitter: string;
  instagram: string;
}

export interface PersonalizationActionCardProps {
  type: ActionType;
  content: string | SocialContent | null;
  articleId?: string;
  postId?: string;
}

export function PersonalizationActionCard({
  type,
  content,
  articleId,
  postId,
}: PersonalizationActionCardProps) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPersonalized, setIsPersonalized] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [personalizedContent, setPersonalizedContent] = useState<string | null>(null);

  // Get card configuration based on type
  const getCardConfig = () => {
    switch (type) {
      case 'video':
        return {
          icon: Video,
          title: 'Video Script',
          description: 'Ready-to-record script',
          color: 'from-red-500 to-pink-500',
          bgColor: 'bg-red-50 hover:bg-red-100',
          borderColor: 'border-red-200 hover:border-red-300',
          badgeColor: 'bg-red-100 text-red-700',
        };
      case 'email':
        return {
          icon: Mail,
          title: 'Email Template',
          description: 'Send to your clients',
          color: 'from-green-500 to-emerald-500',
          bgColor: 'bg-green-50 hover:bg-green-100',
          borderColor: 'border-green-200 hover:border-green-300',
          badgeColor: 'bg-green-100 text-green-700',
        };
      case 'social':
        return {
          icon: Share2,
          title: 'Social Posts',
          description: 'Multi-platform content',
          color: 'from-purple-500 to-pink-500',
          bgColor: 'bg-purple-50 hover:bg-purple-100',
          borderColor: 'border-purple-200 hover:border-purple-300',
          badgeColor: 'bg-purple-100 text-purple-700',
        };
      case 'ai':
        return {
          icon: Bot,
          title: 'AI Personalization',
          description: 'Customize with AI',
          color: 'from-indigo to-orchid',
          bgColor: 'bg-lavender/30 hover:bg-lavender/50',
          borderColor: 'border-lavender/50 hover:border-lavender',
          badgeColor: 'bg-lavender/30 text-orchid',
        };
    }
  };

  const config = getCardConfig();
  const IconComponent = config.icon;

  const handleCopy = async () => {
    try {
      const textToCopy =
        personalizedContent || (typeof content === 'string' ? content : JSON.stringify(content));

      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      toast.success(`${config.title} copied to clipboard!`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handlePersonalize = async () => {
    setIsGenerating(true);

    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsPersonalized(true);
    setPersonalizedContent(
      `[AI Personalized] ${typeof content === 'string' ? content : 'Generated content'}`
    );
    setIsGenerating(false);
    setIsExpanded(true);
    toast.success('Content personalized!');
  };

  const handleRegenerate = async () => {
    setIsGenerating(true);

    // Simulate AI regeneration
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setPersonalizedContent(
      `[AI Regenerated] ${typeof content === 'string' ? content : 'Regenerated content'}`
    );
    setIsGenerating(false);
    toast.success('Content regenerated!');
  };

  return (
    <Card
      className={cn(
        'border-2 transition-all duration-200 overflow-hidden',
        config.borderColor,
        isExpanded && 'ring-2 ring-offset-2',
        isExpanded && type === 'video' && 'ring-red-200',
        isExpanded && type === 'email' && 'ring-green-200',
        isExpanded && type === 'social' && 'ring-purple-200',
        isExpanded && type === 'ai' && 'ring-lavender/50'
      )}
    >
      <CardContent className={cn('p-4 transition-colors duration-200', config.bgColor)}>
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          {/* Icon */}
          <div
            className={cn(
              'flex-shrink-0 w-10 h-10 rounded-xl',
              'flex items-center justify-center',
              `bg-gradient-to-r ${config.color}`,
              'shadow-sm'
            )}
          >
            <IconComponent className="w-5 h-5 text-white" />
          </div>

          {/* Title & Description */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-gray-900 mb-0.5">{config.title}</h3>
            <p className="text-xs text-gray-600">{config.description}</p>
          </div>

          {/* Status Badge */}
          {isPersonalized && (
            <Badge className={cn('text-xs px-2 py-0.5 border-0', config.badgeColor)}>
              <Sparkles className="w-3 h-3 mr-1" />
              AI
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {type === 'ai' || !content ? (
            // AI Personalization Button
            <Button
              onClick={handlePersonalize}
              disabled={isGenerating}
              className={cn(
                'flex-1 h-9 text-xs font-medium',
                `bg-gradient-to-r ${config.color}`,
                'text-white shadow-sm hover:shadow-md',
                'transition-all duration-200'
              )}
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Bot className="w-4 h-4 mr-2" />
                  Personalize
                </>
              )}
            </Button>
          ) : (
            <>
              {/* Copy Button */}
              <Button
                onClick={handleCopy}
                variant="outline"
                className={cn(
                  'flex-1 h-9 text-xs font-medium',
                  'border-gray-300 hover:bg-white',
                  'transition-all duration-200',
                  copied && 'bg-green-50 border-green-500 text-green-700'
                )}
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.span
                      key="copied"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="flex items-center"
                    >
                      <CheckIcon className="w-4 h-4 mr-1.5" />
                      Copied!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="copy"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="flex items-center"
                    >
                      <Copy className="w-4 h-4 mr-1.5" />
                      Copy
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>

              {/* Personalize Button */}
              <Button
                onClick={handlePersonalize}
                disabled={isGenerating}
                className={cn(
                  'h-9 px-3 text-xs font-medium',
                  `bg-gradient-to-r ${config.color}`,
                  'text-white shadow-sm hover:shadow-md',
                  'transition-all duration-200'
                )}
              >
                {isGenerating ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
              </Button>
            </>
          )}

          {/* Expand Button */}
          {content && (
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 hover:bg-white/80"
            >
              <ChevronDown
                className={cn(
                  'w-4 h-4 transition-transform duration-200',
                  isExpanded && 'rotate-180'
                )}
              />
            </Button>
          )}
        </div>

        {/* Expanded Content Preview */}
        <AnimatePresence>
          {isExpanded && (content || personalizedContent) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-gray-200">
                {/* Content Preview */}
                <div className="bg-white rounded-lg p-3 mb-3 border border-gray-200 max-h-40 overflow-y-auto">
                  <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {personalizedContent ||
                      (typeof content === 'string'
                        ? content.slice(0, 300) + (content.length > 300 ? '...' : '')
                        : 'Social media content available')}
                  </p>
                </div>

                {/* Regenerate Button (if personalized) */}
                {isPersonalized && (
                  <Button
                    onClick={handleRegenerate}
                    disabled={isGenerating}
                    variant="outline"
                    size="sm"
                    className="w-full h-8 text-xs border-gray-300 hover:bg-white"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-3 h-3 border-2 border-gray-400 border-t-gray-700 rounded-full animate-spin mr-2" />
                        Regenerating...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-3 h-3 mr-2" />
                        Regenerate
                      </>
                    )}
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
