# Database Schema Documentation

Complete database schema documentation for TrueTone AI Newsletter application using PostgreSQL and Prisma ORM.

## 🗄️ Overview

The database uses **PostgreSQL** with **Prisma ORM** for type-safe database operations. The schema supports a newsletter platform with user engagement tracking and content management.

### Key Features
- UUID-based primary keys for security and scalability
- JSONB storage for flexible newsletter content
- User engagement tracking with device analytics
- Publication workflow with status management
- Foreign key constraints with cascade deletes

---

## 📊 Entity Relationship Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│      User       │     │      Like       │     │      Post       │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (UUID) PK    │◄─┐  │ id (UUID) PK    │  ┌─►│ id (UUID) PK    │
│ email (unique)  │  │  │ userId (UUID) FK│──┘  │ title           │
│ firstName       │  │  │ postId (UUID) FK│─────┘ content (JSONB) │
│ lastName        │  │  │ contentId       │     │ publishedStatus │
│ name            │  │  │ contentType     │     │ publishedAt     │
│ company         │  │  │ contentTitle    │     │ createdAt       │
│ createdAt       │  │  │ deviceType      │     │ updatedAt       │
│ updatedAt       │  │  │ timestamp       │     └─────────────────┘
└─────────────────┘  │  └─────────────────┘
                     │
                     └─── One-to-Many relationship
```

---

## 📋 Table Schemas

### `users` Table

Stores user profile information and authentication data.

```sql
CREATE TABLE users (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email     TEXT NOT NULL UNIQUE,
  firstName TEXT NOT NULL DEFAULT 'Not Set',
  lastName  TEXT NOT NULL DEFAULT 'Not Set', 
  name      TEXT NOT NULL DEFAULT 'Not Set',
  company   TEXT,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL
);
```

**Prisma Model:**
```prisma
model User {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  name      String   @default("Not Set")
  firstName String   @default("Not Set")
  lastName  String   @default("Not Set")
  email     String   @unique
  company   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  likes     Like[]
  
  @@map("users")
}
```

**Field Descriptions:**
- `id` - Auto-generated UUID primary key
- `email` - Unique email address for authentication
- `firstName`, `lastName`, `name` - User name fields with defaults for existing records
- `company` - Optional company affiliation
- `createdAt`, `updatedAt` - Automatic timestamp management

---

### `newsletter_posts` Table

Stores newsletter content with rich JSONB data and publication workflow.

```sql
CREATE TABLE newsletter_posts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  content         JSONB NOT NULL,
  publishedStatus published_status NOT NULL DEFAULT 'DRAFT',
  publishedAt     TIMESTAMP,
  createdAt       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt       TIMESTAMP NOT NULL
);

CREATE TYPE published_status AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
```

**Prisma Model:**
```prisma
enum PublishedStatus {
  DRAFT
  PUBLISHED  
  ARCHIVED
}

model Post {
  id              String          @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  title           String
  content         Json            @db.JsonB
  publishedStatus PublishedStatus @default(DRAFT)
  publishedAt     DateTime?
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
  
  // Relations
  likes           Like[]
  
  @@map("newsletter_posts")
}
```

**Field Descriptions:**
- `id` - Auto-generated UUID primary key
- `title` - Newsletter headline/title
- `content` - Rich JSONB content with articles array
- `publishedStatus` - Workflow state (DRAFT → PUBLISHED → ARCHIVED)
- `publishedAt` - Publication timestamp (null for unpublished)
- `createdAt`, `updatedAt` - Automatic timestamp management

### JSONB Content Structure

The `content` field stores newsletter data as JSONB:

```json
{
  "articles": [
    {
      "id": "article-uuid",
      "contentID": "stable-content-id",
      "title": "Article Title",
      "summary": "Brief description...",
      "position": 1,
      "content_type": "article",
      "article_topic": "rate_alert",
      "created_at": "2025-01-15T10:00:00Z",
      "updated_at": "2025-01-15T10:00:00Z",
      "key_insights": [
        "Key insight 1",
        "Key insight 2"
      ],
      "video_script": "Script content...",
      "email_template": "Email content...",
      "social_content": {
        "facebook": "Facebook post...",
        "linkedin": "LinkedIn post...", 
        "twitter": "Twitter post...",
        "instagram": "Instagram post..."
      },
      "value_props": [
        {
          "icon": "lucide-copy",
          "position": 1,
          "heading": "One-Click Copy",
          "description": "Instantly copy scripts"
        }
      ],
      "cta": {
        "text": "Get Started",
        "url": "https://example.com"
      }
    }
  ]
}
```

---

### `likes` Table

Tracks user engagement with newsletter content including analytics data.

```sql
CREATE TABLE likes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  postId       UUID NOT NULL REFERENCES newsletter_posts(id) ON DELETE CASCADE,
  contentId    TEXT NOT NULL,
  contentType  content_type NOT NULL,
  contentTitle TEXT NOT NULL,
  deviceType   device NOT NULL DEFAULT 'UNKNOWN',
  timestamp    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT unique_user_content_like 
    UNIQUE (userId, postId, contentId, contentType)
);

CREATE TYPE content_type AS ENUM (
  'ARTICLE',
  'KEY_INSIGHTS', 
  'VIDEO_SCRIPT',
  'EMAIL_TEMPLATE',
  'SOCIAL_CONTENT'
);

CREATE TYPE device AS ENUM ('MOBILE', 'TABLET', 'DESKTOP', 'UNKNOWN');

-- Indexes for performance
CREATE INDEX idx_likes_post_content_type ON likes(postId, contentType);
CREATE INDEX idx_likes_user ON likes(userId);
CREATE INDEX idx_likes_timestamp ON likes(timestamp);
```

**Prisma Model:**
```prisma
enum ContentType {
  ARTICLE
  KEY_INSIGHTS
  VIDEO_SCRIPT
  EMAIL_TEMPLATE
  SOCIAL_CONTENT
}

enum Device {
  MOBILE
  TABLET
  DESKTOP
  UNKNOWN
}

model Like {
  id           String      @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  userId       String      @db.Uuid
  postId       String      @db.Uuid
  contentId    String
  contentType  ContentType
  contentTitle String
  deviceType   Device      @default(UNKNOWN)
  timestamp    DateTime    @default(now())
  
  // Relations
  user         User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  post         Post        @relation(fields: [postId], references: [id], onDelete: Cascade)
  
  // Constraints and indexes
  @@unique([userId, postId, contentId, contentType])
  @@index([postId, contentType])
  @@index([userId])
  @@index([timestamp])
  @@map("likes")
}
```

**Field Descriptions:**
- `id` - Auto-generated UUID primary key
- `userId` - Foreign key to users table
- `postId` - Foreign key to newsletter_posts table
- `contentId` - Stable identifier from JSONB content
- `contentType` - Type of content being liked (enum)
- `contentTitle` - Human-readable content title
- `deviceType` - Device classification for analytics
- `timestamp` - When the like was created

---

## 🔗 Relationships

### User → Likes (One-to-Many)
- One user can like multiple pieces of content
- Cascade delete: Deleting user removes all their likes
- Foreign key: `likes.userId → users.id`

### Post → Likes (One-to-Many)  
- One newsletter post can have multiple likes across different content
- Cascade delete: Deleting post removes all likes on that post
- Foreign key: `likes.postId → newsletter_posts.id`

### Unique Constraints
- Users cannot like the same content multiple times
- Composite unique key: `(userId, postId, contentId, contentType)`

---

## 📈 Indexes and Performance

### Primary Indexes
- All tables have UUID primary keys with B-tree indexes
- Unique constraint on `users.email`
- Composite unique constraint on like relationships

### Secondary Indexes
```sql
-- Fast lookup of likes by post and content type
CREATE INDEX idx_likes_post_content_type ON likes(postId, contentType);

-- Fast lookup of user's likes
CREATE INDEX idx_likes_user ON likes(userId);

-- Time-based analytics queries
CREATE INDEX idx_likes_timestamp ON likes(timestamp);
```

### Query Optimization
- JSONB content uses GIN indexes for efficient queries
- Prepared statements via Prisma for consistent performance
- Connection pooling via Prisma Accelerate

---

## 🔄 Data Flow Patterns

### Newsletter Content Flow
1. **Draft Creation** - Post created with `DRAFT` status
2. **Content Editing** - JSONB content updated with articles
3. **Publication** - Status changed to `PUBLISHED`, `publishedAt` set
4. **User Access** - Published posts visible to users
5. **Engagement** - Users like content, creating Like records
6. **Analytics** - Aggregate queries on Like data for insights

### Like Interaction Flow
1. **User Action** - User clicks like button on content
2. **Validation** - Check if like already exists for this user/content
3. **Toggle** - Create new like or delete existing like
4. **Response** - Return new like status and count
5. **Analytics** - Track device type and timestamp for analysis

---

## 🛠️ Prisma Configuration

### Client Generation
```typescript
// Generated to: src/generated/prisma/
import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})
```

### Connection Setup
```env
# Connection pooling for serverless
DATABASE_URL="postgres://...?pgbouncer=true&connection_limit=1"

# Direct connection for migrations  
DIRECT_URL="postgres://..."
```

### Migration Commands
```bash
# Generate Prisma client after schema changes
npx prisma generate

# Push schema changes to database
npx prisma db push

# Create and apply migration
npx prisma migrate dev --name "description"

# Open database browser
npx prisma studio
```

---

## 📊 Analytics Queries

### Common Query Patterns

**Most liked content by type:**
```sql
SELECT 
  contentType,
  COUNT(*) as like_count
FROM likes 
WHERE postId = $1
GROUP BY contentType
ORDER BY like_count DESC;
```

**User engagement by device:**
```sql
SELECT 
  deviceType,
  COUNT(*) as interactions,
  COUNT(DISTINCT userId) as unique_users
FROM likes
WHERE timestamp >= NOW() - INTERVAL '30 days'
GROUP BY deviceType;
```

**Top performing articles:**
```sql
SELECT 
  l.contentId,
  l.contentTitle,
  COUNT(*) as likes,
  COUNT(DISTINCT l.userId) as unique_users
FROM likes l
JOIN newsletter_posts p ON l.postId = p.id
WHERE p.publishedStatus = 'PUBLISHED'
  AND l.contentType = 'ARTICLE'
GROUP BY l.contentId, l.contentTitle
ORDER BY likes DESC
LIMIT 10;
```

---

## 🔒 Security Considerations

### Data Protection
- UUID primary keys prevent enumeration attacks
- Foreign key constraints ensure referential integrity
- Cascade deletes prevent orphaned records

### Access Control
- User authentication required for like operations
- Published content filtering prevents access to drafts
- Rate limiting on API endpoints

### Compliance
- User data deletion via cascade operations
- Audit trail via timestamp fields
- Device tracking for analytics (anonymized)

---

**Last Updated**: January 2025  
**Schema Version**: 1.0  
**Database**: PostgreSQL with Prisma ORM  
**Client Location**: `src/generated/prisma/`