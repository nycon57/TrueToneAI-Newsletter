"use client"

import { useState } from "react"
import { Toggle } from "@/components/ui/toggle"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { motion, AnimatePresence } from "motion/react"
import type { ContentType } from "@/generated/prisma"

interface LikeButtonProps {
  postId: string
  contentId: string
  contentType: ContentType
  contentTitle: string
  userId?: string
  initialLiked?: boolean
  initialCount?: number
  size?: "sm" | "default" | "lg"
  showCount?: boolean
  className?: string
  onLikeChange?: (liked: boolean) => void
}

export function LikeButton({
  postId,
  contentId,
  contentType,
  contentTitle,
  userId,
  initialLiked = false,
  initialCount = 0,
  size = "default",
  showCount = false,
  className,
  onLikeChange
}: LikeButtonProps) {
  const [loading, setLoading] = useState(false)
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)
  const [showHearts, setShowHearts] = useState(false)

  const handleToggle = async () => {
    // Don't allow toggling while loading
    if (loading) return

    // Haptic feedback on mobile devices
    if ('vibrate' in navigator && window.matchMedia('(max-width: 768px)').matches) {
      navigator.vibrate(10)
    }

    // Optimistic update
    const newLiked = !liked
    setLiked(newLiked)
    setCount(newLiked ? count + 1 : Math.max(0, count - 1))
    
    // Show floating hearts animation when liking
    if (newLiked) {
      setShowHearts(true)
      setTimeout(() => setShowHearts(false), 2000)
    }

    try {
      setLoading(true)
      
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(userId && { 'x-user-id': userId })
        },
        body: JSON.stringify({ 
          postId, 
          contentId, 
          contentType,
          contentTitle,
          userId 
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update like')
      }
      
      const data = await response.json()

      // Update with actual server data
      setLiked(data.liked)
      setCount(data.count)

      onLikeChange?.(data.liked)
      
      // Show subtle success feedback
      if (data.liked) {
        toast.success('❤️ Added to favorites!', {
          duration: 2000,
          position: 'bottom-center'
        })
      }
    } catch (error) {
      // Revert optimistic update on error
      setLiked(!newLiked)
      setCount(newLiked ? count - 1 : count + 1)
      
      toast.error(error instanceof Error ? error.message : 'Failed to update like', {
        duration: 3000,
        position: 'bottom-center'
      })
    } finally {
      setLoading(false)
    }
  }

  const sizeClasses = {
    icon: {
      sm: "h-3.5 w-3.5",
      default: "h-4 w-4",
      lg: "h-5 w-5"
    },
    text: {
      sm: "text-xs",
      default: "text-sm",
      lg: "text-base"
    }
  }

  if (!userId) {
    // For guest users, show a disabled state with tooltip
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn("inline-flex items-center gap-2", className)}>
            <Toggle
              pressed={false}
              disabled
              size={size}
              className="opacity-50 cursor-not-allowed"
            >
              <Heart className={cn(
                sizeClasses.icon[size],
                "text-gray-400"
              )} />
              {showCount && (
                <span className={cn("font-medium tabular-nums", sizeClasses.text[size])}>
                  {count}
                </span>
              )}
            </Toggle>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Sign in to like content</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <div className={cn("inline-flex items-center gap-2 relative", className)}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            pressed={liked}
            onPressedChange={handleToggle}
            disabled={loading}
            size={size}
            className={cn(
              "gap-1.5 transition-all duration-200 group",
              liked && "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 border-red-200",
              !liked && "hover:text-red-500",
              loading && "opacity-70 cursor-wait"
            )}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={liked ? "liked" : "unliked"}
                initial={{ scale: 0.8 }}
                animate={{ 
                  scale: 1,
                  rotate: liked ? [0, -12, 12, 0] : 0
                }}
                exit={{ scale: 0.8 }}
                transition={{ 
                  duration: 0.4,
                  ease: "easeInOut",
                  rotate: {
                    duration: 0.5,
                    ease: "easeInOut"
                  }
                }}
              >
                <Heart className={cn(
                  sizeClasses.icon[size],
                  "transition-all duration-300",
                  liked ? "fill-red-500 text-red-500" : "text-gray-400 group-hover:text-red-400",
                  !loading && "group-hover:scale-110"
                )} />
              </motion.div>
            </AnimatePresence>
            {showCount && (
              <AnimatePresence mode="wait">
                <motion.span
                  key={count}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className={cn("font-medium tabular-nums", sizeClasses.text[size])}
                >
                  {count}
                </motion.span>
              </AnimatePresence>
            )}
          </Toggle>
        </TooltipTrigger>
        <TooltipContent>
          <p>{liked ? "Unlike" : "Like"} this content</p>
        </TooltipContent>
      </Tooltip>
      
      {/* Loading spinner overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      {/* Floating hearts animation */}
      <AnimatePresence>
        {showHearts && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute left-1/2 top-1/2"
                initial={{ 
                  x: -8, 
                  y: -8, 
                  opacity: 1,
                  scale: 0
                }}
                animate={{ 
                  x: (Math.random() - 0.5) * 60 - 8,
                  y: -40 - Math.random() * 40,
                  opacity: 0,
                  scale: [0, 1.2, 0.8],
                  rotate: (Math.random() - 0.5) * 30
                }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: 1.5,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
              >
                <Heart className="w-4 h-4 fill-red-500 text-red-500" />
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Loading skeleton for initial render
export function LikeButtonSkeleton({ size = "default", showCount = false }: Pick<LikeButtonProps, "size" | "showCount">) {
  const skeletonSizes = {
    sm: "h-8 w-16",
    default: "h-9 w-20",
    lg: "h-10 w-24"
  }
  
  return (
    <Skeleton className={cn(
      skeletonSizes[size],
      !showCount && "w-12"
    )} />
  )
}