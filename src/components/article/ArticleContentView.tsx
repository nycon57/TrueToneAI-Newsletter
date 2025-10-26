'use client';

import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Lightbulb, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

interface ArticleContentViewProps {
  title: string;
  summary?: string;
  content?: string;
  keyInsights?: string[];
}

export function ArticleContentView({
  title,
  summary,
  content,
  keyInsights,
}: ArticleContentViewProps) {
  // Use article content from database, or fallback to summary and insights
  const articleContent = content || `## Overview\n\n${summary || 'No content available.'}\n\n## Key Insights\n\n${keyInsights?.map(insight => `- ${insight}`).join('\n') || 'No insights available.'}`;

  // Debug logging
  console.log('[ArticleContentView] Debug Info:', {
    hasContent: !!content,
    contentLength: content?.length,
    contentPreview: content?.substring(0, 200),
    hasNewlines: content?.includes('\n'),
    hasDoubleNewlines: content?.includes('\n\n'),
    hasMarkdownHeaders: content?.includes('#'),
    summaryLength: summary?.length,
    keyInsightsCount: keyInsights?.length,
    articleContentLength: articleContent.length,
    articleContentPreview: articleContent.substring(0, 200)
  });

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      console.log('[ArticleContentView] DOM Info:', {
        children: contentRef.current.children.length,
        innerHTML: contentRef.current.innerHTML.substring(0, 500),
        firstChildTag: contentRef.current.children[0]?.tagName,
        firstChildClass: contentRef.current.children[0]?.className,
        computedStyles: {
          h2: window.getComputedStyle(contentRef.current.querySelector('h2') || document.createElement('div')).marginTop,
          p: window.getComputedStyle(contentRef.current.querySelector('p') || document.createElement('div')).marginTop,
        }
      });
    }
  }, [articleContent]);

  return (
    <div className="h-full overflow-y-auto scroll-smooth">
      {/* Content Container with generous padding */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {title}
          </h1>
          {summary && (
            <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
              {summary}
            </p>
          )}
        </motion.div>

        {/* Key Insights Callout */}
        {keyInsights && keyInsights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-10"
          >
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 sm:p-8 border border-amber-200/50 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 bg-amber-100 rounded-xl">
                  <Lightbulb className="w-6 h-6 text-amber-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Quick Takeaways</h3>
              </div>

              <div className="space-y-4">
                {keyInsights.map((insight, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    className="flex items-start gap-3 group"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-5 h-5 text-amber-600" />
                    </div>
                    <p className="text-gray-800 leading-relaxed text-base sm:text-lg font-medium">
                      {insight}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Article Content with Beautiful Typography */}
        <motion.div
          ref={contentRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="article-content"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{articleContent}</ReactMarkdown>
        </motion.div>

        {/* Bottom Spacing for sticky footer */}
        <div className="h-20" />
      </article>
    </div>
  );
}
