'use client';

import { motion } from 'motion/react';
import { Video, Mail, Share2, Bot, Sparkles, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type ContentView = 'article' | 'video' | 'email' | 'social' | 'ai';

interface ArticleStickyFooterProps {
  activeView: ContentView;
  onViewChange: (view: ContentView) => void;
  hasVideo?: boolean;
  hasEmail?: boolean;
  hasSocial?: boolean;
  hasAIGenerated?: {
    video?: boolean;
    email?: boolean;
    social?: boolean;
  };
  className?: string;
}

export function ArticleStickyFooter({
  activeView,
  onViewChange,
  hasVideo = true,
  hasEmail = true,
  hasSocial = true,
  hasAIGenerated,
  className,
}: ArticleStickyFooterProps) {
  const actions = [
    {
      id: 'article' as ContentView,
      label: 'Article',
      icon: BookOpen,
      color: 'text-gray-700',
      bgColor: 'bg-gray-100',
      hoverColor: 'hover:bg-gray-200',
      activeColor: 'bg-gray-900 text-white hover:bg-gray-800',
      show: true,
    },
    {
      id: 'video' as ContentView,
      label: 'Video',
      icon: Video,
      color: 'text-red-700',
      bgColor: 'bg-red-50',
      hoverColor: 'hover:bg-red-100',
      activeColor: 'bg-gradient-to-r from-red-500 to-pink-500 text-white',
      hasAI: hasAIGenerated?.video,
      show: hasVideo,
    },
    {
      id: 'email' as ContentView,
      label: 'Email',
      icon: Mail,
      color: 'text-green-700',
      bgColor: 'bg-green-50',
      hoverColor: 'hover:bg-green-100',
      activeColor: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
      hasAI: hasAIGenerated?.email,
      show: hasEmail,
    },
    {
      id: 'social' as ContentView,
      label: 'Social',
      icon: Share2,
      color: 'text-purple-700',
      bgColor: 'bg-purple-50',
      hoverColor: 'hover:bg-purple-100',
      activeColor: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
      hasAI: hasAIGenerated?.social,
      show: hasSocial,
    },
    {
      id: 'ai' as ContentView,
      label: 'AI Personalize',
      icon: Bot,
      color: 'text-orchid',
      bgColor: 'bg-lavender/30',
      hoverColor: 'hover:bg-lavender/50',
      activeColor: 'bg-gradient-to-r from-indigo to-orchid text-white',
      show: true,
    },
  ];

  return (
    <div
      className={cn(
        'sticky bottom-0 left-0 right-0 z-10',
        'bg-white/95 backdrop-blur-lg',
        'border-t border-gray-200',
        'shadow-[0_-4px_16px_rgba(0,0,0,0.08)]',
        className
      )}
    >
      <div className="px-4 sm:px-6 py-4">
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
          {actions.filter(action => action.show).map((action) => {
            const Icon = action.icon;
            const isActive = activeView === action.id;

            return (
              <Button
                key={action.id}
                onClick={() => onViewChange(action.id)}
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                className={cn(
                  'relative gap-2 transition-all duration-200',
                  isActive ? action.activeColor : `${action.bgColor} ${action.color} ${action.hoverColor} border-transparent`,
                  'shadow-sm hover:shadow-md',
                  'font-medium'
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{action.label}</span>
                <span className="sm:hidden">{action.label.split(' ')[0]}</span>

                {action.hasAI && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1"
                  >
                    <Badge className="h-4 w-4 p-0 flex items-center justify-center bg-amber-500 border-0 rounded-full">
                      <Sparkles className="h-2.5 w-2.5 text-white" />
                    </Badge>
                  </motion.div>
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
