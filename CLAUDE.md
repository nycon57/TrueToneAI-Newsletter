# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a Next.js 16 application using the App Router with Turbopack, React 19, TypeScript, and Tailwind CSS 4. The project follows standard Next.js conventions with the `src/app` directory structure.

**TrueTone Insights**: Mobile-first web platform for Loan Officers to view newsletter content, copy marketing scripts, and chat with AI about articles.

## Codebase Map

For detailed architecture documentation, module guides, data flows, and navigation guides, see [docs/CODEBASE_MAP.md](docs/CODEBASE_MAP.md).

**Key Systems**:
- **Authentication**: Kinde Auth with multi-product access control (fail-open/fail-closed strategies)
- **AI Personalization**: TrueTone 8-dimension voice profile + OpenAI streaming generation
- **Subscriptions**: Stripe with FREE (3 lifetime) / PAID (25/month) / PREMIUM tiers
- **Email**: React Email templates with Resend delivery

**Critical Gotchas**:
- FREE tier limits never reset; PAID/PREMIUM reset monthly on payment
- Use `checkAndIncrementAIUsage()` for atomic quota operations
- Kinde Management API requires native domain, not custom domain
- Rate limiting is memory-based (not distributed)

## Development Commands

- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Database Commands

Database operations use Supabase. Schema changes should be made via Supabase migrations.

- Use `mcp__supabase__apply_migration` to apply schema changes
- Use `mcp__supabase__execute_sql` for ad-hoc queries
- Use `mcp__supabase__generate_typescript_types` to regenerate types after schema changes
- Types are stored in `src/types/database.types.ts`

## Architecture Overview

This is a Next.js 16 application built with TypeScript, using the App Router pattern with Turbopack as the default bundler. The application is focused on newsletter/email intelligence functionality.

### Tech Stack
- **Framework**: Next.js 16 with App Router and Turbopack
- **Database**: PostgreSQL with Supabase (typed client)
- **UI**: Radix UI components with shadcn/ui component library
- **Styling**: Tailwind CSS v4
- **Type Safety**: TypeScript with strict configuration
- **Forms**: React Hook Form with Zod validation
- **State Management**: nuqs for URL state management
- **Animation**: Motion for animations
- **Icons**: Lucide React and React Simple Icons
- **Charts**: Recharts for data visualization
- **Code Highlighting**: Shiki with transformers
- **Date Handling**: date-fns
- **Markdown**: react-markdown with remark-gfm
- **Theming**: next-themes for dark/light mode
- **Notifications**: sonner for toast notifications

### Key Directories

- `src/app/` - Next.js App Router pages and API routes
  - `api/newsletter/[uuid]/` - Newsletter API endpoints
  - `newsletter/[uuid]/` - Newsletter display pages
- `src/components/ui/` - Reusable UI components (shadcn/ui based)
- `src/components/ui/kibo-ui` - Kibo UI is a custom registry of composable, accessible and open source components designed for use with shadcn/ui.
- `src/lib/` - Utility functions and Supabase client setup
- `src/lib/supabase/` - Supabase client configuration (server.ts, client.ts)
- `src/types/` - TypeScript types including database.types.ts
- `src/hooks/` - Custom React hooks

### Database Schema

Uses PostgreSQL with two main models:
- **User**: Stores user profile information (id, name, email, company)
- **Post**: Newsletter posts with JSON content and publication workflow (DRAFT/PUBLISHED/ARCHIVED)
  - Example of JSONB `content` data
  ```json
  {
    "articles": [
      {
        "title": "Fed Cuts Rates: What This Means for Your Clients",
        "summary": "The Federal Reserve announced a 0.25% rate cut today, creating new opportunities for homebuyers and those looking to refinance. This marks the first rate reduction in six months.",
        "position": 1,
        "content_type": "article",
        "created_at": "2025-07-13T14:00:00Z",
        "updated_at": "2025-07-13T14:00:00Z",
        "article_topic": "rate_alert",
        "key_insights": [
          "Rate changes create immediate opportunities for strategic refinancing and new purchases",
          "Refinancing could save homeowners $150–400 monthly on typical mortgages",
          "Market competition likely to increase as buyers return with renewed confidence",
          "First-time buyers gain access to previously unaffordable price ranges"
        ],
        "video_script": "Hey everyone! Breaking news from the Fed - they just cut rates by a quarter point!\n\nThis is HUGE for your home buying plans. Here's what you need to know:\n\nFirst, mortgage rates are likely to drop in the coming weeks. If you've been waiting to buy, this could be your moment.\n\nSecond, if you bought in the last year at a higher rate, refinancing might now make sense. I can run the numbers for you.\n\nAnd third, this might mean more competition as buyers jump back into the market.\n\nDon't wait - let's talk today about how to take advantage of this opportunity. Drop me a message or call me directly. Let's get you into your dream home while rates are dropping!",
        "email_template": "Subject: 🏠 Fed Rate Cut - Great News for Your Home Plans!\n\nHi [Client Name],\n\nThe Federal Reserve just announced a 0.25% rate cut. Here’s why this matters:\n\n✅ Lower monthly mortgage payments\n✅ You may qualify for a higher loan amount\n✅ Refi opportunities if you bought in the past 18 months\n\nLet’s schedule a quick call to review your numbers and see how you can take advantage.\n\n- [Your Name]",
        "social_content": {
          "twitter": "BREAKING: The Fed just cut rates by 0.25%! Time to talk strategy. #mortgage #refi",
          "facebook": "📉 The Fed just cut rates by 0.25%! Lower payments and more buying power—let’s talk about what this means for you.",
          "linkedin": "The Fed’s rate cut opens the door for buyers and refinancers alike. Let’s connect to map out your next move.",
          "instagram": "Rate drop alert 💥 Ready to refi or finally buy? Let’s make a plan. #MortgageNews #FedCut"
        }
      },
      {
        "title": "New FHA Loan Limits Give First-Time Buyers a Boost",
        "summary": "The FHA has raised its loan limits for 2025, giving first-time and low-to-moderate income buyers more purchasing power across the country.",
        "position": 2,
        "content_type": "article",
        "created_at": "2025-07-12T10:00:00Z",
        "updated_at": "2025-07-12T10:00:00Z",
        "article_topic": "program_update",
        "key_insights": [
          "New FHA limits are up by an average of 8% nationwide",
          "First-time buyers can now access homes in higher price ranges with low down payments",
          "Great opportunity in high-cost areas where affordability was previously limited",
          "Higher loan caps may help buyers avoid jumbo pricing and stricter guidelines"
        ],
        "video_script": "Hey everyone, big news from FHA! Loan limits have increased for 2025.\n\nThis means more buying power for first-time homebuyers and low-to-moderate income families.\n\nIf you thought you were priced out of the market, this update could change everything.\n\nReach out today and I’ll help you see what’s now possible with the new FHA limits!",
        "email_template": "Subject: New FHA Loan Limits = More Buying Power!\n\nHi [Client Name],\n\nFHA just increased its loan limits for 2025. This could mean:\n\n✅ A bigger home within your reach\n✅ More options in high-cost areas\n✅ Easier qualification with low down payments\n\nWant to know how much more you qualify for under the new limits?\nLet’s run the numbers together this week!\n\n- [Your Name]",
        "social_content": {
          "twitter": "FHA loan limits are UP for 2025—great news for buyers! #FHAloans #FirstTimeBuyer",
          "facebook": "📈 FHA just raised loan limits! That means more home for your budget—especially if you’re a first-time buyer.",
          "linkedin": "The new FHA limits for 2025 expand access for first-time buyers and moderate-income families. Reach out to explore your options.",
          "instagram": "New year, new limits! FHA’s increase gives you a homebuying boost 🙌 Let’s check your numbers. #FHA2025 #HomeGoals"
        }
      },
      {
        "title": "Mortgage Credit Scores Just Got Easier with FICO 10T",
        "summary": "The rollout of the FICO 10T scoring model may help more borrowers qualify for loans thanks to its expanded credit history view and trended data.",
        "position": 4,
        "content_type": "article",
        "created_at": "2025-07-11T08:00:00Z",
        "updated_at": "2025-07-11T08:00:00Z",
        "article_topic": "credit_update",
        "key_insights": [
          "FICO 10T uses trended data—how you’ve managed credit over time, not just at one point",
          "May improve scores for responsible users who had temporary past dips",
          "Could increase mortgage access for renters, gig workers, and low credit file borrowers",
          "Lenders adopting this model may expand credit eligibility over time"
        ],
        "video_script": "Good news for borrowers! A new credit model—FICO 10T—is rolling out.\n\nWhat makes it different? It looks at how you manage credit over time, not just a snapshot in time.\n\nThis could mean higher scores and better loan options, especially for those with thin or recovering credit profiles.\n\nLet’s take a look at your score strategy and see if this new model works in your favor.",
        "email_template": "Subject: A New Credit Score Model Could Help You Qualify\n\nHi [Client Name],\n\nFICO 10T is the newest scoring model being adopted by mortgage lenders. It considers:\n\n✅ How you use and pay credit over time\n✅ Positive changes in your credit habits\n✅ A more forgiving picture of your financial story\n\nThis may mean higher scores and more options for you. Want to check where you stand?\n\nLet’s take 15 minutes to review your situation.\n\n- [Your Name]",
        "social_content": {
          "twitter": "FICO 10T may mean better scores and better rates. Ask me how it could help your mortgage goals. #FICO10T",
          "facebook": "A new credit scoring model is here—and it could boost your mortgage options 📊 Let’s talk FICO 10T.",
          "linkedin": "The new FICO 10T scoring model is changing how lenders assess creditworthiness. Great opportunity for credit-rebuilding borrowers and first-time homebuyers alike.",
          "instagram": "FICO 10T looks at your credit over time 📈 Not just one moment. That’s a game changer. #HomeLoanHelp"
        }
      },
      {
        "title": "Ready to 10X Your Content",
        "summary": "Turn insights into action",
        "position": 3,
        "content_type": "ad",
        "created_at": "2025-07-11T08:00:00Z",
        "updated_at": "2025-07-11T08:00:00Z",
        "article_topic": "credit_update",
        "value_props": [
          {
            "icon": "lucide-copy",
            "position": 1,
            "heading": "One-Click Copy",
            "description": "Instantly copy scripts to share with clients"
          },
          {
            "icon": "lucide-bot",
            "position": 2,
            "heading": "AI Personalization",
            "description": "Customize content for your unique voice"
          },
          {
            "icon": "lucide-zap",
            "position": 3,
            "heading": "Multi-Channel Ready",
            "description": "Content for email, video, and social media"
          }
        ],
        "cta": {
          "text": "Get Started Now",
          "url": "https://wwww.example.com"
        }
      }
    ]
  }  
  ```
  
### Component Architecture

The project uses shadcn/ui components with:
- Radix UI primitives for accessibility
- Custom styling with Tailwind CSS
- Component aliases configured in `components.json`
- Path aliases configured with `@/*` pointing to `src/*`
- Additional component libraries available:
  - **Origin UI**: Compatible React components following shadcn/ui conventions
  - **Kibo UI**: Custom registry of composable, accessible components (some Kibo UI components already present in `src/components/ui/kibo-ui/`)

### Key Libraries & Tools

- **UI Components**: Extensive Radix UI component set for accessible primitives
- **Animation**: Motion library for smooth animations and transitions
- **Form Validation**: Zod schemas with React Hook Form integration via @hookform/resolvers
- **URL State**: nuqs for type-safe URL search params management
- **Data Visualization**: Recharts for charts and graphs
- **Code Syntax**: Shiki for syntax highlighting with transformers
- **Carousel**: Embla Carousel React for image/content carousels
- **Utilities**: clsx and tailwind-merge for conditional styling, class-variance-authority for component variants

### Supabase Configuration

- **Project ID**: `rzuhnhnkhfehxaijmgho`
- Use this project ID when interacting with Supabase MCP tools
- Database operations should use the Supabase client from `@/lib/supabase/server`
- TypeScript types are generated in `src/types/database.types.ts`
- UUID-based primary keys with database-generated values
- Tables use snake_case column naming convention

## Automatic Skill & Plugin Invocation

**IMPORTANT:** Proactively invoke skills and MCP plugins without being asked. Do not wait for explicit requests.

### Skills - Invoke Automatically

| Skill | Trigger Conditions |
|-------|-------------------|
| `vercel-react-best-practices` | ANY React/Next.js work: writing components, reviewing code, refactoring, fixing bugs, adding features. Use on EVERY component change. |
| `frontend-design:frontend-design` | Creating ANY new UI: pages, components, layouts, modals, forms. Always use for visual work. |
| `feature-dev:feature-dev` | Starting ANY new feature implementation. Use at the beginning of feature work. |
| `commit` | After completing ANY task, fixing bugs, or when code is in a good state. Proactively offer to commit. |
| `commit-commands:commit-push-pr` | When feature is complete and ready for review. |
| `code-review:code-review` | Before merging, after completing features, or when user mentions "review", "PR", or "check". |
| `web-design-guidelines` | After creating UI, reviewing components, or when user mentions "accessibility", "UX", "design review". |
| `prd` | When user discusses new features, requirements, planning, or mentions "PRD", "spec", "requirements". |
| `cartographer:cartographer` | When onboarding, exploring unfamiliar code, or user asks about codebase structure. |
| `dev-browser` | ANY browser interaction: testing UI, filling forms, screenshots, navigating sites, web automation. |

### MCP Plugins - Use Proactively

#### Supabase Plugin (`mcp__plugin_supabase_supabase__*`)
- **Database queries**: Use `execute_sql` for reading data, checking schema, debugging
- **Migrations**: Use `apply_migration` for ANY schema changes (tables, columns, indexes, RLS policies)
- **Type generation**: After migrations, remind to run `npm run db:types`
- **Logs**: Use `get_logs` when debugging errors, checking auth issues, or investigating bugs
- **Advisors**: Use `get_advisors` after DDL changes to check for security/performance issues
- **Edge Functions**: Use `deploy_edge_function` for serverless functions

#### GitHub Plugin (`mcp__plugin_github_github__*`)
- **PRs**: Use `create_pull_request` after pushing feature branches
- **Issues**: Use `list_issues`, `search_issues` when discussing bugs or features
- **Code Search**: Use `search_code` to find patterns across the repo
- **Reviews**: Use `pull_request_read` and `pull_request_review_write` for PR reviews
- **Branches**: Use `list_branches`, `create_branch` for branch management

#### Context7 Plugin (`mcp__plugin_context7_context7__*`)
- **Documentation lookup**: Use `resolve-library-id` then `query-docs` when:
  - Implementing features with external libraries (React Query, Zod, Supabase, etc.)
  - Uncertain about API usage or best practices
  - User asks "how do I..." for any library
  - Debugging library-specific issues
- **Always check docs** for: Next.js, Supabase, TanStack Query, Zod, Radix UI, Tailwind, Framer Motion

#### Browser Automation (`mcp__claude-in-chrome__*`)
- Use for ANY request involving:
  - Testing the app in browser
  - Taking screenshots
  - Filling out forms
  - Navigating websites
  - Web scraping or data extraction
  - Visual verification of UI changes

### Invocation Rules

1. **Don't ask permission** - Invoke skills/plugins when conditions are met
2. **Chain skills** - Use multiple skills in sequence (e.g., `feature-dev` → code → `vercel-react-best-practices` → `commit`)
3. **Lookup before implementing** - Use Context7 to check library docs before writing integration code
4. **Verify with Supabase plugin** - Query database directly to verify schema, test queries, check RLS
5. **Always review** - Use `code-review` or `web-design-guidelines` after significant changes
