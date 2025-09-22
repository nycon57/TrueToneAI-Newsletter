# Analytics Architecture Plan

## 🎯 Objectives

Design and implement a comprehensive analytics tracking system for TrueTone AI Newsletter that provides actionable insights into user behavior, engagement patterns, and business metrics.

## 🏗️ System Architecture

### 1. Event Tracking Layer
```
User Interactions → Event Collector → Event Queue → Batch Processor → Database
                                   ↓
                               Real-time Analytics
```

### 2. Data Collection Strategy

#### A. Client-Side Tracking
- **Page Views**: Route changes, time spent, scroll depth
- **User Interactions**: Button clicks, form submissions, navigation
- **Content Engagement**: Article views, like interactions, copy actions
- **AI Chat Usage**: Message count, session duration, conversation depth
- **Performance Metrics**: Load times, error rates, user experience

#### B. Server-Side Analytics
- **API Usage**: Endpoint performance, error rates, response times
- **User Sessions**: Login/logout, session duration, device switching
- **Geolocation**: IP-based location insights, regional content preferences
- **Business Metrics**: Content engagement rates, feature adoption

### 3. Enhanced Database Schema

#### Analytics Tables
```sql
-- Enhanced session tracking
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  session_id TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  device_type device_enum,
  country_code CHAR(2),
  region TEXT,
  city TEXT,
  started_at TIMESTAMP DEFAULT NOW(),
  last_active_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP,
  page_views INTEGER DEFAULT 0,
  events_count INTEGER DEFAULT 0
);

-- Comprehensive event tracking
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES user_sessions(id),
  user_id UUID REFERENCES users(id),
  event_type TEXT NOT NULL,
  event_action TEXT NOT NULL,
  event_category TEXT,
  event_label TEXT,
  event_value NUMERIC,
  page_path TEXT,
  element_id TEXT,
  element_type TEXT,
  metadata JSONB,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Page view tracking with detailed metrics
CREATE TABLE page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES user_sessions(id),
  user_id UUID REFERENCES users(id),
  page_path TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  time_on_page INTEGER, -- seconds
  scroll_depth INTEGER, -- percentage
  exit_page BOOLEAN DEFAULT FALSE,
  bounce BOOLEAN DEFAULT FALSE,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- AI chat analytics
CREATE TABLE chat_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES user_sessions(id),
  user_id UUID REFERENCES users(id),
  conversation_id TEXT NOT NULL,
  message_count INTEGER DEFAULT 0,
  session_duration INTEGER, -- seconds
  selected_article TEXT,
  selected_content_type TEXT,
  tokens_used INTEGER,
  error_count INTEGER DEFAULT 0,
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP
);
```

## 🔧 Implementation Strategy

### Phase 1: Foundation (High Priority)
1. **Analytics Service Setup**
   - Create centralized analytics service
   - Set up event batching and queuing
   - Implement type-safe event schemas

2. **Database Enhancement**
   - Add analytics tables to Prisma schema
   - Create indexes for query optimization
   - Set up data retention policies

3. **Basic Event Tracking**
   - Page view tracking with route changes
   - Button click tracking across components
   - Enhanced like tracking integration

### Phase 2: Advanced Analytics (Medium Priority)
1. **Session Management**
   - User session tracking with device fingerprinting
   - Session duration and activity monitoring
   - Cross-device session correlation

2. **Geolocation Integration**
   - IP-based location detection
   - Regional analytics and insights
   - Location-based content recommendations

3. **AI Chat Analytics**
   - Conversation tracking and metrics
   - Usage pattern analysis
   - Performance monitoring

### Phase 3: Integration & Optimization (Medium Priority)
1. **Third-Party Integration**
   - Microsoft Clarity setup and configuration
   - Sentry error tracking integration
   - Analytics dashboard creation

2. **Performance Optimization**
   - Event batching optimization
   - Database query optimization
   - Real-time analytics pipeline

## 📱 Event Types and Tracking

### User Interaction Events
```typescript
interface AnalyticsEvent {
  type: 'click' | 'view' | 'scroll' | 'form' | 'ai_chat' | 'like' | 'copy'
  action: string
  category: string
  label?: string
  value?: number
  metadata?: Record<string, any>
}

// Example Events
const events = {
  pageView: {
    type: 'view',
    action: 'page_view',
    category: 'navigation',
    label: '/newsletter/uuid',
    metadata: { referrer, timeOnPage, scrollDepth }
  },
  buttonClick: {
    type: 'click', 
    action: 'button_click',
    category: 'interaction',
    label: 'copy_email_template',
    metadata: { contentId, buttonType, position }
  },
  aiChatMessage: {
    type: 'ai_chat',
    action: 'message_sent',
    category: 'ai_interaction',
    value: messageLength,
    metadata: { conversationId, selectedArticle, responseTime }
  }
}
```

### Content Engagement Tracking
- **Newsletter Views**: Article opens, time spent, scroll progression
- **Content Interactions**: Likes, shares, copy actions, AI customizations
- **User Journey**: Navigation patterns, content discovery paths
- **Feature Usage**: Tool adoption, feature engagement rates

## 🚀 Implementation Plan

### Analytics Service Architecture
```
src/lib/analytics/
├── index.ts              # Main analytics service
├── events.ts             # Event type definitions
├── collectors/           # Data collection modules
│   ├── pageview.ts       # Page view tracking
│   ├── interactions.ts   # Button/element interactions  
│   ├── chat.ts          # AI chat analytics
│   └── performance.ts    # Performance metrics
├── processors/           # Data processing
│   ├── batch.ts         # Event batching
│   ├── geolocation.ts   # IP geolocation
│   └── aggregation.ts   # Data aggregation
└── integrations/         # Third-party integrations
    ├── clarity.ts        # Microsoft Clarity
    ├── sentry.ts         # Sentry error tracking
    └── database.ts       # Database operations
```

### Client-Side Integration
- **React Hooks**: `useAnalytics`, `usePageView`, `useClickTracking`
- **Higher-Order Components**: Analytics-enabled components
- **Event Collectors**: Automatic tracking with manual override capabilities
- **Performance Impact**: <1ms per event, batched sending every 5 seconds

### Server-Side Analytics API
- **Event Ingestion**: `/api/analytics/events` (batch processing)
- **Session Management**: `/api/analytics/sessions` (session lifecycle)
- **Geolocation**: IP-to-location resolution with caching
- **Aggregation**: Real-time metrics calculation and caching

## 📊 Analytics Dashboard & Insights

### Key Metrics Dashboard
1. **User Engagement**
   - Daily/Weekly/Monthly active users
   - Session duration and page views
   - Content engagement rates
   - Feature adoption metrics

2. **Content Performance**
   - Most liked articles and content types
   - Content consumption patterns
   - AI chat usage by content
   - Regional content preferences

3. **Technical Performance**
   - Page load times and user experience
   - Error rates and issue tracking
   - Device/browser usage patterns
   - Geographic user distribution

4. **Business Intelligence**
   - User journey and conversion funnels
   - Feature usage and adoption rates
   - Growth metrics and trend analysis
   - ROI on content and features

## 🔍 Data Privacy & Performance

### Performance Optimization
- **Event Batching**: Collect events locally, send in batches every 5-10 seconds
- **Background Processing**: Analytics processing doesn't block user interactions
- **Efficient Indexing**: Optimized database indexes for fast queries
- **Caching Strategy**: Aggregate data caching for dashboard performance

### Data Management
- **Data Retention**: Configurable retention policies (default: 1 year raw data, 2 years aggregated)
- **Anonymization**: IP address truncation and user data anonymization options
- **Data Export**: Analytics data export capabilities for external analysis
- **Backup Strategy**: Regular backups and disaster recovery procedures

---

**Implementation Priority**: High → Medium → Low  
**Estimated Development Time**: 2-3 weeks for full implementation  
**Performance Impact**: <2% overhead on existing application performance  
**Scalability**: Designed to handle 10x current user load with horizontal scaling