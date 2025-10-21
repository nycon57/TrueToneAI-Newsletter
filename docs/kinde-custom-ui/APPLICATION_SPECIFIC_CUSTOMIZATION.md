# Application-Specific Custom Auth Pages for TrueTone Newsletter

**Updated**: 2025-01-21
**Feature**: Conditional rendering based on Kinde Application Client ID

---

## 🎯 Overview

Kinde allows you to customize authentication pages for **each specific application** within your business account. This means you can have multiple applications (e.g., "TrueTone Newsletter", "TrueTone Dashboard", "TrueTone Admin") all using the **same GitHub repository** but showing **different designs** based on which app is being accessed.

### Key Benefits

✅ **One Repository, Multiple Designs** - Manage all custom auth pages from a single repo
✅ **Application-Specific Branding** - Different look and feel for each application
✅ **No Performance Impact** - Conditional logic runs server-side
✅ **Easy Maintenance** - Update all apps by pushing to one repository
✅ **Scalable** - Add new applications without creating new repos

---

## 🔑 How It Works

### The Client ID Solution

Every application you create in Kinde has a unique **Client ID**. This ID is passed to your custom pages via the `request` object. Your page code can detect which application is active and render the appropriate design.

**Example Flow:**
1. User clicks "Sign In" in **TrueTone Newsletter** app
2. Redirects to `auth.truetoneai.com`
3. Custom page reads `clientId` from request
4. Matches `clientId` to TrueTone Newsletter
5. Renders TrueTone Newsletter-specific branding
6. If different app (e.g., TrueTone Dashboard), renders that app's branding instead

---

## 📋 Implementation Strategy for TrueTone

### Current Application

**TrueTone Newsletter**
- Client ID: `8f8a80b86ec844b5b68e9c570649e05a` (from your .env)
- Purpose: Newsletter subscription and content platform
- Users: Loan officers accessing market insights

### Future Applications (Examples)

You could create additional Kinde applications for:
- **TrueTone Dashboard** - Admin panel with different branding
- **TrueTone Partner Portal** - Partner access with co-branded pages
- **TrueTone Mobile App** - Mobile-specific auth flow

All would use the **same custom UI repository** but display different designs.

---

## 🛠️ Implementation Steps

### Step 1: Find Your Client IDs

**In Kinde Dashboard:**
1. Navigate to: Settings → Applications
2. Select "TrueTone Newsletter" (or your app name)
3. Copy the **Client ID**
4. Repeat for any other applications

**Your Current Client ID:**
```
8f8a80b86ec844b5b68e9c570649e05a
```

### Step 2: Store Client IDs as Environment Variables

**In your custom UI repository**, create a `.env` file:

```bash
# .env (in your custom UI repo, NOT your Next.js app)

# Application Client IDs
CLIENT_ID_NEWSLETTER=8f8a80b86ec844b5b68e9c570649e05a
CLIENT_ID_DASHBOARD=your_dashboard_client_id_here
CLIENT_ID_ADMIN=your_admin_client_id_here

# Builder.io or other CMS (optional)
BUILDER_API_KEY=your_builder_api_key_if_using
```

**Important**: These env vars go in your **custom UI repository** (the GitHub repo connected to Kinde), not in your Next.js app's `.env`.

### Step 3: Update Repository File Structure

```
truetone-kinde-auth-ui/
├── kindeSrc/
│   └── environment/
│       └── pages/
│           ├── layout.tsx              # Global layout with CSS
│           └── (kinde)/
│               └── (default)/
│                   └── page.tsx        # Main page with conditional logic
├── .env                                # Client IDs stored here
├── kinde.json
├── package.json
└── README.md
```

### Step 4: Implement Conditional Logic in page.tsx

**File**: `kindeSrc/environment/pages/(kinde)/(default)/page.tsx`

```tsx
'use server';

import {
  getKindeWidget,
  fetch,
  type KindePageEvent,
} from '@kinde/infrastructure';
import React from 'react';
import { renderToString } from 'react-dom/server.browser';
import Layout from '../../layout';

const DefaultPage: React.FC<KindePageEvent> = async ({ context, request }) => {
  // ============================================================================
  // 1. Get Client ID from request
  // ============================================================================
  const clientId = request.authUrlParams?.clientId || null;

  // ============================================================================
  // 2. Load Application Client IDs from Environment Variables
  // ============================================================================
  const CLIENT_ID_NEWSLETTER = process.env.CLIENT_ID_NEWSLETTER;
  const CLIENT_ID_DASHBOARD = process.env.CLIENT_ID_DASHBOARD;
  const CLIENT_ID_ADMIN = process.env.CLIENT_ID_ADMIN;

  // ============================================================================
  // 3. Determine which auth flow is active (login, register, etc.)
  // ============================================================================
  const authFlow = request?.route?.flow; // 'login', 'register', 'recovery', etc.

  // ============================================================================
  // 4. Conditional Rendering Based on Client ID
  // ============================================================================

  return (
    <Layout context={context} request={request}>
      {/* TrueTone Newsletter Application */}
      {clientId === CLIENT_ID_NEWSLETTER ? (
        <div className="newsletter-auth-container">
          {/* Newsletter-Specific Branding */}
          <div className="newsletter-header">
            <h1>TrueTone Insights</h1>
            <p className="tagline">Market Intelligence for Loan Officers</p>
          </div>

          {/* Dynamic heading based on auth flow */}
          <div className="auth-heading">
            {authFlow === 'login' && <h2>Welcome Back</h2>}
            {authFlow === 'register' && <h2>Get Started Free</h2>}
            {authFlow === 'recovery' && <h2>Reset Your Password</h2>}
          </div>

          {/* Newsletter-specific messaging */}
          <div className="newsletter-features">
            <ul>
              <li>✓ AI-powered market analysis</li>
              <li>✓ Personalized newsletter content</li>
              <li>✓ Multi-channel marketing scripts</li>
              <li>✓ Real-time industry insights</li>
            </ul>
          </div>

          {/* Kinde Widget (form) */}
          <div className="auth-form-wrapper">
            {getKindeWidget()}
          </div>

          {/* Newsletter-specific footer */}
          <div className="newsletter-footer">
            <p>Join 10,000+ loan officers staying ahead of the market</p>
          </div>
        </div>
      ) : clientId === CLIENT_ID_DASHBOARD ? (
        <div className="dashboard-auth-container">
          {/* Dashboard Application - Different Design */}
          <div className="dashboard-header">
            <h1>TrueTone Dashboard</h1>
            <p className="tagline">Analytics & Insights Platform</p>
          </div>

          <div className="auth-heading">
            {authFlow === 'login' && <h2>Sign In to Dashboard</h2>}
            {authFlow === 'register' && <h2>Create Dashboard Account</h2>}
          </div>

          {/* Dashboard-specific features */}
          <div className="dashboard-features">
            <ul>
              <li>✓ Advanced analytics</li>
              <li>✓ Team collaboration</li>
              <li>✓ Custom reports</li>
              <li>✓ API access</li>
            </ul>
          </div>

          <div className="auth-form-wrapper">
            {getKindeWidget()}
          </div>
        </div>
      ) : clientId === CLIENT_ID_ADMIN ? (
        <div className="admin-auth-container">
          {/* Admin Application - Different Design */}
          <div className="admin-header">
            <h1>TrueTone Admin</h1>
            <p className="tagline">Administration Portal</p>
          </div>

          <div className="auth-heading">
            <h2>Admin Sign In</h2>
          </div>

          <div className="auth-form-wrapper">
            {getKindeWidget()}
          </div>

          <div className="admin-notice">
            <p>⚠️ Admin access only. All actions are logged.</p>
          </div>
        </div>
      ) : (
        <div className="default-auth-container">
          {/* Fallback for any other application */}
          <div className="default-header">
            <h1>TrueTone Authentication</h1>
          </div>

          <div className="auth-heading">
            {authFlow === 'login' && <h2>Sign In</h2>}
            {authFlow === 'register' && <h2>Create Account</h2>}
            {authFlow === 'recovery' && <h2>Reset Password</h2>}
          </div>

          <div className="auth-form-wrapper">
            {getKindeWidget()}
          </div>

          <div className="default-footer">
            <p>Client ID: {clientId || 'Not available'}</p>
          </div>
        </div>
      )}
    </Layout>
  );
};

// Export page as string (required by Kinde)
export default async function Page(event: KindePageEvent): Promise<string> {
  const page = await DefaultPage(event);
  return renderToString(page);
}
```

### Step 5: Add Application-Specific CSS in layout.tsx

**File**: `kindeSrc/environment/pages/layout.tsx`

```tsx
import { styles } from './styles'; // Your global styles

interface LayoutProps {
  children: React.ReactNode;
  context: any;
  request: any;
}

export default function Layout({ children, context, request }: LayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Sign In | TrueTone</title>

        {/* Global CSS Custom Properties */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                ${Object.entries(styles)
                  .map(([key, value]) => `${key}: ${value};`)
                  .join('\n                ')}
              }

              /* ============================================ */
              /* NEWSLETTER APPLICATION STYLES */
              /* ============================================ */
              .newsletter-auth-container {
                max-width: 480px;
                margin: 0 auto;
                padding: 2rem;
              }

              .newsletter-header {
                text-align: center;
                margin-bottom: 2rem;
              }

              .newsletter-header h1 {
                font-size: 2rem;
                font-weight: 700;
                color: #6366f1;
                margin-bottom: 0.5rem;
              }

              .newsletter-header .tagline {
                color: #6b7280;
                font-size: 1.125rem;
              }

              .newsletter-features {
                background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
                border-radius: 12px;
                padding: 1.5rem;
                margin-bottom: 2rem;
              }

              .newsletter-features ul {
                list-style: none;
                margin: 0;
                padding: 0;
              }

              .newsletter-features li {
                padding: 0.5rem 0;
                color: #1f2937;
                font-size: 1rem;
              }

              .newsletter-footer {
                text-align: center;
                margin-top: 2rem;
                padding-top: 1.5rem;
                border-top: 1px solid #e5e7eb;
              }

              .newsletter-footer p {
                color: #6b7280;
                font-size: 0.875rem;
                font-weight: 500;
              }

              /* ============================================ */
              /* DASHBOARD APPLICATION STYLES */
              /* ============================================ */
              .dashboard-auth-container {
                max-width: 480px;
                margin: 0 auto;
                padding: 2rem;
                background: linear-gradient(180deg, #1f2937 0%, #111827 100%);
                color: white;
                border-radius: 16px;
              }

              .dashboard-header h1 {
                color: white;
                font-size: 2rem;
                margin-bottom: 0.5rem;
              }

              .dashboard-header .tagline {
                color: #9ca3af;
              }

              .dashboard-features {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 12px;
                padding: 1.5rem;
                margin-bottom: 2rem;
                border: 1px solid rgba(255, 255, 255, 0.1);
              }

              .dashboard-features li {
                color: #e5e7eb;
              }

              /* ============================================ */
              /* ADMIN APPLICATION STYLES */
              /* ============================================ */
              .admin-auth-container {
                max-width: 400px;
                margin: 0 auto;
                padding: 2rem;
                border: 2px solid #ef4444;
                border-radius: 8px;
                background: #fef2f2;
              }

              .admin-header h1 {
                color: #991b1b;
              }

              .admin-notice {
                background: #fee2e2;
                border: 1px solid #fecaca;
                border-radius: 6px;
                padding: 1rem;
                margin-top: 1.5rem;
                text-align: center;
              }

              .admin-notice p {
                color: #991b1b;
                font-size: 0.875rem;
                margin: 0;
              }

              /* ============================================ */
              /* DEFAULT/FALLBACK STYLES */
              /* ============================================ */
              .default-auth-container {
                max-width: 400px;
                margin: 0 auto;
                padding: 2rem;
              }

              .default-footer {
                text-align: center;
                margin-top: 1rem;
                font-size: 0.75rem;
                color: #9ca3af;
              }

              /* ============================================ */
              /* SHARED STYLES */
              /* ============================================ */
              .auth-heading {
                text-align: center;
                margin-bottom: 2rem;
              }

              .auth-heading h2 {
                font-size: 1.5rem;
                font-weight: 600;
                margin: 0;
              }

              .auth-form-wrapper {
                background: white;
                padding: 2rem;
                border-radius: 12px;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
              }

              /* Mobile Responsive */
              @media (max-width: 640px) {
                .newsletter-auth-container,
                .dashboard-auth-container,
                .admin-auth-container,
                .default-auth-container {
                  padding: 1rem;
                }

                .auth-form-wrapper {
                  padding: 1.5rem;
                }
              }
            `,
          }}
        />
      </head>

      <body>
        <div className="auth-page-wrapper">
          {children}
        </div>
      </body>
    </html>
  );
}
```

---

## 🎨 Design Strategy for TrueTone Newsletter

### Newsletter Application Branding

**Primary Focus**: Professional, trustworthy, market-focused

**Color Palette**:
- Primary: Indigo (#6366f1) - Professional and modern
- Secondary: Sky blue gradient - Fresh and trustworthy
- Text: Dark gray (#1f2937) - Readable and professional

**Key Messaging**:
- "Market Intelligence for Loan Officers"
- Feature highlights (AI-powered, personalized, multi-channel)
- Social proof ("Join 10,000+ loan officers")

**Layout**:
- Centered, clean design
- Feature list with checkmarks
- Professional but approachable tone

### If You Add More Applications

**Dashboard** (Example):
- Dark theme for focus
- Analytics-focused messaging
- More technical, data-driven

**Admin Portal** (Example):
- High-contrast for security awareness
- Warning indicators
- Minimal, functional design

---

## 📊 Environment Variables Setup

### In Custom UI Repository (.env)

```bash
# =============================================================================
# TrueTone Application Client IDs
# =============================================================================

# TrueTone Newsletter (Main App)
CLIENT_ID_NEWSLETTER=8f8a80b86ec844b5b68e9c570649e05a

# Future Applications (uncomment when created)
# CLIENT_ID_DASHBOARD=your_dashboard_client_id_here
# CLIENT_ID_ADMIN=your_admin_client_id_here
# CLIENT_ID_MOBILE=your_mobile_client_id_here

# =============================================================================
# Optional: CMS or Dynamic Content
# =============================================================================

# Builder.io (if using for dynamic content)
# BUILDER_API_KEY=your_builder_api_key

# =============================================================================
# Notes
# =============================================================================
#
# - These env vars are for your CUSTOM UI REPOSITORY, not your Next.js app
# - Get Client IDs from: Kinde Dashboard → Settings → Applications
# - Each application you create in Kinde gets a unique Client ID
# - Add new applications here as you create them in Kinde
#
# =============================================================================
```

### In Kinde Dashboard

**To configure environment variables in your custom UI deployment:**

1. Navigate to: Design → Custom code → Settings
2. Add environment variables
3. These will be available to your custom pages at runtime

---

## ✅ Implementation Checklist

### For TrueTone Newsletter (Current)

- [ ] Copy Client ID from Kinde Dashboard (already have: `8f8a80b86ec844b5b68e9c570649e05a`)
- [ ] Add Client ID to custom UI repo `.env` as `CLIENT_ID_NEWSLETTER`
- [ ] Update `page.tsx` with conditional logic
- [ ] Add newsletter-specific CSS to `layout.tsx`
- [ ] Test: Authenticate through Newsletter app, verify custom design appears
- [ ] Commit and push to GitHub
- [ ] Sync in Kinde Dashboard
- [ ] Make deployment live
- [ ] Verify in production

### For Future Applications (When Adding)

- [ ] Create new application in Kinde Dashboard
- [ ] Copy the new Client ID
- [ ] Add to custom UI repo `.env` (e.g., `CLIENT_ID_DASHBOARD=...`)
- [ ] Add new conditional block in `page.tsx`
- [ ] Add application-specific CSS to `layout.tsx`
- [ ] Test with new application
- [ ] Deploy

---

## 🚀 Benefits of This Approach

### Single Repository Management

✅ **One place to manage** all authentication page designs
✅ **Consistent updates** across all applications
✅ **Easier version control** and rollback
✅ **Reduced maintenance overhead**

### Application-Specific Branding

✅ **Tailored experiences** for different user types
✅ **Consistent branding** per application
✅ **Different messaging** for different contexts
✅ **Flexible design** without technical complexity

### Performance

✅ **Server-side rendering** - no client-side performance impact
✅ **No additional requests** - logic runs before page renders
✅ **Fast delivery** - users see correct design immediately

---

## 🐛 Debugging

### Check Which Client ID Is Active

Add this temporarily to your page.tsx to see which Client ID is being detected:

```tsx
<div style={{ background: 'yellow', padding: '10px', textAlign: 'center' }}>
  <strong>DEBUG:</strong> Client ID = {clientId}
</div>
```

### Common Issues

**Issue**: Wrong design appearing
- **Solution**: Verify Client ID in .env matches application in Kinde
- **Check**: `console.log(clientId)` in your page.tsx
- **Verify**: Environment variables loaded correctly in Kinde

**Issue**: All applications showing default design
- **Solution**: Check conditional logic syntax
- **Verify**: Client IDs are exact matches (no extra spaces, quotes, etc.)

**Issue**: Environment variables not loading
- **Solution**: Add env vars in Kinde Dashboard → Design → Custom code → Settings
- **Verify**: Redeploy after adding env vars

---

## 📝 Testing Strategy

### Test Each Application

1. **Create test for Newsletter app**:
   - Log in via Newsletter app
   - Verify Newsletter branding appears
   - Check all auth flows (login, signup, recovery)

2. **If you have multiple apps**:
   - Test each application separately
   - Verify correct branding for each
   - Test all auth flows for each app

3. **Test fallback**:
   - Create a test app in Kinde without adding to conditional logic
   - Verify default design appears

---

## 🎯 Next Steps

1. **Implement for TrueTone Newsletter**
   - Start with the Newsletter application (current)
   - Use the example code provided
   - Test thoroughly

2. **Add More Applications Later**
   - When you create new Kinde applications
   - Simply add new conditional blocks
   - No need to change deployment workflow

3. **Enhance Over Time**
   - Add more dynamic content
   - Integrate with CMS (optional)
   - A/B test different designs per app

---

## 📚 Additional Resources

- [Kinde: Custom Styling Per Application](https://docs.kinde.com/design/customize-with-code/custom-styling-per-application/)
- [Main Implementation Guide](../KINDE_CUSTOM_AUTH_IMPLEMENTATION.md)
- [Example Files](.)

---

**This feature transforms your custom auth pages from a single design to a multi-application authentication platform, all managed from one repository.**

**Last Updated**: 2025-01-21
