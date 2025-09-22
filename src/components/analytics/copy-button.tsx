/**
 * Copy Button with Analytics Tracking
 * Button component that copies content to clipboard and tracks the interaction
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Copy, Check } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useAnalytics } from '@/lib/analytics/hooks'

interface CopyButtonProps {
  content: string
  contentId: string
  contentType: 'email_template' | 'video_script' | 'social_content' | 'article'
  contentTitle?: string
  variant?: 'default' | 'outline' | 'ghost' | 'secondary'
  size?: 'sm' | 'default' | 'lg' | 'icon'
  className?: string
  children?: React.ReactNode
  showToast?: boolean
  toastMessage?: string
}

export function CopyButton({
  content,
  contentId,
  contentType,
  contentTitle,
  variant = 'outline',
  size = 'sm',
  className,
  children,
  showToast = true,
  toastMessage
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Analytics tracking
  const { trackCopy, trackClick, isTrackingEnabled } = useAnalytics()
  
  const handleCopy = async () => {
    if (loading || !content) return
    
    try {
      setLoading(true)
      
      // Copy to clipboard
      await navigator.clipboard.writeText(content)
      
      // Update UI state
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      
      // Track analytics
      if (isTrackingEnabled) {
        trackCopy(contentType, contentId, content.length)
        trackClick('button', `copy-button-${contentId}`, {
          contentType,
          contentTitle: contentTitle || contentId,
          contentLength: content.length,
          action: 'copy_content'
        })
      }
      
      // Show success feedback
      if (showToast) {
        const message = toastMessage || getDefaultToastMessage(contentType)
        toast.success(message, {
          duration: 2000,
          position: 'bottom-center'
        })
      }
      
    } catch (error) {
      console.error('Failed to copy content:', error)
      
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea')
        textArea.value = content
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        
        if (showToast) {
          const message = toastMessage || getDefaultToastMessage(contentType)
          toast.success(message)
        }
      } catch {
        toast.error('Failed to copy content. Please copy manually.', {
          duration: 3000
        })
      }
    } finally {
      setLoading(false)
    }
  }
  
  const getDefaultToastMessage = (type: string): string => {
    switch (type) {
      case 'email_template':
        return '📧 Email template copied!'
      case 'video_script':
        return '🎬 Video script copied!'
      case 'social_content':
        return '📱 Social content copied!'
      case 'article':
        return '📄 Article content copied!'
      default:
        return '📋 Content copied!'
    }
  }
  
  const buttonIcon = copied ? (
    <Check className={cn(
      size === 'icon' ? 'h-4 w-4' : 'h-3.5 w-3.5',
      'text-green-600'
    )} />
  ) : (
    <Copy className={cn(
      size === 'icon' ? 'h-4 w-4' : 'h-3.5 w-3.5'
    )} />
  )
  
  const buttonContent = children || (
    <>
      {buttonIcon}
      {size !== 'icon' && (
        <span className="ml-1.5">
          {copied ? 'Copied!' : 'Copy'}
        </span>
      )}
    </>
  )
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={variant}
          size={size}
          onClick={handleCopy}
          disabled={loading || !content}
          className={cn(
            'gap-1.5 transition-all duration-200',
            copied && 'text-green-600 border-green-300 bg-green-50 dark:bg-green-900/20',
            loading && 'opacity-70 cursor-wait',
            className
          )}
        >
          {buttonContent}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>
          {copied 
            ? 'Copied to clipboard!' 
            : `Copy ${contentType.replace('_', ' ')} to clipboard`
          }
        </p>
      </TooltipContent>
    </Tooltip>
  )
}

/**
 * Copy Card Component
 * Card wrapper with copy functionality for marketing content
 */
interface CopyCardProps {
  title: string
  content: string
  contentId: string
  contentType: 'email_template' | 'video_script' | 'social_content' | 'article'
  description?: string
  children?: React.ReactNode
  className?: string
}

export function CopyCard({
  title,
  content,
  contentId,
  contentType,
  description,
  children,
  className
}: CopyCardProps) {
  return (
    <div className={cn(
      'relative p-4 border rounded-lg bg-card text-card-foreground',
      'hover:bg-accent/50 transition-colors duration-200',
      className
    )}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm leading-tight">
            {title}
          </h3>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </div>
        
        <CopyButton
          content={content}
          contentId={contentId}
          contentType={contentType}
          contentTitle={title}
          size="icon"
          variant="ghost"
          className="shrink-0 h-8 w-8"
        />
      </div>
      
      {/* Content */}
      {children || (
        <div className="text-sm text-muted-foreground">
          <p className="line-clamp-3">
            {content}
          </p>
        </div>
      )}
      
      {/* Character count */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t text-xs text-muted-foreground">
        <span>{content.length} characters</span>
        <span className="capitalize">
          {contentType.replace('_', ' ')}
        </span>
      </div>
    </div>
  )
}

/**
 * Bulk Copy Component
 * Copy multiple content pieces at once
 */
interface BulkCopyProps {
  items: Array<{
    title: string
    content: string
    contentId: string
    contentType: 'email_template' | 'video_script' | 'social_content' | 'article'
  }>
  separator?: string
  className?: string
}

export function BulkCopy({
  items,
  separator = '\n\n---\n\n',
  className
}: BulkCopyProps) {
  const { trackCopy, trackClick, isTrackingEnabled } = useAnalytics()
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const combinedContent = items.map(item => 
    `${item.title}\n\n${item.content}`
  ).join(separator)
  
  const handleBulkCopy = async () => {
    if (loading || items.length === 0) return
    
    try {
      setLoading(true)
      
      await navigator.clipboard.writeText(combinedContent)
      
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      
      // Track analytics for bulk copy
      if (isTrackingEnabled) {
        // Track individual content pieces
        items.forEach(item => {
          trackCopy(item.contentType, item.contentId, item.content.length)
        })
        
        // Track bulk action
        trackClick('button', 'bulk-copy-button', {
          action: 'bulk_copy',
          itemCount: items.length,
          totalLength: combinedContent.length,
          contentTypes: [...new Set(items.map(i => i.contentType))]
        })
      }
      
      toast.success(`📋 Copied ${items.length} items to clipboard!`, {
        duration: 2000,
        position: 'bottom-center'
      })
      
    } catch (error) {
      console.error('Failed to copy bulk content:', error)
      toast.error('Failed to copy content. Please try again.', {
        duration: 3000
      })
    } finally {
      setLoading(false)
    }
  }
  
  if (items.length === 0) return null
  
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleBulkCopy}
      disabled={loading}
      className={cn(
        'gap-2',
        copied && 'text-green-600 border-green-300 bg-green-50 dark:bg-green-900/20',
        loading && 'opacity-70 cursor-wait',
        className
      )}
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-600" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
      {copied ? 'Copied!' : `Copy All (${items.length})`}
    </Button>
  )
}