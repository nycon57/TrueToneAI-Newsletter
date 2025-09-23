'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, CheckIcon, MessageCircle, X, Bot, Video, Mail, Share2, Lightbulb, Send, ChevronDown, Facebook, Instagram, Twitter, Linkedin, Zap, TrendingUp, Shield, FileText, Sparkles, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// Newsletter components
import { LikeButton } from '@/components/newsletter/like-button';
import type { ContentType } from '@/generated/prisma';

// Analytics components
import { AIChatAnalyticsWrapper, useAIChatWithAnalytics } from '@/components/analytics/ai-chat-wrapper';
import { useAnalytics } from '@/lib/analytics/hooks';
import { analytics } from '@/lib/analytics/service';

// Utility function
import { cn } from '@/lib/utils';

interface ValueProp {
  icon: string;
  position: number;
  heading: string;
  description: string;
}

interface CTA {
  text: string;
  url: string;
}

interface Article {
  id: string;
  contentID: string;
  title: string;
  summary: string;
  position: number;
  contentType: 'article' | 'ad';
  articleTopic?: string;
  keyInsights?: string[];
  videoScript?: string;
  emailTemplate?: string;
  socialContent?: {
    facebook: string;
    linkedin: string;
    twitter: string;
    instagram: string;
  };
  // Ad-specific fields
  valueProps?: ValueProp[];
  cta?: CTA;
}

interface NewsletterData {
  user: {
    firstName: string;
  };
  newsletter: {
    id: string;
    title: string;
    publishedAt: string;
    articles: Article[];
    userLikes: {
      contentId: string;
      contentType: ContentType;
    }[];
    likeCounts: {
      [contentId: string]: number;
    };
  };
}



interface CopyButtonProps {
  content: string;
  type: string;
  className?: string;
}

const CopyButton = ({ content, type, className }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success(`${type} copied to clipboard!`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  return (
    <Button
      onClick={handleCopy}
      variant="outline"
      size="sm"
      className={cn(
        "group relative overflow-hidden border-lavender/50 text-orchid hover:bg-lavender/20 hover:border-lavender transition-all duration-300 hover:shadow-sm",
        copied && "bg-green-50 border-green-500 text-green-700 hover:bg-green-100",
        className
      )}
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.div
            key="copied"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center"
          >
            <CheckIcon className="h-4 w-4 mr-2" />
            Copied!
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center"
          >
            <Copy className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
            Copy {type}
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
};

interface ArticleCardProps {
  article: Article;
  postId: string;
  userId?: string;
  userLikes: { contentId: string; contentType: ContentType }[];
  likeCounts: { [contentId: string]: number };
}

const ArticleCard = ({ article, postId, userId, userLikes, likeCounts }: ArticleCardProps) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Determine article icon based on type or content
  const getArticleIcon = () => {
    if (!article.title) return TrendingUp;

    const title = article.title.toLowerCase();
    if (title.includes('rate') || title.includes('fed')) {
      return TrendingUp;
    } else if (title.includes('fha') || title.includes('loan')) {
      return Shield;
    } else if (title.includes('credit') || title.includes('score')) {
      return FileText;
    }
    return TrendingUp;
  };

  const ArticleIcon = getArticleIcon();

  const sections = [];
  
  if (article.keyInsights && article.keyInsights.length > 0) {
    sections.push({
      id: 'insights',
      title: 'Key Insights',
      icon: Lightbulb,
      buttonClass: 'bg-lavender/20 hover:bg-lavender/30 text-orchid hover:text-indigo border-lavender/50 hover:border-lavender',
      activeButtonClass: 'bg-gradient-to-r from-orchid to-indigo text-white hover:text-white border-0 shadow-md'
    });
  }
  
  if (article.videoScript) {
    sections.push({
      id: 'video',
      title: 'Video Script',
      icon: Video,
      buttonClass: 'bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 border-red-200 hover:border-red-300',
      activeButtonClass: 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:text-white border-0 shadow-md'
    });
  }
  
  if (article.emailTemplate) {
    sections.push({
      id: 'email',
      title: 'Email',
      icon: Mail,
      buttonClass: 'bg-green-50 hover:bg-green-100 text-green-700 hover:text-green-800 border-green-200 hover:border-green-300',
      activeButtonClass: 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:text-white border-0 shadow-md'
    });
  }
  
  if (article.socialContent) {
    sections.push({
      id: 'social',
      title: 'Social',
      icon: Share2,
      buttonClass: 'bg-pink-50 hover:bg-pink-100 text-pink-700 hover:text-pink-800 border-pink-200 hover:border-pink-300',
      activeButtonClass: 'bg-gradient-to-r from-pink-700 to-pink-800 text-white hover:text-white border-0 shadow-md'
    });
  }

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(activeSection === sectionId ? null : sectionId);
  };

  const renderSectionContent = () => {
    if (!activeSection) return null;

    switch (activeSection) {
      case 'insights':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-lavender/30 to-lavender/20 rounded-xl" />
            <div className="relative p-8 bg-white/60 backdrop-blur-sm rounded-xl border border-lavender/50">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-lavender/30 rounded-lg">
                    <Lightbulb className="h-5 w-5 text-orchid" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Key Insights</h3>
                </div>
                <LikeButton
                  postId={postId}
                  contentId={`${article.contentID}-insights`}
                  contentType="KEY_INSIGHTS"
                  contentTitle={`Key Insights - ${article.title}`}
                  userId={userId}
                  initialLiked={userLikes.some(
                    like => like.contentId === `${article.contentID}-insights` && like.contentType === "KEY_INSIGHTS"
                  )}
                  initialCount={likeCounts[`${article.contentID}-insights`] || 0}
                  size="sm"
                />
              </div>
              
              <div className="space-y-4 mb-6">
                {article.keyInsights?.map((insight, idx) => (
                  <motion.div
                    key={idx} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                    className="flex items-start gap-3 group"
                  >
                    <div className="p-1.5 bg-lavender/30 rounded-full mt-0.5">
                      <CheckIcon className="h-3.5 w-3.5 text-orchid" />
                    </div>
                    <span className="text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors">{insight}</span>
                  </motion.div>
                ))}
              </div>
              
              <div className="pt-6 border-t border-lavender/30">
                <p className="text-orchid font-medium italic text-center">
                  &ldquo;Success in real estate comes from building relationships, not just closing deals.&rdquo;
                </p>
                <p className="text-sm text-orchid text-center mt-2">— Personal Insight</p>
              </div>
            </div>
          </motion.div>
        );

      case 'video':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 bg-gradient-to-br from-gray-50 to-gray-100/50 p-8 rounded-xl border border-gray-200"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Video className="h-5 w-5 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Video Script</h3>
                <Badge className="bg-red-100 text-red-700 border-0 text-xs">
                  30-60 seconds
                </Badge>
              </div>
              <LikeButton
                postId={postId}
                contentId={`${article.contentID}-video`}
                contentType="VIDEO_SCRIPT"
                contentTitle={`Video Script - ${article.title}`}
                userId={userId}
                initialLiked={userLikes.some(
                  like => like.contentId === `${article.contentID}-video` && like.contentType === "VIDEO_SCRIPT"
                )}
                initialCount={likeCounts[`${article.contentID}-video`] || 0}
                size="sm"
              />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
              <div className="space-y-4">
                {article.videoScript?.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="text-gray-700 leading-relaxed text-lg">
                    {paragraph.trim()}
                  </p>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <CopyButton content={article.videoScript || ''} type="Video Script" />
              <span className="text-sm text-gray-500">Ready to record!</span>
            </div>
          </motion.div>
        );

      case 'email':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 bg-gradient-to-br from-green-50 to-emerald-50/50 p-8 rounded-xl border border-green-200"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Mail className="h-5 w-5 text-green-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Email Template</h3>
              </div>
              <LikeButton
                postId={postId}
                contentId={`${article.contentID}-email`}
                contentType="EMAIL_TEMPLATE"
                contentTitle={`Email Template - ${article.title}`}
                userId={userId}
                initialLiked={userLikes.some(
                  like => like.contentId === `${article.contentID}-email` && like.contentType === "EMAIL_TEMPLATE"
                )}
                initialCount={likeCounts[`${article.contentID}-email`] || 0}
                size="sm"
              />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100 mb-6">
              <div className="space-y-4">
                {article.emailTemplate?.split('\n\n').map((paragraph, idx) => {
                  if (paragraph.includes('✅') || paragraph.includes('☑️') || paragraph.includes('•')) {
                    const items = paragraph.split('\n').filter(line => line.trim());
                    return (
                      <div key={idx} className="space-y-3">
                        {items.map((item, itemIdx) => (
                          <div key={itemIdx} className="flex items-start gap-3 group">
                            <div className="p-1 bg-green-100 rounded-full mt-0.5">
                              <CheckIcon className="h-3.5 w-3.5 text-green-700" />
                            </div>
                            <span className="text-gray-700 group-hover:text-gray-900 transition-colors">{item.replace(/^[✅☑️•]\s*/, '')}</span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return (
                    <p key={idx} className="text-gray-700 leading-relaxed">
                      {paragraph.trim()}
                    </p>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <CopyButton content={article.emailTemplate || ''} type="Email Template" />
              <span className="text-sm text-gray-500">Personalize before sending</span>
            </div>
          </motion.div>
        );

      case 'social':
        const socialPlatforms = [
          { name: 'Facebook', icon: Facebook, color: 'from-blue-600 to-blue-700', bgColor: 'bg-white', textColor: 'text-blue-800', content: article.socialContent?.facebook },
          { name: 'Instagram', icon: Instagram, color: 'from-pink-600 to-orchid', bgColor: 'bg-white', textColor: 'text-pink-800', content: article.socialContent?.instagram },
          { name: 'Twitter', icon: Twitter, color: 'from-blue-500 to-blue-600', bgColor: 'bg-white', textColor: 'text-blue-800', content: article.socialContent?.twitter },
          { name: 'LinkedIn', icon: Linkedin, color: 'from-indigo to-orchid', bgColor: 'bg-white', textColor: 'text-indigo', content: article.socialContent?.linkedin }
        ];

        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 bg-gradient-to-br from-lavender/20 to-pink-50/50 p-8 rounded-xl border border-lavender/50"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-lavender/30 rounded-lg">
                <Share2 className="h-5 w-5 text-orchid" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Social Media Content</h3>
            </div>
            <div className="grid gap-4">
              {socialPlatforms.map((platform, idx) => {
                const PlatformIcon = platform.icon;
                return platform.content && (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                    className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-200"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${platform.color} shadow-sm`}>
                        <PlatformIcon className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="font-bold text-lg text-gray-900">{platform.name}</h4>
                    </div>
                    <p className="text-gray-800 text-sm mb-5 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100 font-medium">
                      {platform.content}
                    </p>
                    <CopyButton content={platform.content} type={platform.name} className="text-sm font-medium" />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardContent className="p-7">
        <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <Badge className="bg-lavender/30 text-orchid border-0 px-3 py-1">
                • Market Update
              </Badge>
              <LikeButton
                postId={postId}
                contentId={article.contentID}
                contentType="ARTICLE"
                contentTitle={article.title}
                userId={userId}
                initialLiked={userLikes.some(
                  like => like.contentId === article.contentID && like.contentType === "ARTICLE"
                )}
                initialCount={likeCounts[article.contentID] || 0}
                size="sm"
                showCount
              />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
              {article.title || 'Untitled Article'}
            </h3>
            <p className="text-gray-600 leading-relaxed mb-6 text-lg">
              {article.summary || 'No summary available.'}
            </p>
            
            <div className="flex flex-wrap gap-3">
              {sections.map((section) => {
                const IconComponent = section.icon;
                return (
                  <Button
                    key={section.id}
                    onClick={() => handleSectionClick(section.id)}
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-10 px-5 flex items-center gap-2 transition-all duration-200 rounded-lg border font-medium hover:scale-105",
                      activeSection === section.id ? section.activeButtonClass : section.buttonClass
                    )}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span className="text-sm">{section.title}</span>
                  </Button>
                );
              })}
            </div>
        </div>

        {renderSectionContent()}
      </CardContent>
    </Card>
  );
};

interface AdCardProps {
  article: Article;
  index: number;
}

const AdCard = ({ article, index }: AdCardProps) => {
  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: React.ComponentType<{ className?: string }> } = {
      'lucide-copy': Copy,
      'lucide-bot': Bot,
      'lucide-zap': Zap,
      'lucide-sparkles': Sparkles,
      'lucide-shield': Shield,
      'lucide-trending-up': TrendingUp,
      'lucide-file-text': FileText,
      'lucide-lightbulb': Lightbulb,
      'lucide-mail': Mail,
      'lucide-video': Video,
      'lucide-share2': Share2,
      'lucide-send': Send,
      'lucide-arrow-right': ArrowRight
    };
    return icons[iconName] || Zap;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="mt-16 bg-gradient-to-b from-lavender/20 to-white rounded-2xl p-8"
    >
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
        {article.title}
      </h2>
      <p className="text-center text-gray-600 mb-8">
        {article.summary}
      </p>
      
      {article.valueProps && article.valueProps.length > 0 && (
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {article.valueProps
            .sort((a, b) => a.position - b.position)
            .map((prop, idx) => {
              const IconComponent = getIconComponent(prop.icon);
              return (
                <div key={idx} className="text-center">
                  <div className="w-16 h-16 bg-lavender/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-orchid" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{prop.heading}</h3>
                  <p className="text-sm text-gray-600">{prop.description}</p>
                </div>
              );
            })}
        </div>
      )}
      
      {article.cta && (
        <div className="text-center">
          <Button
            onClick={() => window.open(article.cta?.url, '_blank')}
            className="bg-orchid hover:bg-indigo text-white px-8 py-3 text-lg font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {article.cta.text}
          </Button>
        </div>
      )}
    </motion.div>
  );
};

type AIChatContentType = 'video' | 'email' | 'social' | 'general';


const AIChat = ({ newsletter, onClose }: { newsletter: NewsletterData['newsletter']; onClose: () => void }) => {
  const [selectedArticle, setSelectedArticle] = useState(newsletter.articles[0]?.title || '');
  const [selectedContentType, setSelectedContentType] = useState<AIChatContentType>('general');
  const [input, setInput] = useState('');
  const [showArticleSelector, setShowArticleSelector] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Generate conversation ID based on newsletter and timestamp
  const conversationId = `newsletter-${newsletter.id}-${Date.now()}`;
  
  // Use analytics-enhanced chat functionality
  const {
    messages,
    loading,
    streamingContent,
    sendMessage,
    clearConversation: analyticsAwareClearConversation,
    initializeConversation
  } = useAIChatWithAnalytics(conversationId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  // Initialize conversation when component mounts
  useEffect(() => {
    initializeConversation(selectedArticle, selectedContentType);
  }, [initializeConversation, selectedArticle, selectedContentType]);

  const clearConversation = () => {
    analyticsAwareClearConversation();
    toast.success('Conversation cleared');
  };

  const quickActions = [
    'Make shorter',
    'Change loan type', 
    'Add statistics',
    'Make personal'
  ];

  const handleQuickAction = (action: string) => {
    setInput(action);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const content = input.trim();
    setInput('');

    try {
      // Get the selected article content
      const selectedArticleData = newsletter.articles.find(article => article.title === selectedArticle);
      
      await sendMessage(
        content,
        selectedArticle,
        selectedContentType,
        selectedArticleData
      );
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    }
  };

  const handleDragEnd = (_event: unknown, info: { offset: { y: number } }) => {
    if (info.offset.y > 100) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        drag="y"
        dragConstraints={{ top: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        className="fixed inset-x-0 md:inset-x-6 bottom-0 md:bottom-6 z-50 md:max-w-4xl md:mx-auto bg-white rounded-t-3xl md:rounded-3xl shadow-2xl border border-gray-200 flex flex-col"
        style={{ height: '75vh', maxHeight: '650px' }}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-4 pb-2 flex-shrink-0">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-lavender/30 rounded-2xl flex items-center justify-center">
              <Bot className="h-6 w-6 text-orchid" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">AI Assistant</h3>
              <p className="text-gray-600 text-sm font-medium">Customize your content</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <Button
                onClick={clearConversation}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                Clear
              </Button>
            )}
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Article & Content Type Selector */}
        <div className="px-6 pb-6 flex-shrink-0">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Article Selector */}
            {newsletter.articles.length > 1 && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Article</label>
                <div className="relative">
                  <button
                    onClick={() => setShowArticleSelector(!showArticleSelector)}
                    className="w-full bg-white text-gray-800 rounded-xl px-4 py-3 text-left text-sm flex items-center justify-between border border-gray-300 hover:border-gray-400 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <span className="truncate pr-2 font-medium">{selectedArticle}</span>
                    <ChevronDown className={cn("w-4 h-4 text-gray-600 transition-transform duration-200", showArticleSelector && "rotate-180")} />
                  </button>
                  
                  {showArticleSelector && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-xl shadow-xl z-20 max-h-40 overflow-y-auto">
                      {newsletter.articles.map((article, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedArticle(article.title);
                            setShowArticleSelector(false);
                          }}
                          className={cn(
                            "w-full text-left px-4 py-3 text-sm hover:bg-gray-100 transition-colors first:rounded-t-xl last:rounded-b-xl",
                            selectedArticle === article.title ? "bg-lavender/30 text-orchid font-medium" : "text-gray-700"
                          )}
                        >
                          <div className="truncate">{article.title}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Content Type Selector */}
            <div className={newsletter.articles.length <= 1 ? 'md:col-span-2' : ''}>
              <label className="block text-sm font-bold text-gray-700 mb-3">Focus</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedContentType('video')}
                  className={cn(
                    "inline-flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                    selectedContentType === 'video'
                      ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg"
                      : "bg-white text-gray-700 hover:text-gray-900 border border-gray-300 hover:border-gray-400 shadow-sm hover:shadow-md"
                  )}
                >
                  <Video className="w-4 h-4" />
                  Video
                </button>
                
                <button
                  onClick={() => setSelectedContentType('email')}
                  className={cn(
                    "inline-flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                    selectedContentType === 'email'
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                      : "bg-white text-gray-700 hover:text-gray-900 border border-gray-300 hover:border-gray-400 shadow-sm hover:shadow-md"
                  )}
                >
                  <Mail className="w-4 h-4" />
                  Email
                </button>
                
                <button
                  onClick={() => setSelectedContentType('social')}
                  className={cn(
                    "inline-flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                    selectedContentType === 'social'
                      ? "bg-gradient-to-r from-lavender/200 to-orchid text-white shadow-lg"
                      : "bg-white text-gray-700 hover:text-gray-900 border border-gray-300 hover:border-gray-400 shadow-sm hover:shadow-md"
                  )}
                >
                  <Share2 className="w-4 h-4" />
                  Social
                </button>
                
                <button
                  onClick={() => setSelectedContentType('general')}
                  className={cn(
                    "inline-flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                    selectedContentType === 'general'
                      ? "bg-gradient-to-r from-indigo to-orchid text-white shadow-lg"
                      : "bg-white text-gray-700 hover:text-gray-900 border border-gray-300 hover:border-gray-400 shadow-sm hover:shadow-md"
                  )}
                >
                  <Lightbulb className="w-4 h-4" />
                  General
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 flex flex-col min-h-0 border-t border-gray-200 overflow-hidden">
          {messages.length === 0 ? (
            /* Empty State */
            <div className="flex-1 flex flex-col justify-center p-6 text-center overflow-y-auto">
              <div className="space-y-4">
                <p className="text-xl font-bold text-gray-900">
                  Ready to customize content?
                </p>
                <p className="text-gray-600 text-base leading-relaxed">
                  {selectedContentType !== 'general' 
                    ? `I'll focus on helping you with ${selectedContentType === 'video' ? 'video scripts' : selectedContentType === 'email' ? 'email templates' : 'social media content'}.`
                    : 'Ask me anything about this article or request general content help.'
                  }
                </p>
              </div>
              
              {/* Quick Actions */}
              <div className="mt-6">
                <p className="text-sm font-medium text-gray-700 mb-3">Quick actions:</p>
                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map((action) => (
                    <Button
                      key={action}
                      onClick={() => handleQuickAction(action)}
                      variant="outline"
                      className="h-12 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      disabled={loading}
                    >
                      {action}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Messages */
            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="p-6 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex",
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-4 py-3 shadow-sm",
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-orchid to-indigo text-white'
                          : 'bg-gray-100 text-gray-900 border border-gray-200'
                      )}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                  </motion.div>
                ))}
                
                {/* Streaming Message */}
                {streamingContent && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="max-w-[80%] rounded-2xl px-4 py-3 shadow-sm bg-gray-100 text-gray-900 border border-gray-200">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {streamingContent}
                        <span className="inline-block w-2 h-4 bg-orchid ml-1 animate-pulse" />
                      </p>
                    </div>
                  </motion.div>
                )}
                
                {/* Loading Indicator */}
                {loading && !streamingContent && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-gray-100 rounded-2xl px-4 py-3 shadow-sm border border-gray-200">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-orchid rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-orchid rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-orchid rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-sm text-gray-500">AI is thinking...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {/* Auto-scroll anchor */}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-gray-200 p-6 bg-gray-50 flex-shrink-0">
            <form onSubmit={handleSubmit} className="flex gap-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about this content..."
                className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orchid focus:border-lavender transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={loading}
              />
              <Button
                type="submit"
                className="bg-gradient-to-r from-lavender/200 to-orchid hover:from-orchid hover:to-indigo text-white border-0 shadow-lg px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!input.trim() || loading}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </form>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default function NewsletterPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const analyticsContext = useAnalytics();
  const [data, setData] = useState<NewsletterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);

  const articleUuid = params.uuid as string;
  const userUuid = searchParams.get('u');

  useEffect(() => {
    const fetchData = async () => {
      if (!articleUuid || !userUuid) {
        setError('Missing required parameters');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/newsletter/${articleUuid}?u=${userUuid}`);
        if (!response.ok) {
          throw new Error('Failed to fetch newsletter data');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [articleUuid, userUuid]);

  // Set user ID in analytics system when userUuid is available
  useEffect(() => {
    const setUserInAnalytics = async () => {
      if (userUuid && analyticsContext.isTrackingEnabled) {
        try {
          await analytics.setUser(userUuid);
        } catch (error) {
          console.error('Failed to set user in analytics:', error);
        }
      }
    };
    
    setUserInAnalytics();
  }, [userUuid, analyticsContext.isTrackingEnabled]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="bg-white border-b border-gray-200 mb-8">
          <div className="max-w-4xl mx-auto py-4">
            <Skeleton className="h-8 w-32" />
          </div>
        </div>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-96 mx-auto mb-4" />
            <Skeleton className="h-6 w-full max-w-2xl mx-auto" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="shadow-lg border-0">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Newsletter Not Found</h1>
            <p className="text-gray-600">{error || 'The requested newsletter could not be found.'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-lavender/20 via-white to-lavender/20">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-lavender/30">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="relative h-10">
                <Image
                  src="/logo/landscape/TrueToneAI-Landscape-Logo-Full-Color.png"
                  alt="TrueTone AI"
                  width={200}
                  height={40}
                  className="h-10 w-auto object-contain"
                  priority
                />
              </div>
              <Button
                onClick={() => setShowChat(true)}
                variant="default"
                size="sm"
                className="bg-gradient-to-r from-orchid to-indigo hover:from-indigo hover:to-shadow text-white border-0 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Ask a question
              </Button>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden py-16">
          <div className="absolute" />
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-lavender/30 text-orchid px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4" />
                <span>Welcome back, {data.user.firstName}!</span>
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Market Intelligence
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Stay ahead with real-time mortgage market insights, professionally crafted scripts, and AI-powered content personalization.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8 pb-32">

          <div className="space-y-6">
            {data.newsletter.articles
              .filter(article => article && article.title) // Filter out invalid articles
              .sort((a, b) => a.position - b.position)
              .map((article, index) => {
                if (!article || !article.title) {
                  return null; // Skip invalid articles
                }

                if (article.contentType === 'ad') {
                  return (
                    <AdCard
                      key={article.id || index}
                      article={article}
                      index={index}
                    />
                  );
                }

                return (
                  <motion.div
                    key={article.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                  >
                    <ArticleCard
                      article={article}
                      postId={data.newsletter.id}
                      userId={userUuid || undefined}
                      userLikes={data.newsletter.userLikes || []}
                      likeCounts={data.newsletter.likeCounts || {}}
                    />
                  </motion.div>
                );
              })}
          </div>
          
          {/* Copyright */}
          <div className="mt-12 text-center text-sm text-gray-500">
            © 2024 TrueTone AI. Built for ambitious, top-producing, hyper-growth Loan Officers.
          </div>
        </div>
      </div>

      {/* AI Chat Panel */}
      {showChat && (
        <AIChatAnalyticsWrapper
          conversationId={`newsletter-${data.newsletter.id}-chat`}
          selectedArticle={data.newsletter.articles[0]?.title}
          selectedContentType="general"
          isVisible={showChat}
        >
          <AIChat
            newsletter={data.newsletter}
            onClose={() => setShowChat(false)}
          />
        </AIChatAnalyticsWrapper>
      )}
    </>
  );
}