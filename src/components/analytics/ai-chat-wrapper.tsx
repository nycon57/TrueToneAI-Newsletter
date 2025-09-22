/**
 * AI Chat Analytics Wrapper
 * Wrapper component that adds comprehensive analytics tracking to AI chat interactions
 */

'use client'

import { useEffect, useRef, useState } from 'react'
import { useAIChatTracking } from '@/lib/analytics/hooks'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface AIChatAnalyticsWrapperProps {
  children: React.ReactNode
  conversationId: string
  selectedArticle?: string
  selectedContentType?: string
  isVisible: boolean
}

export function AIChatAnalyticsWrapper({
  children,
  conversationId,
  selectedArticle,
  selectedContentType,
  isVisible
}: AIChatAnalyticsWrapperProps) {
  const {
    startConversation,
    endConversation
  } = useAIChatTracking(conversationId)
  
  const hasStarted = useRef(false)
  
  // Start conversation when chat becomes visible
  useEffect(() => {
    if (isVisible && !hasStarted.current) {
      startConversation(selectedArticle, selectedContentType)
      hasStarted.current = true
    } else if (!isVisible && hasStarted.current) {
      endConversation()
      hasStarted.current = false
    }
  }, [isVisible, selectedArticle, selectedContentType, startConversation, endConversation])
  
  return <>{children}</>
}

/**
 * Enhanced AI Chat Hook
 * Custom hook that provides analytics-enhanced chat functionality
 */
export function useAIChatWithAnalytics(conversationId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  
  const {
    startConversation,
    trackMessage,
    endConversation,
    getSessionDuration,
    getMessageCount
  } = useAIChatTracking(conversationId)
  
  const messageStartTime = useRef<number>(0)
  
  const sendMessage = async (
    content: string,
    selectedArticle?: string,
    selectedContentType?: string,
    articleContent?: unknown
  ) => {
    if (!content.trim() || loading) return
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    }
    
    // Add user message
    setMessages(prev => [...prev, userMessage])
    setLoading(true)
    setStreamingContent('')
    messageStartTime.current = Date.now()
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          selectedArticle,
          selectedContentType,
          articleContent
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to send message')
      }
      
      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response stream')
      
      const decoder = new TextDecoder()
      let assistantContent = ''
      const assistantMessageId = `assistant-${Date.now()}`
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              // Final response complete
              const responseTime = Date.now() - messageStartTime.current
              const assistantMessage: Message = {
                id: assistantMessageId,
                role: 'assistant',
                content: assistantContent,
                timestamp: new Date()
              }
              
              setMessages(prev => [...prev, assistantMessage])
              setStreamingContent('')
              
              // Track successful message completion
              trackMessage(
                assistantContent.length, // Use content length as proxy for tokens
                responseTime,
                false
              )
              break
            }
            
            try {
              const parsed = JSON.parse(data)
              if (parsed.content) {
                assistantContent += parsed.content
                setStreamingContent(assistantContent)
              }
            } catch {
              // Skip invalid JSON chunks
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error)
      
      // Track error
      trackMessage(undefined, undefined, true)
      
      // Add error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
      
      throw error
    } finally {
      setLoading(false)
    }
  }
  
  const clearConversation = () => {
    setMessages([])
    setStreamingContent('')
    endConversation()
    // Restart conversation tracking
    setTimeout(() => {
      startConversation()
    }, 100)
  }
  
  const initializeConversation = (selectedArticle?: string, selectedContentType?: string) => {
    startConversation(selectedArticle, selectedContentType)
  }
  
  return {
    messages,
    loading,
    streamingContent,
    sendMessage,
    clearConversation,
    initializeConversation,
    getSessionDuration,
    getMessageCount
  }
}

/**
 * AI Chat Metrics Display
 * Optional component to show analytics metrics during development/testing
 */
interface AIChatMetricsProps {
  conversationId: string
  className?: string
}

export function AIChatMetrics({ conversationId, className }: AIChatMetricsProps) {
  const { getSessionDuration, getMessageCount } = useAIChatTracking(conversationId)
  const [duration, setDuration] = useState(0)
  const [messageCount, setMessageCount] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDuration(getSessionDuration())
      setMessageCount(getMessageCount())
    }, 1000)
    
    return () => clearInterval(interval)
  }, [getSessionDuration, getMessageCount])
  
  // Only show in development
  if (process.env.NODE_ENV !== 'development') return null
  
  return (
    <div className={`text-xs text-gray-500 p-2 bg-gray-50 rounded ${className}`}>
      <div>Session: {Math.floor(duration / 60)}m {duration % 60}s</div>
      <div>Messages: {messageCount}</div>
    </div>
  )
}