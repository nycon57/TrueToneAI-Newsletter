# API Reference

Complete reference documentation for TrueTone AI Newsletter API endpoints.

## Base URL
```
http://localhost:3000/api  # Development
https://your-domain.com/api  # Production
```

## Authentication
Currently uses user UUID passed as query parameter or header. Future versions will implement proper JWT-based authentication.

## Endpoints

### 📰 Newsletter API

#### GET `/api/newsletter/[uuid]`
Retrieves newsletter content and user-specific data.

**Parameters:**
- `uuid` (path) - Newsletter post UUID
- `u` (query) - User UUID (required)

**Response:**
```json
{
  "user": {
    "firstName": "John"
  },
  "newsletter": {
    "id": "newsletter-uuid",
    "title": "Market Update - January 2025",
    "publishedAt": "2025-01-15T10:00:00Z",
    "articles": [
      {
        "id": "article-1",
        "contentID": "stable-content-id",
        "title": "Fed Cuts Rates: What This Means for Your Clients",
        "summary": "Rate analysis and client impact...",
        "position": 1,
        "contentType": "article",
        "articleTopic": "rate_alert",
        "keyInsights": [
          "Rate changes create immediate opportunities",
          "Refinancing could save $150-400 monthly"
        ],
        "videoScript": "Hey everyone! Breaking news from the Fed...",
        "emailTemplate": "Subject: 🏠 Fed Rate Cut - Great News!...",
        "socialContent": {
          "facebook": "📉 The Fed just cut rates by 0.25%!...",
          "linkedin": "The Fed's rate cut opens the door...",
          "twitter": "BREAKING: The Fed just cut rates...",
          "instagram": "Rate drop alert 💥 Ready to refi?..."
        },
        "valueProps": [],  // For ad content
        "cta": null       // For ad content
      }
    ],
    "userLikes": [
      {
        "contentId": "content-id",
        "contentType": "ARTICLE"
      }
    ],
    "likeCounts": {
      "content-id": 5
    }
  }
}
```

**Error Responses:**
- `400` - Missing article or user UUID
- `404` - Newsletter not found or user not found
- `500` - Internal server error

---

### ❤️ Likes API

#### POST `/api/likes`
Toggle like status for content (like/unlike).

**Request Body:**
```json
{
  "postId": "newsletter-uuid",
  "contentId": "stable-content-id", 
  "contentType": "ARTICLE",
  "contentTitle": "Fed Cuts Rates: What This Means",
  "userId": "user-uuid"
}
```

**Content Types:**
- `ARTICLE` - Main article content
- `KEY_INSIGHTS` - Key insights section
- `VIDEO_SCRIPT` - Video script section  
- `EMAIL_TEMPLATE` - Email template section
- `SOCIAL_CONTENT` - Social media content

**Response:**
```json
{
  "liked": true,
  "count": 6
}
```

**Features:**
- Rate limiting: 10 requests per minute per user/IP
- Device detection from User-Agent header
- Automatic toggle (like/unlike) functionality
- Duplicate prevention via unique constraint

#### GET `/api/likes`
Retrieve like statistics for a newsletter.

**Query Parameters:**
- `postId` (required) - Newsletter post UUID

**Response:**
```json
{
  "postId": "newsletter-uuid",
  "stats": [
    {
      "contentId": "content-1",
      "contentType": "ARTICLE",
      "count": 5
    },
    {
      "contentId": "content-1", 
      "contentType": "KEY_INSIGHTS",
      "count": 3
    }
  ],
  "total": 8
}
```

---

### 🤖 Chat API

#### POST `/api/chat`
AI-powered chat for content customization and marketing advice.

**Request Body:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Help me customize this email for first-time buyers"
    }
  ],
  "selectedArticle": "Fed Cuts Rates: What This Means",
  "selectedContentType": "email",
  "articleContent": {
    "title": "...",
    "emailTemplate": "...",
    "keyInsights": ["..."]
  }
}
```

**Message Roles:**
- `user` - User message
- `assistant` - AI assistant response

**Response:**
Server-Sent Events (SSE) stream with content chunks:
```
data: {"content": "I'd be happy to help you customize..."}

data: {"content": " this email for first-time buyers..."}

data: [DONE]
```

**Features:**
- Streaming responses via Server-Sent Events
- Context-aware based on selected article and content type
- Professional tone optimized for loan officer marketing
- Compliance-aware suggestions
- Rate limiting and error handling

**AI Model Configuration:**
- Model: `gpt-4o-mini`
- Max tokens: 1000
- Temperature: 0.7
- Top-p: 0.9
- Frequency penalty: 0.3 (reduce repetition)
- Presence penalty: 0.1 (encourage diversity)

## Error Handling

### Standard Error Response Format
```json
{
  "error": "Error message description"
}
```

### Common HTTP Status Codes
- `200` - Success
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing authentication)
- `404` - Not Found (resource doesn't exist)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

### Rate Limiting
- **Likes API**: 10 requests per minute per user/IP combination
- **Chat API**: Standard OpenAI rate limits apply
- **Newsletter API**: No explicit rate limiting (read-only)

## Database Integration

All APIs integrate with PostgreSQL via Prisma ORM:

**Connection Configuration:**
- Primary: Connection pooling via Prisma Accelerate
- Direct: Direct connection for migrations
- Generated client: `src/generated/prisma/`

**Key Models:**
- `User` - User profiles and authentication
- `Post` - Newsletter content with JSONB articles
- `Like` - Content engagement tracking

## Security Considerations

### Input Validation
- All request parameters validated
- SQL injection prevention via Prisma
- XSS prevention via proper encoding

### Rate Limiting
- In-memory rate limiting for development
- Production should use Redis or similar
- Per-user and per-IP tracking

### Content Security
- JSONB content sanitization
- OpenAI content filtering
- Professional compliance guidelines

## Development Notes

### Local Development
```bash
# Start development server
npm run dev

# Access API endpoints
curl http://localhost:3000/api/newsletter/uuid?u=user-uuid
```

### Environment Variables
```env
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
OPENAI_ORG_ID=org-...  # Optional
```

### Testing API Endpoints
Use tools like Postman, curl, or the built-in Next.js API testing:
- Newsletter: `GET /api/newsletter/[uuid]?u=[user-uuid]`
- Likes: `POST /api/likes` with JSON body
- Chat: `POST /api/chat` with streaming response

---

**Last Updated**: January 2025  
**API Version**: 1.0  
**Next.js Version**: 15.3.5