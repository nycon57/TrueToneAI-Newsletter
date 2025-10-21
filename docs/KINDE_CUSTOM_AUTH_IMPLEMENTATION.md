# Kinde Custom Authentication Pages - Implementation Guide

## 📋 Overview

This guide provides step-by-step instructions for implementing custom authentication pages using Kinde's GitHub-connected Custom UI with the Splitscape template. Your authentication pages will be hosted by Kinde on your custom domain with complete design control.

## 🎯 What You'll Achieve

- **Custom Domain**: auth.truetoneai.com (or your chosen subdomain)
- **Fully Branded Auth Pages**: Custom colors, fonts, and layouts
- **Seamless UX**: Users never feel like they've left your application
- **Complete Control**: React Server Components-based customization
- **All Auth Flows**: Sign-in, sign-up, password reset, MFA, social auth

---

## 📦 Prerequisites

Before starting, ensure you have:

- ✅ Kinde account with your application configured
- ✅ GitHub account with repository creation permissions
- ✅ Custom domain access (e.g., truetoneai.com)
- ✅ DNS management access for your domain
- ✅ Node.js and npm installed locally
- ✅ Git installed locally

---

## 🚀 Phase 1: Custom Domain Setup

### Step 1.1: Add Custom Domain in Kinde

1. **Navigate to Kinde Dashboard**
   - Go to: Settings → Environment → Custom domain

2. **Add Custom Domain**
   - Click "Add custom domain"
   - Enter your custom subdomain: `auth.truetoneai.com`
   - Click "Save"

3. **Copy DNS Details**
   - Kinde will generate DNS details
   - Keep this page open - you'll need these values

**Example DNS Details You'll Receive:**
```
CNAME Record 1:
Host: auth
Points to: [kinde-generated-value].cloudfront.net

CNAME Record 2 (Challenge - Keep Forever):
Host: _acme-challenge.auth
Points to: [kinde-generated-challenge].acm-validations.aws
```

### Step 1.2: Configure DNS Records

**For Most DNS Providers:**

1. Log into your DNS provider (GoDaddy, Cloudflare, Namecheap, etc.)
2. Navigate to DNS Management for `truetoneai.com`
3. Add the CNAME records from Kinde

**Record 1 - Main CNAME:**
- Type: `CNAME`
- Name/Host: `auth`
- Value/Points to: [from Kinde DNS details]
- TTL: Auto or 3600

**Record 2 - Challenge (SSL Certificate):**
- Type: `CNAME`
- Name/Host: `_acme-challenge.auth`
- Value/Points to: [from Kinde DNS details]
- TTL: Auto or 3600

**⚠️ Important Notes:**
- **Do NOT delete the challenge record** - it's needed for SSL certificate renewal
- **Cloudflare users**: Set DNS to "DNS only" (not proxied)
- **Multi-level subdomains**: Require additional DNS entries for each level

### Step 1.3: Verify Domain

1. **Wait for Verification**
   - DNS propagation: Minutes to ~2 hours
   - Check status in Kinde: Settings → Environment → Custom domain

2. **Verification Complete When:**
   - Status changes to "Provisioned"
   - SSL certificate is automatically generated
   - Domain shows green checkmark

**Troubleshooting:**
- Use `nslookup auth.truetoneai.com` to verify DNS propagation
- Check TTL - lower values propagate faster
- Contact DNS provider if verification takes >4 hours

---

## 🔧 Phase 2: GitHub Repository Setup

### Step 2.1: Create Repository from Splitscape Template

1. **Visit Splitscape Template**
   - Go to: https://github.com/kinde-starter-kits/custom-ui-splitscape

2. **Use Template**
   - Click green "Use this template" button
   - Select "Create a new repository"

3. **Configure New Repository**
   - Owner: Your GitHub username/organization
   - Repository name: `truetone-kinde-auth-ui` (or your preference)
   - Description: "Custom authentication UI for TrueTone"
   - Visibility: Public or Private (your choice)
   - Click "Create repository"

### Step 2.2: Connect GitHub to Kinde

1. **Navigate to Kinde Git Settings**
   - Go to: Settings → Environment → Git repo

2. **Connect GitHub**
   - Click "Connect repo" (or "Connect GitHub")
   - Authorize Kinde to access GitHub
   - If prompted, select repositories to grant access

3. **Select Repository**
   - Choose: `truetone-kinde-auth-ui`
   - Click "Next"

4. **Select Branch**
   - Choose: `main` (or `master` if that's your default)
   - Click "Save"

5. **Verify Connection**
   - You should see "Connected repo" panel at top of screen
   - Shows: Repository name, branch, last sync time

### Step 2.3: Enable Preview Mode (Optional)

**Note**: Requires Kinde Plus or Scale plan

1. **Navigate to Git Settings**
   - Settings → Git repo

2. **Enable Preview**
   - Toggle "Enable preview mode" ON
   - Allows testing deployments before going live

**If on Free/Pro Plan:**
- Use non-production Kinde environment for testing
- Or test carefully before making live

---

## 🎨 Phase 3: Customize Authentication UI

### Step 3.1: Clone Repository Locally

```bash
# Clone your repository
git clone https://github.com/YOUR_USERNAME/truetone-kinde-auth-ui.git

# Navigate to repository
cd truetone-kinde-auth-ui

# Install dependencies
npm install
```

### Step 3.2: Understand Project Structure

```
truetone-kinde-auth-ui/
├── kindeSrc/                        # Root directory for Kinde custom code
│   └── environment/
│       └── pages/
│           ├── layout.tsx          # Global layout wrapper
│           ├── styles.ts           # CSS custom properties (CUSTOMIZE HERE)
│           └── (kinde)/
│               └── (default)/
│                   └── page.tsx    # Default page template
├── kinde.json                      # Kinde configuration
├── package.json
├── tsconfig.json
└── README.md
```

### Step 3.3: Customize Brand Colors & Styles

**File to Edit**: `kindeSrc/environment/pages/styles.ts`

This file exports CSS custom properties that control the entire authentication experience.

**Example Customization:**

```typescript
// kindeSrc/environment/pages/styles.ts

export const styles = {
  // ===== COLORS =====

  // Primary Brand Color
  '--kinde-button-primary-background-color': '#6366f1', // Indigo (your brand primary)
  '--kinde-button-primary-text-color': '#ffffff',
  '--kinde-button-primary-hover-background-color': '#4f46e5',

  // Secondary Actions
  '--kinde-button-secondary-background-color': '#f3f4f6',
  '--kinde-button-secondary-text-color': '#111827',
  '--kinde-button-secondary-hover-background-color': '#e5e7eb',

  // Text Colors
  '--kinde-base-color': '#111827',                // Primary text
  '--kinde-secondary-color': '#6b7280',           // Secondary text
  '--kinde-tertiary-color': '#9ca3af',            // Tertiary/muted text

  // Background Colors
  '--kinde-page-background-color': '#ffffff',
  '--kinde-card-background-color': '#ffffff',
  '--kinde-card-border-color': '#e5e7eb',

  // Input Fields
  '--kinde-input-background-color': '#ffffff',
  '--kinde-input-border-color': '#d1d5db',
  '--kinde-input-focus-border-color': '#6366f1',
  '--kinde-input-text-color': '#111827',

  // Links
  '--kinde-link-color': '#6366f1',
  '--kinde-link-hover-color': '#4f46e5',

  // Status Colors
  '--kinde-error-color': '#ef4444',
  '--kinde-success-color': '#10b981',
  '--kinde-warning-color': '#f59e0b',

  // ===== TYPOGRAPHY =====

  // Font Family
  '--kinde-base-font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  '--kinde-heading-font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',

  // Font Sizes
  '--kinde-base-font-size': '16px',
  '--kinde-heading-font-size': '24px',
  '--kinde-small-font-size': '14px',

  // ===== SPACING =====

  '--kinde-page-padding': '24px',
  '--kinde-card-padding': '32px',
  '--kinde-button-padding': '12px 24px',

  // ===== BORDERS & RADIUS =====

  '--kinde-border-radius': '8px',
  '--kinde-button-border-radius': '6px',
  '--kinde-input-border-radius': '6px',

  // ===== SHADOWS =====

  '--kinde-card-shadow': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  '--kinde-button-shadow': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
};
```

**Match Your App's Design System:**

Check your `tailwind.config.ts` for consistency:
- Use the same color palette
- Match font families from `src/app/fonts.ts`
- Align border radius values
- Keep consistent spacing scale

### Step 3.4: Customize Page Layout

**File to Edit**: `kindeSrc/environment/pages/layout.tsx`

This is the wrapper for all authentication pages.

**Example Customization:**

```tsx
// kindeSrc/environment/pages/layout.tsx

import { styles } from './styles';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <head>
        <style>{`
          :root {
            ${Object.entries(styles)
              .map(([key, value]) => `${key}: ${value};`)
              .join('\n            ')}
          }
        `}</style>
      </head>
      <body>
        {/* Split-screen layout - left side for branding, right for form */}
        <div className="auth-container">
          {/* Left side - Brand */}
          <div className="auth-brand-section">
            <div className="brand-content">
              {/* Add your logo */}
              <img
                src="https://yourdomain.com/logo.svg"
                alt="TrueTone"
                className="brand-logo"
              />

              {/* Brand messaging */}
              <h1>Welcome to TrueTone Insights</h1>
              <p>Market intelligence for loan officers</p>

              {/* Optional: Feature highlights */}
              <ul className="features">
                <li>✓ AI-powered market analysis</li>
                <li>✓ Personalized content</li>
                <li>✓ Multi-channel distribution</li>
              </ul>
            </div>
          </div>

          {/* Right side - Authentication form (Kinde widget) */}
          <div className="auth-form-section">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
```

### Step 3.5: Customize Page Content

**File to Edit**: `kindeSrc/environment/pages/(kinde)/(default)/page.tsx`

This is the default template for auth pages. You can create route-specific pages later.

**Example Customization:**

```tsx
// kindeSrc/environment/pages/(kinde)/(default)/page.tsx

interface PageProps {
  context: {
    pageType: string;  // 'login', 'register', 'recovery', etc.
    user?: any;
  };
}

export default function Page({ context }: PageProps) {
  // Customize messaging based on page type
  const getMessage = () => {
    switch (context.pageType) {
      case 'login':
        return "Sign in to your account";
      case 'register':
        return "Create your free account";
      case 'recovery':
        return "Reset your password";
      default:
        return "Welcome";
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-header">
        <h2>{getMessage()}</h2>
      </div>

      {/* Kinde widget will render here */}
      <div className="auth-widget-container">
        {/* Widget auto-injected by Kinde */}
      </div>

      {/* Footer */}
      <div className="auth-footer">
        <p>
          <a href="https://truetoneai.com/terms">Terms</a>
          {' · '}
          <a href="https://truetoneai.com/privacy">Privacy</a>
        </p>
      </div>
    </div>
  );
}
```

### Step 3.6: Add Custom Fonts (If Needed)

**Option 1: Google Fonts via CDN**

```tsx
// In layout.tsx <head>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

```typescript
// In styles.ts
'--kinde-base-font-family': '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
```

**Option 2: Self-Hosted Fonts**

Host fonts on your domain (e.g., `https://truetoneai.com/fonts/`):

```css
/* In a custom CSS file hosted on your domain */
@font-face {
  font-family: 'YourCustomFont';
  src: url('https://truetoneai.com/fonts/YourFont.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}
```

### Step 3.7: Update Configuration

**File**: `kinde.json`

```json
{
  "version": "2024-01-01",
  "rootDir": "kindeSrc"
}
```

**Usually no changes needed** unless you restructure directories.

---

## 🚀 Phase 4: Deploy Custom UI

### Step 4.1: Commit and Push Changes

```bash
# Stage all changes
git add .

# Commit with descriptive message
git commit -m "feat: customize TrueTone authentication UI

- Add brand colors and typography
- Customize layout with split-screen design
- Add custom messaging for different auth flows
- Update styles to match main app design system"

# Push to GitHub
git push origin main
```

### Step 4.2: Sync Code in Kinde

1. **Navigate to Custom Code**
   - Kinde Dashboard → Design → Custom code

2. **Sync from GitHub**
   - Click "Sync code" button
   - Kinde pulls latest from your GitHub repo
   - Creates new deployment

3. **Monitor Deployment**
   - Wait for "Deployment successful" status
   - Check for any errors in logs

**If Sync Fails:**
- Check Kinde Code Logs: Design → Custom code → Logs
- Common issues:
  - TypeScript errors
  - Missing dependencies
  - Incorrect file paths

### Step 4.3: Preview Deployment (If Enabled)

**With Preview Mode:**

1. **Access Preview**
   - Design → Custom code → Deployments
   - Find your deployment
   - Click "Preview" link

2. **Test Thoroughly**
   - Test all auth flows (login, register, etc.)
   - Check responsive design
   - Verify branding appears correctly
   - Test error states

**Without Preview Mode:**
- Carefully review code locally
- Check Kinde logs for errors
- Have rollback plan ready

### Step 4.4: Make Deployment Live

1. **Navigate to Deployments**
   - Design → Custom code → Deployments

2. **Select Deployment**
   - Find your latest successful deployment
   - Three-dot menu (⋮) → "Make live"

3. **Confirm**
   - Review changes one more time
   - Click confirm

4. **Verify Live**
   - Status changes to "Live"
   - Custom UI now active on `auth.truetoneai.com`

**🎉 Your custom authentication pages are now live!**

---

## 🔌 Phase 5: Next.js Application Integration

### Step 5.1: Update Environment Variables

**File**: `.env.local`

**Current Configuration:**
```bash
KINDE_CLIENT_ID=8f8a80b86ec844b5b68e9c570649e05a
KINDE_CLIENT_SECRET=giAuokD6Kmq5VljlkXCu0NHz0vrRSGhlk2ZA2EcSIDI1Yv2N4y
KINDE_ISSUER_URL=https://truetoneai.kinde.com
KINDE_SITE_URL=http://localhost:3000
KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000
KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/dashboard
```

**Updated Configuration for Custom Domain:**
```bash
# Kinde Authentication
KINDE_CLIENT_ID=8f8a80b86ec844b5b68e9c570649e05a
KINDE_CLIENT_SECRET=giAuokD6Kmq5VljlkXCu0NHz0vrRSGhlk2ZA2EcSIDI1Yv2N4y

# CRITICAL: Change to custom domain
KINDE_ISSUER_URL=https://auth.truetoneai.com

# For Production - Update these when deploying
KINDE_SITE_URL=http://localhost:3000
KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000
KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/dashboard
```

**Production Environment Variables** (`.env.production`):
```bash
KINDE_ISSUER_URL=https://auth.truetoneai.com
KINDE_SITE_URL=https://truetoneai.com
KINDE_POST_LOGOUT_REDIRECT_URL=https://truetoneai.com
KINDE_POST_LOGIN_REDIRECT_URL=https://truetoneai.com/dashboard
```

### Step 5.2: Update Kinde Application Settings

1. **Navigate to Application Settings**
   - Kinde Dashboard → Settings → Applications
   - Select your application

2. **Update Allowed Callback URLs**

   **Development:**
   ```
   http://localhost:3000/api/auth/kinde_callback
   ```

   **Production - Add:**
   ```
   https://truetoneai.com/api/auth/kinde_callback
   https://auth.truetoneai.com/callback
   ```

3. **Update Allowed Logout Redirect URLs**

   **Development:**
   ```
   http://localhost:3000
   ```

   **Production - Add:**
   ```
   https://truetoneai.com
   https://auth.truetoneai.com
   ```

### Step 5.3: Update Social Authentication Providers

For **each social provider** you've configured (Google, GitHub, etc.), you need to add the custom domain callback URL.

#### Google OAuth

1. **Google Cloud Console**
   - Go to: https://console.cloud.google.com
   - Navigate to: APIs & Services → Credentials
   - Select your OAuth 2.0 Client ID

2. **Add Authorized Redirect URIs**

   Add:
   ```
   https://auth.truetoneai.com/login/callback
   ```

   Keep existing:
   ```
   https://truetoneai.kinde.com/login/callback
   ```

#### GitHub OAuth

1. **GitHub Developer Settings**
   - Go to: https://github.com/settings/developers
   - Select your OAuth App

2. **Update Authorization Callback URL**

   Add:
   ```
   https://auth.truetoneai.com/login/callback
   ```

#### In Kinde Settings

1. **Navigate to Social Connections**
   - Settings → Authentication
   - Find each social provider tile
   - Click "Configure"

2. **Enable Custom Domain**
   - Toggle "Use custom domain instead" ON
   - For each configured provider

### Step 5.4: Test Authentication Locally

```bash
# Start development server
npm run dev
```

**Test Checklist:**

1. **Basic Sign-In**
   - [ ] Click login button
   - [ ] Redirects to `auth.truetoneai.com`
   - [ ] Custom branding displays
   - [ ] Enter credentials
   - [ ] Redirects back to app
   - [ ] User session created

2. **Sign-Up Flow**
   - [ ] Click sign-up
   - [ ] Redirects to custom domain
   - [ ] Custom UI displays
   - [ ] Complete registration
   - [ ] Redirects to onboarding
   - [ ] User created in Kinde

3. **Social Authentication**
   - [ ] Click "Sign in with Google"
   - [ ] Redirects to Google
   - [ ] Authorize
   - [ ] Redirects back correctly
   - [ ] Session created

4. **Password Reset**
   - [ ] Click "Forgot password"
   - [ ] Custom UI displays
   - [ ] Enter email
   - [ ] Receive reset email
   - [ ] Complete reset flow

5. **Logout**
   - [ ] Click logout
   - [ ] Session cleared
   - [ ] Redirects correctly

---

## ✅ Phase 6: Final Verification

### Production Deployment Checklist

Before deploying to production:

- [ ] Custom domain fully verified and provisioned
- [ ] SSL certificate active (check in browser)
- [ ] Custom UI deployment live in Kinde
- [ ] All environment variables updated for production
- [ ] Social auth providers updated with custom domain
- [ ] Callback URLs added to Kinde application settings
- [ ] All auth flows tested in production environment
- [ ] Responsive design verified on mobile/tablet
- [ ] Error pages display correctly
- [ ] Brand assets (logo, fonts) loading properly
- [ ] DNS records verified with `nslookup`
- [ ] Browser console shows no errors
- [ ] Network tab shows successful auth requests

### Security Verification

- [ ] HTTPS enforced on custom domain
- [ ] SSL certificate valid and trusted
- [ ] No mixed content warnings
- [ ] CORS configured correctly
- [ ] CSP (Content Security Policy) allows auth domain
- [ ] Tokens stored securely
- [ ] Session management working correctly

---

## 🔄 Rollback Procedures

### If Issues Arise After Going Live

#### Option 1: Rollback to Previous Deployment

1. **Navigate to Deployments**
   - Kinde Dashboard → Design → Custom code → Deployments

2. **Find Previous Working Deployment**
   - Look for deployment before the problematic one
   - Usually marked with timestamp

3. **Activate Previous Version**
   - Three-dot menu (⋮) → "Make live"
   - Confirm rollback

4. **Verify**
   - Test auth flows
   - Check custom UI displays correctly

#### Option 2: Revert to Default Kinde Pages

1. **Disconnect Git Repository**
   - Settings → Environment → Git repo
   - Click "Disconnect repo"

2. **Update Environment Variables**
   ```bash
   # Change back to default Kinde domain
   KINDE_ISSUER_URL=https://truetoneai.kinde.com
   ```

3. **Redeploy Application**
   - Restart Next.js server
   - Or redeploy to hosting platform

#### Option 3: Keep Custom Domain, Remove Customization

1. **Make Default Deployment Live**
   - Find initial/default deployment
   - Make it live

2. **Custom domain stays active**
   - But shows Kinde's default UI
   - Still benefits from custom domain

---

## 🐛 Troubleshooting

### Custom Domain Not Working

**Symptoms**: Can't access `auth.truetoneai.com`

**Solutions**:
1. Verify DNS propagation: `nslookup auth.truetoneai.com`
2. Check DNS records are correct (CNAME, not A record)
3. Wait longer - DNS can take up to 48 hours
4. Check Kinde status: Settings → Environment → Custom domain
5. Verify SSL certificate provisioned

### Custom UI Not Displaying

**Symptoms**: Default Kinde UI shows instead of custom

**Solutions**:
1. Check deployment is "Live": Design → Custom code → Deployments
2. Verify `KINDE_ISSUER_URL` points to custom domain
3. Clear browser cache and cookies
4. Check deployment logs for errors
5. Ensure GitHub sync completed successfully

### Authentication Redirects Failing

**Symptoms**: Errors after login, broken redirects

**Solutions**:
1. Verify callback URLs in Kinde application settings
2. Check `KINDE_POST_LOGIN_REDIRECT_URL` is correct
3. Ensure social providers have custom domain callback
4. Check browser console for CORS errors
5. Verify environment variables loaded correctly

### Branding Not Appearing

**Symptoms**: Styles/fonts not loading

**Solutions**:
1. Check `styles.ts` syntax for errors
2. Verify CSS custom properties applied correctly
3. Ensure external assets (fonts, images) load via HTTPS
4. Check browser console for 404s on assets
5. Verify asset URLs are correct and accessible

### Social Auth Not Working

**Symptoms**: Social login fails or redirects incorrectly

**Solutions**:
1. Add custom domain callback to provider (Google, GitHub)
2. Toggle "Use custom domain instead" in Kinde
3. Verify provider client ID/secret are correct
4. Check provider's dashboard for error messages
5. Test with original Kinde domain to isolate issue

---

## 📚 Additional Resources

### Kinde Documentation
- [Custom UI Quick Start](https://docs.kinde.com/design/customize-with-code/quick-start-guide/)
- [Custom Domain Setup](https://docs.kinde.com/build/domains/pointing-your-domain/)
- [Manage Deployments](https://docs.kinde.com/design/customize-with-code/manage-custom-code-deployment/)
- [Next.js SDK](https://docs.kinde.com/developer-tools/sdks/backend/nextjs-sdk/)

### GitHub Repositories
- [Splitscape Template](https://github.com/kinde-starter-kits/custom-ui-splitscape)
- [Other Custom UI Examples](https://docs.kinde.com/design/customize-with-code/custom-ui-examples/)

### Community & Support
- [Kinde Community](https://kinde.com/community)
- [Kinde Support](https://kinde.com/support)

---

## 🎓 Advanced Customization

### Route-Specific Pages

Create custom pages for specific auth flows:

```
kindeSrc/environment/pages/(kinde)/
├── login/
│   └── page.tsx        # Custom login page
├── register/
│   └── page.tsx        # Custom sign-up page
├── recovery/
│   └── page.tsx        # Custom password reset
└── (default)/
    └── page.tsx        # Fallback for other pages
```

### Dynamic Content Based on Context

```tsx
export default function Page({ context }: PageProps) {
  // Access request context
  const { locale, client, request } = context;

  // Localize content
  const welcomeMessage = locale === 'es'
    ? '¡Bienvenido!'
    : 'Welcome!';

  return (
    <div>
      <h1>{welcomeMessage}</h1>
      {/* Rest of page */}
    </div>
  );
}
```

### Custom Analytics

```tsx
// Track auth events
export default function Page({ context }: PageProps) {
  // On page load
  useEffect(() => {
    // Send to your analytics
    analytics.track('Auth Page Viewed', {
      pageType: context.pageType,
      timestamp: new Date().toISOString(),
    });
  }, []);

  return (/* ... */);
}
```

---

## 📝 Notes

- **Deployment Time**: Changes pushed to GitHub are **not automatic** - you must manually sync in Kinde
- **Testing**: Always test in preview mode or non-production environment before going live
- **Assets**: Kinde doesn't host static assets - use your domain or CDN
- **Token Compatibility**: Tokens from custom domain and default domain are **not** interchangeable
- **Management API**: Always use original Kinde domain (`truetoneai.kinde.com`) for Management API calls

---

## 🎉 Success!

Once complete, your authentication flow will be:

1. User clicks "Sign In" in your app
2. Redirects to `auth.truetoneai.com`
3. Sees your fully branded custom UI
4. Completes authentication
5. Redirects back to your app
6. User never feels like they left your application

**Users get a seamless, branded authentication experience while you maintain Kinde's security and infrastructure.**
