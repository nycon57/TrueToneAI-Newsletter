'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Lightbulb, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Article } from '@/lib/context/ArticleModalContext';

export interface ArticleModalContentProps {
  article: Article;
}

export function ArticleModalContent({ article }: ArticleModalContentProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // Calculate scroll progress
  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      const totalHeight = target.scrollHeight - target.clientHeight;
      const progress = (target.scrollTop / totalHeight) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    const contentArea = document.querySelector('[data-article-content]');
    contentArea?.addEventListener('scroll', handleScroll);

    return () => {
      contentArea?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Emit scroll progress for sidebar
  useEffect(() => {
    const event = new CustomEvent('article-scroll-progress', {
      detail: { progress: scrollProgress },
    });
    window.dispatchEvent(event);
  }, [scrollProgress]);

  // Use article content from database, or fallback to generated content if not available
  const articleContent = article.content || `## Overview\n\n${article.summary || 'No content available.'}\n\n## Key Insights\n\n${article.keyInsights?.map(insight => `- ${insight}`).join('\n') || 'No insights available.'}`;

  // Debug logging
  console.log('[ArticleModalContent] Debug Info:', {
    hasContent: !!article.content,
    contentLength: article.content?.length,
    contentPreview: article.content?.substring(0, 200),
    hasNewlines: article.content?.includes('\n'),
    hasDoubleNewlines: article.content?.includes('\n\n'),
    hasMarkdownHeaders: article.content?.includes('#'),
    articleContentLength: articleContent.length,
    articleContentPreview: articleContent.substring(0, 200),
    articleContentLineBreaks: articleContent.match(/\n/g)?.length || 0,
  });

  // Check DOM after render
  useEffect(() => {
    if (contentRef.current) {
      const h1 = contentRef.current.querySelector('h1');
      const h2 = contentRef.current.querySelector('h2');
      const h3 = contentRef.current.querySelector('h3');
      const p = contentRef.current.querySelector('p');
      const ul = contentRef.current.querySelector('ul');

      console.log('[ArticleModalContent] DOM Info:', {
        childrenCount: contentRef.current.children.length,
        innerHTML: contentRef.current.innerHTML.substring(0, 500),
        firstChildTag: contentRef.current.children[0]?.tagName,
        firstChildClass: contentRef.current.children[0]?.className,
        elementCounts: {
          h1: contentRef.current.querySelectorAll('h1').length,
          h2: contentRef.current.querySelectorAll('h2').length,
          h3: contentRef.current.querySelectorAll('h3').length,
          p: contentRef.current.querySelectorAll('p').length,
          ul: contentRef.current.querySelectorAll('ul').length,
          ol: contentRef.current.querySelectorAll('ol').length,
        },
        computedStyles: {
          containerClass: contentRef.current.className,
          containerComputedClass: window.getComputedStyle(contentRef.current).getPropertyValue('class'),
          h1: h1 ? {
            marginTop: window.getComputedStyle(h1).marginTop,
            marginBottom: window.getComputedStyle(h1).marginBottom,
            fontSize: window.getComputedStyle(h1).fontSize,
          } : 'no h1',
          h2: h2 ? {
            marginTop: window.getComputedStyle(h2).marginTop,
            marginBottom: window.getComputedStyle(h2).marginBottom,
            fontSize: window.getComputedStyle(h2).fontSize,
          } : 'no h2',
          h3: h3 ? {
            marginTop: window.getComputedStyle(h3).marginTop,
            marginBottom: window.getComputedStyle(h3).marginBottom,
            fontSize: window.getComputedStyle(h3).fontSize,
          } : 'no h3',
          p: p ? {
            marginTop: window.getComputedStyle(p).marginTop,
            marginBottom: window.getComputedStyle(p).marginBottom,
            lineHeight: window.getComputedStyle(p).lineHeight,
          } : 'no p',
          ul: ul ? {
            marginTop: window.getComputedStyle(ul).marginTop,
            marginBottom: window.getComputedStyle(ul).marginBottom,
            paddingLeft: window.getComputedStyle(ul).paddingLeft,
          } : 'no ul',
        }
      });

      // Check if article-content class is actually applied
      console.log('[ArticleModalContent] Style Check:', {
        hasArticleContentClass: contentRef.current.classList.contains('article-content'),
        allClasses: Array.from(contentRef.current.classList),
        directChildrenTags: Array.from(contentRef.current.children).map(child => child.tagName),
      });
    }
  }, [articleContent]);

  return (
    <div
      data-article-content
      className="h-full overflow-y-auto scroll-smooth"
      style={{ scrollBehavior: 'smooth' }}
    >
      {/* Content Container with generous padding */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Mobile Summary (only shown on small screens) */}
        <div className="lg:hidden mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-lavender/20 to-lavender/10 rounded-xl p-6 border border-lavender/30"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-3">{article.title}</h2>
            <p className="text-base text-gray-700 leading-relaxed">{article.summary}</p>
          </motion.div>
        </div>

        {/* Key Insights Callout */}
        {article.keyInsights && article.keyInsights.length > 0 && (
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
                {article.keyInsights.map((insight, idx) => (
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

        {/* Bottom Spacing */}
        <div className="h-20" />
      </article>
    </div>
  );
}
