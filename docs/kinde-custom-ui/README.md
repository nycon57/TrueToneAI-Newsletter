# Kinde Custom Authentication Pages - Documentation

This directory contains all resources needed to implement custom authentication pages for TrueTone using Kinde's GitHub-connected Custom UI with the Splitscape template.

---

## 📁 What's in This Directory

| File | Description |
|------|-------------|
| **QUICK_START_CHECKLIST.md** | Step-by-step checklist of all tasks to complete |
| **APPLICATION_SPECIFIC_CUSTOMIZATION.md** | Guide for customizing per Kinde application (Newsletter, Dashboard, etc.) |
| **.env.example** | Example environment variables with detailed comments |
| **example-styles.ts** | Complete brand customization example (colors, fonts, spacing) |
| **example-layout.tsx** | Split-screen layout example with TrueTone branding |
| **example-page.tsx** | Authentication page template with dynamic content |
| **example-page-newsletter-specific.tsx** | Newsletter-specific page with conditional rendering |

---

## 🌟 New: Application-Specific Customization

**TrueTone Newsletter** is your current Kinde application, but you can have **multiple applications** (Newsletter, Dashboard, Admin, etc.) all using the **same custom UI repository** with **different designs** for each!

### How It Works

- **One Repository** - Manage all auth page designs from a single GitHub repo
- **Conditional Rendering** - Detect which app is authenticating based on Client ID
- **No Performance Impact** - Logic runs server-side before page renders
- **Easy to Scale** - Add new apps without creating new repos

### Learn More

👉 See [APPLICATION_SPECIFIC_CUSTOMIZATION.md](./APPLICATION_SPECIFIC_CUSTOMIZATION.md) for complete details on implementing application-specific designs.

---

## 🚀 Quick Start

### 1. Read the Documentation

Start with the comprehensive guide:
```
📖 docs/KINDE_CUSTOM_AUTH_IMPLEMENTATION.md
```

This guide covers:
- Complete setup process
- Custom domain configuration
- GitHub repository setup
- UI customization
- Deployment workflow
- Next.js integration
- Testing procedures
- Troubleshooting

### 2. Follow the Checklist

Use the checklist to track progress:
```
✅ docs/kinde-custom-ui/QUICK_START_CHECKLIST.md
```

The checklist provides:
- All tasks organized by phase
- Time estimates for each phase
- Success criteria
- Common issues & fixes

### 3. Use the Example Files

Reference the example files when customizing:

**For Branding & Colors:**
```typescript
// Copy example-styles.ts to your custom UI repo:
// kindeSrc/environment/pages/styles.ts

📄 docs/kinde-custom-ui/example-styles.ts
```

**For Page Layout:**
```tsx
// Copy example-layout.tsx to your custom UI repo:
// kindeSrc/environment/pages/layout.tsx

📄 docs/kinde-custom-ui/example-layout.tsx
```

**For Page Content:**
```tsx
// Copy example-page.tsx to your custom UI repo:
// kindeSrc/environment/pages/(kinde)/(default)/page.tsx

📄 docs/kinde-custom-ui/example-page.tsx
```

**For Environment Variables:**
```bash
# Reference for what to configure in .env.local
📄 docs/kinde-custom-ui/.env.example
```

---

## 📋 Implementation Overview

### Phase 1: Custom Domain (1-4 hours)
- Set up custom domain in Kinde Dashboard
- Configure DNS records
- Wait for verification & SSL provisioning

### Phase 2: GitHub Repository (30 minutes)
- Create repo from Splitscape template
- Connect GitHub to Kinde
- Enable preview mode (optional)

### Phase 3: Customize UI (2-4 hours)
- Clone repository locally
- Customize branding (colors, fonts, logo)
- Modify layouts and pages
- Host static assets

### Phase 4: Deploy (30 minutes)
- Push changes to GitHub
- Sync code in Kinde
- Preview deployment
- Make live

### Phase 5: Integration (1 hour)
- Update environment variables
- Update Kinde application settings
- Update social auth providers
- Update Next.js configuration

### Phase 6: Testing (1-2 hours)
- Test all authentication flows
- Verify responsive design
- Check security settings
- Deploy to production

**Total Time: 6-12 hours** (including DNS propagation)

---

## 🎯 What You'll Achieve

After completing implementation:

✅ **Custom Domain**: `auth.truetoneai.com` (or your chosen subdomain)

✅ **Fully Branded**: Custom colors, fonts, and logos matching your app

✅ **Seamless UX**: Users never feel like they've left your application

✅ **Complete Control**: React Server Components-based customization

✅ **All Auth Flows**: Sign-in, sign-up, password reset, MFA, social auth

✅ **Production Ready**: HTTPS, SSL, responsive, tested

---

## 🛠️ Prerequisites

Before starting, ensure you have:

- ✅ **Kinde Account**: With application configured
- ✅ **Custom Domain**: Access and DNS management
- ✅ **GitHub Account**: With repository creation permissions
- ✅ **Development Tools**: Node.js, npm, Git installed
- ✅ **Next.js App**: Current TrueTone app running locally

---

## 📚 Documentation Links

### Internal Documentation
- [**Main Implementation Guide**](../KINDE_CUSTOM_AUTH_IMPLEMENTATION.md) - Complete setup instructions
- [**Quick Start Checklist**](./QUICK_START_CHECKLIST.md) - Task-by-task checklist
- [**Environment Variables Example**](./.env.example) - Configuration reference
- [**Styles Example**](./example-styles.ts) - Brand customization
- [**Layout Example**](./example-layout.tsx) - Page structure
- [**Page Example**](./example-page.tsx) - Auth page content

### External Resources
- [Kinde Quick Start Guide](https://docs.kinde.com/design/customize-with-code/quick-start-guide/)
- [Splitscape Template](https://github.com/kinde-starter-kits/custom-ui-splitscape)
- [Custom Domain Setup](https://docs.kinde.com/build/domains/pointing-your-domain/)
- [Kinde Next.js SDK](https://docs.kinde.com/developer-tools/sdks/backend/nextjs-sdk/)
- [Manage Deployments](https://docs.kinde.com/design/customize-with-code/manage-custom-code-deployment/)

---

## 🎨 Customization Examples

### Example 1: Brand Colors

```typescript
// In example-styles.ts
export const styles = {
  '--kinde-button-primary-background-color': '#6366f1', // Your brand primary
  '--kinde-button-primary-hover-background-color': '#4f46e5', // Darker shade
  '--kinde-link-color': '#6366f1', // Match primary
  // ... more styles
};
```

### Example 2: Custom Layout

```tsx
// In example-layout.tsx
<div className="auth-brand-section">
  <img src="https://truetoneai.com/logo.svg" alt="TrueTone" />
  <h1>Welcome to TrueTone Insights</h1>
  <p>Market intelligence for loan officers</p>
</div>
```

### Example 3: Dynamic Content

```tsx
// In example-page.tsx
const getPageContent = () => {
  switch (context.pageType) {
    case 'login':
      return { heading: 'Sign in to your account' };
    case 'register':
      return { heading: 'Create your account' };
    // ... more cases
  }
};
```

---

## ⚙️ Environment Variables

### Current Configuration (.env.local)

```bash
# Default Kinde domain (current)
KINDE_ISSUER_URL=https://truetoneai.kinde.com
```

### After Custom Domain Setup

```bash
# Custom domain (after implementation)
KINDE_ISSUER_URL=https://auth.truetoneai.com
```

### Production Configuration (.env.production)

```bash
KINDE_ISSUER_URL=https://auth.truetoneai.com
KINDE_SITE_URL=https://truetoneai.com
KINDE_POST_LOGOUT_REDIRECT_URL=https://truetoneai.com
KINDE_POST_LOGIN_REDIRECT_URL=https://truetoneai.com/dashboard
```

**📝 Note**: See `.env.example` for complete configuration details

---

## ✅ Success Checklist

Your implementation is complete when:

- [ ] Custom domain verified and SSL active
- [ ] Custom UI deployed and live in Kinde
- [ ] Brand colors, fonts, logo display correctly
- [ ] Sign-in flow works end-to-end
- [ ] Sign-up flow works with email verification
- [ ] Social authentication works (Google, GitHub, etc.)
- [ ] Password reset flow works
- [ ] Logout redirects correctly
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] No errors in browser console
- [ ] No errors in Kinde deployment logs
- [ ] Production deployment tested
- [ ] All auth flows work in production

---

## 🐛 Troubleshooting

### Quick Fixes for Common Issues

**Custom domain not working:**
- Check DNS with `nslookup auth.truetoneai.com`
- Wait for DNS propagation (up to 48 hours)
- Verify status in Kinde dashboard

**Custom UI not showing:**
- Verify deployment is "Live" in Kinde
- Check `KINDE_ISSUER_URL` in .env
- Clear browser cache

**Authentication errors:**
- Verify callback URLs in Kinde settings
- Check social provider callback URLs
- Verify environment variables loaded

**Branding not appearing:**
- Check styles.ts for syntax errors
- Verify assets load via HTTPS
- Check browser console for 404s

**📖 Full Troubleshooting**: See main implementation guide section "Troubleshooting"

---

## 🔄 Deployment Workflow

### Making Changes to Custom UI

1. **Edit Files Locally**
   ```bash
   cd truetone-kinde-auth-ui
   # Edit kindeSrc/environment/pages/styles.ts
   # Edit kindeSrc/environment/pages/layout.tsx
   ```

2. **Commit & Push**
   ```bash
   git add .
   git commit -m "Update authentication branding"
   git push origin main
   ```

3. **Sync in Kinde**
   - Kinde Dashboard → Design → Custom code
   - Click "Sync code"
   - Wait for deployment

4. **Preview & Test**
   - Test in preview mode (if available)
   - Verify changes look correct

5. **Make Live**
   - Deployments → Your deployment → "Make live"
   - Verify live deployment

### Rollback Process

If issues arise:

1. **Quick Rollback**
   - Kinde Dashboard → Design → Custom code → Deployments
   - Find previous working deployment
   - Three-dot menu → "Make live"

2. **Revert to Default**
   - Disconnect Git repo in Kinde settings
   - Update `KINDE_ISSUER_URL` to default
   - Redeploy Next.js app

---

## 📊 File Structure Reference

### In Your Next.js App
```
TrueToneAI-Newsletter/
├── .env.local                          # Environment variables (update KINDE_ISSUER_URL)
├── src/
│   ├── app/
│   │   └── api/
│   │       └── auth/
│   │           └── [kindeAuth]/
│   │               └── route.ts        # Kinde auth handler (no changes needed)
│   ├── components/
│   │   └── auth/
│   │       └── LoginModal.tsx          # Login trigger (no changes needed)
│   └── middleware.ts                   # Route protection (no changes needed)
└── docs/
    ├── KINDE_CUSTOM_AUTH_IMPLEMENTATION.md  # Main guide
    └── kinde-custom-ui/
        ├── README.md                   # This file
        ├── QUICK_START_CHECKLIST.md    # Task checklist
        ├── .env.example                # Env var reference
        ├── example-styles.ts           # Brand customization
        ├── example-layout.tsx          # Page layout
        └── example-page.tsx            # Page content
```

### In Your Custom UI Repository (After Creation)
```
truetone-kinde-auth-ui/
├── kindeSrc/
│   └── environment/
│       └── pages/
│           ├── layout.tsx              # Copy from example-layout.tsx
│           ├── styles.ts               # Copy from example-styles.ts
│           └── (kinde)/
│               └── (default)/
│                   └── page.tsx        # Copy from example-page.tsx
├── kinde.json                          # Kinde configuration
├── package.json
└── README.md
```

---

## 🆘 Getting Help

### Documentation
1. Start with [Main Implementation Guide](../KINDE_CUSTOM_AUTH_IMPLEMENTATION.md)
2. Follow [Quick Start Checklist](./QUICK_START_CHECKLIST.md)
3. Reference [Example Files](.)

### External Resources
- [Kinde Documentation](https://docs.kinde.com)
- [Kinde Community](https://kinde.com/community)
- [Kinde Support](https://kinde.com/support)
- [Splitscape Template Issues](https://github.com/kinde-starter-kits/custom-ui-splitscape/issues)

### Common Questions
- **How long does DNS propagation take?** Usually minutes, up to 48 hours
- **Can I preview before going live?** Yes, with Kinde Plus/Scale plan
- **Can I use multiple custom domains?** Yes, for multi-org setups
- **Do I need to change Next.js routes?** No, Kinde SDK handles it
- **Can I self-host the auth pages?** No, Kinde hosts them for security

---

## 📝 Notes & Important Info

### Critical Points

⚠️ **Custom Domain Required**: Custom code only runs on custom domains (free to set up)

⚠️ **Security Screens**: Password entry, OTP, and MFA screens remain on Kinde's infrastructure for security

⚠️ **Token Compatibility**: Tokens from custom domain and default domain are NOT interchangeable

⚠️ **Management API**: Always use original Kinde domain for Management API calls, not custom domain

⚠️ **Asset Hosting**: Kinde doesn't host static assets - use your domain or CDN

⚠️ **Manual Sync**: Changes to GitHub don't auto-deploy - you must sync in Kinde dashboard

### Best Practices

✅ **Test Before Live**: Use preview mode or non-production environment

✅ **Version Control**: Commit often with descriptive messages

✅ **Match Branding**: Keep auth pages consistent with main app design

✅ **Mobile First**: Test responsive design thoroughly

✅ **Security First**: Keep client secrets secure, never commit to public repos

---

## 🎉 Ready to Start?

### Step 1: Read the Docs
👉 [Main Implementation Guide](../KINDE_CUSTOM_AUTH_IMPLEMENTATION.md)

### Step 2: Follow the Checklist
👉 [Quick Start Checklist](./QUICK_START_CHECKLIST.md)

### Step 3: Customize Your UI
👉 Use the example files in this directory

---

**Last Updated**: 2025-01-21
**Implementation Time**: 6-12 hours
**Documentation Version**: 1.0
