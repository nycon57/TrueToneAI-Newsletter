import { useState, useCallback } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function useAIChat(conversationId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');

  const initializeConversation = useCallback(
    (selectedArticle: string, selectedContentType: string) => {
      // Initialize conversation context
      console.log('Initialized conversation:', { conversationId, selectedArticle, selectedContentType });
    },
    [conversationId]
  );

  const sendMessage = useCallback(
    async (
      content: string,
      selectedArticle: string,
      selectedContentType: string,
      articleData?: unknown
    ) => {
      // Generate unique IDs using crypto.randomUUID or fallback
      const generateId = () => {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
          return crypto.randomUUID();
        }
        // Fallback for environments without crypto.randomUUID
        return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      };

      const userMessageId = `user-${generateId()}`;
      const userMessage: Message = {
        id: userMessageId,
        role: 'user',
        content,
      };

      // Use functional state update to avoid race conditions
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages, userMessage];
        setLoading(true);
        setStreamingContent('');

        // Kick off the async request with the correct conversation history
        (async () => {
          try {
            const response = await fetch('/api/ai/personalize-stream', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                message: content,
                articleTitle: selectedArticle,
                contentType: selectedContentType,
                articleData,
                conversationHistory: newMessages, // Use the updated messages
              }),
            });

            if (!response.ok) {
              throw new Error('Failed to send message');
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let fullResponse = '';

            if (reader) {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                fullResponse += chunk;
                setStreamingContent(fullResponse);
              }
            }

            const assistantMessage: Message = {
              id: `assistant-${generateId()}`,
              role: 'assistant',
              content: fullResponse,
            };

            setMessages((prev) => [...prev, assistantMessage]);
            setStreamingContent('');
          } catch (error) {
            console.error('Error sending message:', error);
            throw error;
          } finally {
            setLoading(false);
          }
        })();

        return newMessages;
      });
    },
    [] // Remove messages dependency to avoid stale closure
  );

  const clearConversation = useCallback(() => {
    setMessages([]);
    setStreamingContent('');
  }, []);

  return {
    messages,
    loading,
    streamingContent,
    sendMessage,
    clearConversation,
    initializeConversation,
  };
}
