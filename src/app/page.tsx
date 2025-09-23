'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, CheckIcon, MessageCircle, X, Bot, Video, Mail, Share2, Lightbulb, Send, ChevronDown, Facebook, Instagram, Twitter, Linkedin, Zap, TrendingUp, Shield, FileText, Sparkles, ArrowRight, Crown, Settings, LogIn, User, Tag } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

// Custom Components
import { NewsletterSearchFilters, type FilterState } from '@/components/newsletter-search-filters';

// Utility function
import { cn } from '@/lib/utils';

interface Article {
  id: string;
  title: string;
  summary: string;
  content_type: 'article' | 'ad';
  article_topic?: string;
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
  published_at: string;
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
  isAuthenticated: boolean;
  isPaid: boolean;
}

const ArticleCard = ({ article, isAuthenticated, isPaid }: ArticleCardProps) => {
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
                  {article.is_personalized && (
                    <Badge className="bg-blue-100 text-blue-700 border-0">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Personalized
                    </Badge>
                  )}
                </div>
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
                {article.is_personalized && (
                  <Badge className="bg-blue-100 text-blue-700 border-0">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Personalized
                  </Badge>
                )}
              </div>
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
                {article.is_personalized && (
                  <Badge className="bg-blue-100 text-blue-700 border-0">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Personalized
                  </Badge>
                )}
              </div>
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
              {article.is_personalized && (
                <Badge className="bg-blue-100 text-blue-700 border-0">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Personalized
                </Badge>
              )}
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

  // Category color mapping
  const getCategoryStyle = (category: string) => {
    switch (category) {
      case 'Mortgage':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Leadership':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Marketing':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardContent className="px-8 py-5">
        <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              {/* Categories - Left aligned */}
              <div className="flex items-center gap-2">
                {article.category && (
                  <Badge className={`border px-3 py-1 font-medium ${getCategoryStyle(article.category)}`}>
                    {article.category}
                  </Badge>
                )}
              </div>

              {/* Tags and Personalized badge - Right aligned */}
              <div className="flex items-center gap-2">
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {article.tags && article.tags.length > 0 &&
                    article.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 transition-colors flex items-center gap-1"
                      >
                        <Tag className="h-3 w-3" />
                        {tag}
                      </Badge>
                    ))
                  }
                </div>

                {/* Personalized badge */}
                {article.is_personalized && (
                  <Badge className="bg-blue-100 text-blue-700 border-0">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Personalized
                  </Badge>
                )}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
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

export default function HomePage() {
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    categories: [],
    tags: [],
    sortBy: 'date-desc'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;

  const isAuthenticated = !!user;
  const isPaid = user && user.subscription_tier !== 'free';

  // Filter and sort articles based on current filters
  const filteredAndSortedArticles = useMemo(() => {
    let filtered = [...allArticles];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchLower) ||
        article.summary.toLowerCase().includes(searchLower) ||
        article.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(article =>
        article.category && filters.categories.includes(article.category.toLowerCase())
      );
    }

    // Apply tag filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter(article =>
        article.tags?.some(tag => filters.tags.includes(tag))
      );
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'date-asc':
        filtered.sort((a, b) => new Date(a.published_at).getTime() - new Date(b.published_at).getTime());
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'relevance':
        // For relevance, prioritize search matches in title over summary
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filtered.sort((a, b) => {
            const aInTitle = a.title.toLowerCase().includes(searchLower) ? 1 : 0;
            const bInTitle = b.title.toLowerCase().includes(searchLower) ? 1 : 0;
            if (aInTitle !== bInTitle) return bInTitle - aInTitle;
            return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
          });
        } else {
          filtered.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
        }
        break;
      case 'date-desc':
      default:
        filtered.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
        break;
    }

    return filtered;
  }, [allArticles, filters]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedArticles.length / articlesPerPage);
  const currentArticles = filteredAndSortedArticles.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try to get user info (will fail if not authenticated)
        try {
          const userResponse = await fetch('/api/user');
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setUser(userData);
          }
        } catch {
          // User not authenticated, continue as anonymous
        }

        // Fetch articles
        const articlesResponse = await fetch('/api/articles');
        if (!articlesResponse.ok) {
          throw new Error('Failed to fetch articles');
        }
        const articlesData = await articlesResponse.json();
        setAllArticles(articlesData.articles || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lavender/20 via-white to-lavender/20">
        {/* Header Skeleton */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-lavender/30">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-8 w-32" />
            </div>
          </div>
        </div>

        {/* Hero Skeleton */}
        <div className="py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Skeleton className="h-8 w-64 mx-auto mb-6" />
            <Skeleton className="h-12 w-96 mx-auto mb-6" />
            <Skeleton className="h-6 w-full max-w-2xl mx-auto" />
          </div>
        </div>

        {/* Articles Skeleton */}
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lavender/20 via-white to-lavender/20 flex items-center justify-center p-4">
        <Card className="shadow-lg border-0">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Content</h1>
            <p className="text-gray-600">{error}</p>
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
              <div className="flex items-center gap-3">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={isPaid ? 'default' : 'secondary'}
                        className={isPaid ? 'bg-blue-600' : ''}
                      >
                        {isPaid ? (
                          <>
                            <Crown className="h-3 w-3 mr-1" />
                            {user.subscription_tier?.toUpperCase()}
                          </>
                        ) : (
                          'FREE'
                        )}
                      </Badge>
                    </div>
                    <Link href="/dashboard">
                      <Button variant="outline" size="sm">
                        <User className="h-4 w-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Button size="sm" className="bg-gradient-to-r from-orchid to-indigo hover:from-indigo hover:to-shadow text-white border-0 shadow-md hover:shadow-lg transition-all duration-300">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden py-16">
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {isAuthenticated && (
                <div className="inline-flex items-center gap-2 bg-lavender/30 text-orchid px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Sparkles className="h-4 w-4" />
                  <span>Welcome back, {user.firstName || user.name || 'there'}!</span>
                </div>
              )}
              <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {isAuthenticated ? 'Your Market Intelligence' : 'Market Intelligence'}
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                {isAuthenticated
                  ? (isPaid
                      ? 'AI-personalized mortgage market insights, crafted for your unique voice and style.'
                      : 'Professional mortgage market insights. Upgrade for AI personalization and exclusive content.'
                    )
                  : 'Stay ahead with real-time mortgage market insights and professionally crafted content. Sign in for personalized AI content.'
                }
              </p>

              {/* Category preferences info for authenticated users */}
              {isAuthenticated && user.category_preferences && user.category_preferences.length > 0 && (
                <div className="mt-6 inline-flex items-center gap-2 bg-blue-50 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                  <Settings className="h-4 w-4" />
                  <span>Showing: {user.category_preferences.join(', ')}</span>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="max-w-4xl mx-auto px-4 py-6">
          <NewsletterSearchFilters
            onFilterChange={handleFilterChange}
            resultsCount={filteredAndSortedArticles.length}
            initialFilters={filters}
          />
        </div>

        {/* Articles */}
        <div className="max-w-4xl mx-auto px-4 py-8 pb-32">
          <div className="space-y-6">
            {currentArticles.length === 0 ? (
              <Card className="shadow-lg border-0">
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No articles available</h3>
                  <p className="text-gray-600">
                    {filteredAndSortedArticles.length === 0 && allArticles.length > 0
                      ? 'No articles match your current filters. Try adjusting your search or filters.'
                      : isAuthenticated && user.category_preferences?.length > 0
                      ? 'No articles match your current preferences. Try adjusting your category preferences.'
                      : 'Check back later for new content.'
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              currentArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                >
                  <ArticleCard
                    article={article}
                    isAuthenticated={isAuthenticated}
                    isPaid={isPaid}
                  />
                </motion.div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>

                  {/* Page numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    const shouldShow =
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1);

                    const showEllipsis =
                      (page === 2 && currentPage > 4) ||
                      (page === totalPages - 1 && currentPage < totalPages - 3);

                    if (!shouldShow && !showEllipsis) return null;

                    if (showEllipsis) {
                      return (
                        <PaginationItem key={`ellipsis-${page}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }

                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                          }}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                      }}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 text-center text-sm text-gray-500">
            © 2024 TrueTone AI. Built for ambitious, top-producing, hyper-growth Loan Officers.
          </div>
        </div>
      </div>
    </>
  );
}