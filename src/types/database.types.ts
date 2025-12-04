export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      analytics_events: {
        Row: {
          elementId: string | null
          elementType: string | null
          eventAction: string
          eventCategory: string | null
          eventLabel: string | null
          eventType: string
          eventValue: number | null
          id: string
          metadata: Json | null
          pagePath: string | null
          sessionId: string
          timestamp: string
          userId: string | null
        }
        Insert: {
          elementId?: string | null
          elementType?: string | null
          eventAction: string
          eventCategory?: string | null
          eventLabel?: string | null
          eventType: string
          eventValue?: number | null
          id?: string
          metadata?: Json | null
          pagePath?: string | null
          sessionId: string
          timestamp?: string
          userId?: string | null
        }
        Update: {
          elementId?: string | null
          elementType?: string | null
          eventAction?: string
          eventCategory?: string | null
          eventLabel?: string | null
          eventType?: string
          eventValue?: number | null
          id?: string
          metadata?: Json | null
          pagePath?: string | null
          sessionId?: string
          timestamp?: string
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_sessionId_fkey"
            columns: ["sessionId"]
            isOneToOne: false
            referencedRelation: "user_sessions"
            referencedColumns: ["sessionId"]
          },
          {
            foreignKeyName: "analytics_events_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      anonymous_ai_usage: {
        Row: {
          created_at: string
          generations_used: number
          id: string
          ip_address: string | null
          last_used_at: string
          session_id: string
        }
        Insert: {
          created_at?: string
          generations_used?: number
          id?: string
          ip_address?: string | null
          last_used_at?: string
          session_id: string
        }
        Update: {
          created_at?: string
          generations_used?: number
          id?: string
          ip_address?: string | null
          last_used_at?: string
          session_id?: string
        }
        Relationships: []
      }
      articles: {
        Row: {
          article_topic: string | null
          category: string | null
          content: string | null
          content_type: string | null
          created_at: string | null
          created_by_admin_id: string | null
          default_email_template: string | null
          default_key_insights: string[] | null
          default_social_content: Json | null
          default_video_script: string | null
          id: string
          image_url: string | null
          industry: string | null
          last_edited_by_admin_id: string | null
          metadata: Json | null
          position: number | null
          published_at: string | null
          rejection_reason: string | null
          review_notes: string | null
          reviewed_at: string | null
          source_url: string | null
          status: Database["public"]["Enums"]["article_status"] | null
          submitted_at: string | null
          summary: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          article_topic?: string | null
          category?: string | null
          content?: string | null
          content_type?: string | null
          created_at?: string | null
          created_by_admin_id?: string | null
          default_email_template?: string | null
          default_key_insights?: string[] | null
          default_social_content?: Json | null
          default_video_script?: string | null
          id?: string
          image_url?: string | null
          industry?: string | null
          last_edited_by_admin_id?: string | null
          metadata?: Json | null
          position?: number | null
          published_at?: string | null
          rejection_reason?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          source_url?: string | null
          status?: Database["public"]["Enums"]["article_status"] | null
          submitted_at?: string | null
          summary?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          article_topic?: string | null
          category?: string | null
          content?: string | null
          content_type?: string | null
          created_at?: string | null
          created_by_admin_id?: string | null
          default_email_template?: string | null
          default_key_insights?: string[] | null
          default_social_content?: Json | null
          default_video_script?: string | null
          id?: string
          image_url?: string | null
          industry?: string | null
          last_edited_by_admin_id?: string | null
          metadata?: Json | null
          position?: number | null
          published_at?: string | null
          rejection_reason?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          source_url?: string | null
          status?: Database["public"]["Enums"]["article_status"] | null
          submitted_at?: string | null
          summary?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "articles_created_by_admin_id_fkey"
            columns: ["created_by_admin_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articles_last_edited_by_admin_id_fkey"
            columns: ["last_edited_by_admin_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_analytics: {
        Row: {
          conversationId: string
          endedAt: string | null
          errorCount: number
          id: string
          messageCount: number
          selectedArticle: string | null
          selectedContentType: string | null
          sessionDuration: number | null
          sessionId: string
          startedAt: string
          tokensUsed: number | null
          userId: string | null
        }
        Insert: {
          conversationId: string
          endedAt?: string | null
          errorCount?: number
          id?: string
          messageCount?: number
          selectedArticle?: string | null
          selectedContentType?: string | null
          sessionDuration?: number | null
          sessionId: string
          startedAt?: string
          tokensUsed?: number | null
          userId?: string | null
        }
        Update: {
          conversationId?: string
          endedAt?: string | null
          errorCount?: number
          id?: string
          messageCount?: number
          selectedArticle?: string | null
          selectedContentType?: string | null
          sessionDuration?: number | null
          sessionId?: string
          startedAt?: string
          tokensUsed?: number | null
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_analytics_sessionId_fkey"
            columns: ["sessionId"]
            isOneToOne: false
            referencedRelation: "user_sessions"
            referencedColumns: ["sessionId"]
          },
          {
            foreignKeyName: "chat_analytics_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      generations: {
        Row: {
          article_id: string
          content: string | null
          content_array: string[] | null
          content_type: Database["public"]["Enums"]["GenerationContentType"]
          edit_count: number
          edited_at: string | null
          generated_at: string
          id: string
          is_edited: boolean
          original_content: string | null
          original_content_array: string[] | null
          platform: Database["public"]["Enums"]["SocialPlatform"] | null
          tokens_used: number | null
          truetone_snapshot: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          article_id: string
          content?: string | null
          content_array?: string[] | null
          content_type: Database["public"]["Enums"]["GenerationContentType"]
          edit_count?: number
          edited_at?: string | null
          generated_at?: string
          id?: string
          is_edited?: boolean
          original_content?: string | null
          original_content_array?: string[] | null
          platform?: Database["public"]["Enums"]["SocialPlatform"] | null
          tokens_used?: number | null
          truetone_snapshot?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          article_id?: string
          content?: string | null
          content_array?: string[] | null
          content_type?: Database["public"]["Enums"]["GenerationContentType"]
          edit_count?: number
          edited_at?: string | null
          generated_at?: string
          id?: string
          is_edited?: boolean
          original_content?: string | null
          original_content_array?: string[] | null
          platform?: Database["public"]["Enums"]["SocialPlatform"] | null
          tokens_used?: number | null
          truetone_snapshot?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "generations_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_posts: {
        Row: {
          content: Json
          createdAt: string
          id: string
          publishedAt: string | null
          publishedStatus: Database["public"]["Enums"]["PublishedStatus"]
          title: string
          updatedAt: string
        }
        Insert: {
          content: Json
          createdAt?: string
          id?: string
          publishedAt?: string | null
          publishedStatus?: Database["public"]["Enums"]["PublishedStatus"]
          title: string
          updatedAt: string
        }
        Update: {
          content?: Json
          createdAt?: string
          id?: string
          publishedAt?: string | null
          publishedStatus?: Database["public"]["Enums"]["PublishedStatus"]
          title?: string
          updatedAt?: string
        }
        Relationships: []
      }
      page_views: {
        Row: {
          bounce: boolean
          exitPage: boolean
          id: string
          pagePath: string
          pageTitle: string | null
          referrer: string | null
          scrollDepth: number | null
          sessionId: string
          timeOnPage: number | null
          timestamp: string
          userId: string | null
        }
        Insert: {
          bounce?: boolean
          exitPage?: boolean
          id?: string
          pagePath: string
          pageTitle?: string | null
          referrer?: string | null
          scrollDepth?: number | null
          sessionId: string
          timeOnPage?: number | null
          timestamp?: string
          userId?: string | null
        }
        Update: {
          bounce?: boolean
          exitPage?: boolean
          id?: string
          pagePath?: string
          pageTitle?: string | null
          referrer?: string | null
          scrollDepth?: number | null
          sessionId?: string
          timeOnPage?: number | null
          timestamp?: string
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "page_views_sessionId_fkey"
            columns: ["sessionId"]
            isOneToOne: false
            referencedRelation: "user_sessions"
            referencedColumns: ["sessionId"]
          },
          {
            foreignKeyName: "page_views_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sessions: {
        Row: {
          city: string | null
          countryCode: string | null
          deviceType: Database["public"]["Enums"]["Device"]
          endedAt: string | null
          eventsCount: number
          id: string
          ipAddress: string | null
          lastActiveAt: string
          pageViews: number
          region: string | null
          sessionId: string
          startedAt: string
          userAgent: string | null
          userId: string | null
        }
        Insert: {
          city?: string | null
          countryCode?: string | null
          deviceType?: Database["public"]["Enums"]["Device"]
          endedAt?: string | null
          eventsCount?: number
          id?: string
          ipAddress?: string | null
          lastActiveAt?: string
          pageViews?: number
          region?: string | null
          sessionId: string
          startedAt?: string
          userAgent?: string | null
          userId?: string | null
        }
        Update: {
          city?: string | null
          countryCode?: string | null
          deviceType?: Database["public"]["Enums"]["Device"]
          endedAt?: string | null
          eventsCount?: number
          id?: string
          ipAddress?: string | null
          lastActiveAt?: string
          pageViews?: number
          region?: string | null
          sessionId?: string
          startedAt?: string
          userAgent?: string | null
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_sessions_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar: string | null
          category_preferences: string[] | null
          company: string | null
          content_length: string | null
          createdAt: string
          detail_orientation: string | null
          email: string
          emotional_expression: string | null
          engagement_style: string | null
          firstName: string
          formality: string | null
          generation_reset_date: string | null
          humor: string | null
          id: string
          kinde_id: string | null
          lastName: string
          monthly_generation_limit: number | null
          monthly_generations_used: number | null
          name: string
          role: string | null
          stripe_customer_id: string | null
          stripe_price_id: string | null
          stripe_subscription_id: string | null
          subscription_expires_at: string | null
          subscription_status: string | null
          subscription_tier: string | null
          tag_preferences: string[] | null
          tone_of_voice: string | null
          updatedAt: string
          vocabulary: string | null
        }
        Insert: {
          avatar?: string | null
          category_preferences?: string[] | null
          company?: string | null
          content_length?: string | null
          createdAt?: string
          detail_orientation?: string | null
          email: string
          emotional_expression?: string | null
          engagement_style?: string | null
          firstName?: string
          formality?: string | null
          generation_reset_date?: string | null
          humor?: string | null
          id?: string
          kinde_id?: string | null
          lastName?: string
          monthly_generation_limit?: number | null
          monthly_generations_used?: number | null
          name?: string
          role?: string | null
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          subscription_expires_at?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          tag_preferences?: string[] | null
          tone_of_voice?: string | null
          updatedAt: string
          vocabulary?: string | null
        }
        Update: {
          avatar?: string | null
          category_preferences?: string[] | null
          company?: string | null
          content_length?: string | null
          createdAt?: string
          detail_orientation?: string | null
          email?: string
          emotional_expression?: string | null
          engagement_style?: string | null
          firstName?: string
          formality?: string | null
          generation_reset_date?: string | null
          humor?: string | null
          id?: string
          kinde_id?: string | null
          lastName?: string
          monthly_generation_limit?: number | null
          monthly_generations_used?: number | null
          name?: string
          role?: string | null
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          subscription_expires_at?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          tag_preferences?: string[] | null
          tone_of_voice?: string | null
          updatedAt?: string
          vocabulary?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_and_increment_anonymous_generations: {
        Args: { p_ip_address?: string; p_session_id: string }
        Returns: Json
      }
      check_and_increment_user_generations: {
        Args: { user_id: string }
        Returns: Json
      }
      get_locked_generations_count: {
        Args: { user_id: string }
        Returns: number
      }
      get_published_articles: {
        Args: {
          category_filter?: string
          limit_count?: number
          offset_count?: number
          topic_filter?: string
        }
        Returns: {
          article_position: number
          article_topic: string
          category: string
          content: string
          content_type: string
          created_at: string
          default_email_template: string
          default_key_insights: string[]
          default_social_content: Json
          default_video_script: string
          id: string
          image_url: string
          metadata: Json
          published_at: string
          source_url: string
          summary: string
          tags: string[]
          title: string
          updated_at: string
        }[]
      }
      get_user_personalization: {
        Args: { article_uuid: string; user_uuid: string }
        Returns: {
          created_at: string
          generation_count: number
          id: string
          last_generated_at: string
          personalized_email_template: string
          personalized_key_insights: string[]
          personalized_social_content: Json
          personalized_video_script: string
          tokens_used: number
          truetone_settings: Json
        }[]
      }
      increment_user_generations: { Args: { user_id: string }; Returns: number }
      reset_all_eligible_users: { Args: Record<PropertyKey, never>; Returns: Json }
      reset_monthly_generations_if_needed: {
        Args: { user_id: string }
        Returns: Json
      }
      rollback_anonymous_generations: {
        Args: { amount?: number; p_session_id: string }
        Returns: Json
      }
      rollback_user_generations: {
        Args: { amount?: number; user_id: string }
        Returns: Json
      }
      upsert_personalization: {
        Args: {
          article_uuid: string
          email_template?: string
          key_insights?: string[]
          settings?: Json
          social_content?: Json
          tokens?: number
          user_uuid: string
          video_script?: string
        }
        Returns: string
      }
      upsert_personalized_output: {
        Args: {
          p_article_id: string
          p_field_name: string
          p_field_value: Json
          p_last_generated_at: string
          p_tokens_used: number
          p_truetone_settings: Json
          p_user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      article_status: "draft" | "published" | "archived"
      Device: "MOBILE" | "TABLET" | "DESKTOP" | "UNKNOWN"
      GenerationContentType:
        | "KEY_INSIGHTS"
        | "VIDEO_SCRIPT"
        | "EMAIL_TEMPLATE"
        | "SOCIAL_MEDIA"
      PublishedStatus: "DRAFT" | "PUBLISHED" | "ARCHIVED"
      SocialPlatform: "FACEBOOK" | "INSTAGRAM" | "TWITTER" | "LINKEDIN"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database
}
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database
}
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database
}
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof Database
}
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never
