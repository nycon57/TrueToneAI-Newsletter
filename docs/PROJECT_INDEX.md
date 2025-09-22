# TrueTone AI Newsletter - Project Documentation Index

## 📋 Project Overview

**TrueTone Insights** is a mobile-first web platform designed for Loan Officers to view newsletter content, copy marketing scripts, and chat with AI about articles. Built with Next.js 15, TypeScript, and modern web technologies.

### Key Features
- 📱 Mobile-first responsive design
- 📰 Newsletter content management
- 🤖 AI-powered chat for content customization
- ❤️ Content engagement tracking (likes)
- 📊 Analytics and user behavior tracking

## 🏗️ Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict configuration
- **Database**: PostgreSQL with Prisma ORM
- **UI**: Radix UI + shadcn/ui + Tailwind CSS v4
- **Authentication**: Custom implementation
- **AI Integration**: OpenAI GPT-4o-mini
- **Monitoring**: Microsoft Clarity, Sentry

### Project Structure
```
src/
├── app/                    # Next.js App Router pages & API routes
│   ├── api/               # API endpoints
│   │   ├── chat/          # AI chat functionality
│   │   ├── likes/         # Content engagement tracking
│   │   └── newsletter/    # Newsletter data endpoints
│   ├── newsletter/        # Newsletter display pages
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx          # Home page
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui base components
│   │   └── kibo-ui/      # Extended AI-focused components
│   └── newsletter/       # Newsletter-specific components
├── lib/                  # Utility functions & configurations
├── hooks/                # Custom React hooks
└── generated/            # Generated Prisma client
```

## 📚 Documentation Index

### 🔌 [API Documentation](./API_REFERENCE.md)
Complete reference for all API endpoints including:
- Newsletter retrieval and user personalization
- Content engagement (likes) tracking  
- AI chat integration with OpenAI
- Request/response schemas and error handling

### 🎨 [Component Library](./COMPONENT_INDEX.md)
Comprehensive index of UI components including:
- shadcn/ui base components (60+ components)
- Custom Kibo UI components for AI interfaces
- Newsletter-specific components
- Usage examples and props documentation

### 🗄️ [Database Schema](./DATABASE_SCHEMA.md)
Complete database documentation covering:
- Entity relationship diagrams
- Table schemas with field descriptions
- Prisma model relationships
- Migration patterns and best practices

### 🚀 [Development Guide](./DEVELOPMENT_GUIDE.md)
Developer onboarding and workflow documentation:
- Environment setup and configuration
- Development commands and scripts
- Code standards and conventions
- Testing and deployment procedures

### 🎯 [Feature Documentation](./FEATURES.md)
Detailed feature specifications:
- Newsletter content system
- AI chat integration
- User engagement tracking
- Mobile-first responsive design

## 🔗 Quick Links

### Development Commands
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run lint        # Run ESLint
npx prisma studio   # Database management UI
```

### Key Configuration Files
- [`package.json`](../package.json) - Dependencies and scripts
- [`prisma/schema.prisma`](../prisma/schema.prisma) - Database schema
- [`tailwind.config.js`](../tailwind.config.js) - Tailwind configuration
- [`next.config.js`](../next.config.js) - Next.js configuration
- [`CLAUDE.md`](../CLAUDE.md) - AI assistant instructions

### Environment Variables
```env
DATABASE_URL=          # PostgreSQL database connection
DIRECT_URL=           # Direct database connection for migrations
OPENAI_API_KEY=       # OpenAI API key for chat functionality
OPENAI_ORG_ID=        # OpenAI organization ID (optional)
```

## 📊 Project Metrics

### Codebase Statistics
- **Total Files**: 100+ source files
- **Components**: 60+ UI components
- **API Endpoints**: 3 main endpoints
- **Database Tables**: 3 core entities
- **Dependencies**: 50+ production packages

### Performance Targets
- **Load Time**: <3s on 3G networks
- **Bundle Size**: <500KB initial load
- **Accessibility**: WCAG 2.1 AA compliance
- **Mobile Score**: >90 Lighthouse score

## 🔧 Contributing

### Code Standards
- TypeScript strict mode enabled
- ESLint configuration with Next.js rules
- Prettier for code formatting
- Conventional commit messages

### Development Workflow
1. Create feature branch from `main`
2. Implement changes with tests
3. Run linting and type checking
4. Submit pull request with description
5. Code review and merge

---

**Last Updated**: January 2025  
**Version**: 4.0.0  
**Maintainer**: TrueTone AI Team