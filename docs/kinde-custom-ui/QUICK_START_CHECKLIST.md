# Kinde Custom Auth Pages - Quick Start Checklist

This checklist provides a streamlined view of all tasks needed to implement custom authentication pages with Kinde.

---

## 📋 Pre-Implementation Checklist

- [ ] **Kinde Account Setup**
  - [ ] Active Kinde account
  - [ ] Application configured
  - [ ] Know your Kinde domain (e.g., `truetoneai.kinde.com`)

- [ ] **Domain Access**
  - [ ] Have custom domain or subdomain available
  - [ ] DNS management access
  - [ ] Decided on subdomain (e.g., `auth.truetoneai.com`)

- [ ] **Development Environment**
  - [ ] GitHub account with repo creation access
  - [ ] Node.js and npm installed
  - [ ] Git installed locally
  - [ ] Text editor/IDE ready

---

## 🔧 Phase 1: Custom Domain Setup (Kinde Dashboard)

- [ ] **Configure Domain in Kinde**
  - [ ] Navigate to: Settings → Environment → Custom domain
  - [ ] Click "Add custom domain"
  - [ ] Enter subdomain: `auth.truetoneai.com`
  - [ ] Click "Save"
  - [ ] Copy DNS details (keep page open)

- [ ] **Add DNS Records**
  - [ ] Log into DNS provider (GoDaddy, Cloudflare, etc.)
  - [ ] Navigate to DNS management for your domain
  - [ ] Add CNAME record 1 (main record)
    - Type: `CNAME`
    - Name: `auth`
    - Value: [from Kinde]
  - [ ] Add CNAME record 2 (challenge - keep forever)
    - Type: `CNAME`
    - Name: `_acme-challenge.auth`
    - Value: [from Kinde]
  - [ ] Save DNS changes

- [ ] **Verify Domain**
  - [ ] Wait for DNS propagation (minutes to 2 hours)
  - [ ] Check status in Kinde dashboard
  - [ ] Status shows "Provisioned"
  - [ ] SSL certificate auto-generated

**⏱️ Estimated Time:** 1-4 hours (mostly DNS propagation)

---

## 📦 Phase 2: GitHub Repository Setup

- [ ] **Create Repository from Template**
  - [ ] Visit: https://github.com/kinde-starter-kits/custom-ui-splitscape
  - [ ] Click "Use this template"
  - [ ] Repository name: `truetone-kinde-auth-ui` (or your choice)
  - [ ] Public or Private: Your preference
  - [ ] Click "Create repository"

- [ ] **Connect GitHub to Kinde**
  - [ ] In Kinde: Settings → Environment → Git repo
  - [ ] Click "Connect repo"
  - [ ] Authorize GitHub
  - [ ] Select repository: `truetone-kinde-auth-ui`
  - [ ] Select branch: `main`
  - [ ] Click "Save"
  - [ ] Verify "Connected repo" panel shows

- [ ] **Enable Preview Mode** (Optional - Requires Plus/Scale plan)
  - [ ] Settings → Git repo
  - [ ] Toggle "Enable preview mode" ON

**⏱️ Estimated Time:** 30 minutes

---

## 🎨 Phase 3: Customize Authentication UI

- [ ] **Clone Repository**
  ```bash
  git clone https://github.com/YOUR_USERNAME/truetone-kinde-auth-ui.git
  cd truetone-kinde-auth-ui
  npm install
  ```

- [ ] **Customize Branding**
  - [ ] Copy `docs/kinde-custom-ui/example-styles.ts` to `kindeSrc/environment/pages/styles.ts`
  - [ ] Update brand colors to match your app
  - [ ] Update fonts to match your app
  - [ ] Adjust spacing/borders/shadows

- [ ] **Customize Layout**
  - [ ] Copy `docs/kinde-custom-ui/example-layout.tsx` to `kindeSrc/environment/pages/layout.tsx`
  - [ ] Replace logo URL with your logo
  - [ ] Update brand messaging
  - [ ] Adjust feature list

- [ ] **Customize Page Content**
  - [ ] Copy `docs/kinde-custom-ui/example-page.tsx` to `kindeSrc/environment/pages/(kinde)/(default)/page.tsx`
  - [ ] Update page headings/subheadings
  - [ ] Update footer links (Terms, Privacy, Support)
  - [ ] Customize messages for different auth flows

- [ ] **Host Static Assets** (If needed)
  - [ ] Upload logo to your domain
  - [ ] Upload custom fonts if using
  - [ ] Ensure all assets use HTTPS

**⏱️ Estimated Time:** 2-4 hours

---

## 🚀 Phase 4: Deploy Custom UI

- [ ] **Commit Changes**
  ```bash
  git add .
  git commit -m "feat: customize TrueTone authentication UI"
  git push origin main
  ```

- [ ] **Sync in Kinde**
  - [ ] Navigate to: Design → Custom code
  - [ ] Click "Sync code"
  - [ ] Wait for "Deployment successful"
  - [ ] Check logs for errors (if any)

- [ ] **Preview Deployment** (If enabled)
  - [ ] Design → Custom code → Deployments
  - [ ] Find deployment
  - [ ] Click "Preview"
  - [ ] Test all auth flows

- [ ] **Make Live**
  - [ ] Design → Custom code → Deployments
  - [ ] Find your deployment
  - [ ] Three-dot menu → "Make live"
  - [ ] Confirm

**⏱️ Estimated Time:** 30 minutes

---

## 🔌 Phase 5: Next.js Integration

- [ ] **Update Environment Variables**
  - [ ] Open `.env.local`
  - [ ] Change `KINDE_ISSUER_URL` to: `https://auth.truetoneai.com`
  - [ ] Verify other Kinde env vars are correct
  - [ ] Save file

- [ ] **Update Kinde Application Settings**
  - [ ] Settings → Applications → [Your App]
  - [ ] Add to Allowed callback URLs:
    - `https://truetoneai.com/api/auth/kinde_callback`
    - `https://auth.truetoneai.com/callback`
  - [ ] Add to Allowed logout redirect URLs:
    - `https://truetoneai.com`
    - `https://auth.truetoneai.com`
  - [ ] Save

- [ ] **Update Social Auth Providers**

  For each provider you use:

  **Google:**
  - [ ] Google Cloud Console → OAuth Client
  - [ ] Add redirect URI: `https://auth.truetoneai.com/login/callback`

  **GitHub:**
  - [ ] GitHub Developer Settings → OAuth App
  - [ ] Add callback URL: `https://auth.truetoneai.com/login/callback`

  **In Kinde:**
  - [ ] Settings → Authentication → Each provider
  - [ ] Toggle "Use custom domain instead" ON

**⏱️ Estimated Time:** 1 hour

---

## ✅ Phase 6: Testing & Verification

- [ ] **Local Testing**
  ```bash
  npm run dev
  ```

- [ ] **Test Sign-In Flow**
  - [ ] Click login button
  - [ ] Redirects to `auth.truetoneai.com`
  - [ ] Custom branding displays
  - [ ] Enter credentials
  - [ ] Successfully redirects back
  - [ ] Session created

- [ ] **Test Sign-Up Flow**
  - [ ] Click sign-up
  - [ ] Custom UI displays
  - [ ] Complete registration
  - [ ] Email verification works
  - [ ] Redirects to onboarding

- [ ] **Test Social Auth**
  - [ ] Click "Sign in with Google"
  - [ ] Redirects to Google
  - [ ] Authorize
  - [ ] Redirects back successfully
  - [ ] Session created

- [ ] **Test Password Reset**
  - [ ] Click "Forgot password"
  - [ ] Custom UI displays
  - [ ] Enter email
  - [ ] Receive reset email
  - [ ] Complete reset flow

- [ ] **Test Logout**
  - [ ] Click logout
  - [ ] Session cleared
  - [ ] Redirects correctly

- [ ] **Responsive Design**
  - [ ] Test on mobile viewport
  - [ ] Test on tablet viewport
  - [ ] Test on desktop
  - [ ] All layouts render correctly

- [ ] **Browser Testing**
  - [ ] Chrome
  - [ ] Safari
  - [ ] Firefox
  - [ ] Edge

**⏱️ Estimated Time:** 1-2 hours

---

## 🔒 Security Verification

- [ ] **HTTPS & SSL**
  - [ ] Custom domain loads via HTTPS
  - [ ] SSL certificate valid and trusted
  - [ ] No certificate warnings
  - [ ] No mixed content warnings

- [ ] **Session Security**
  - [ ] Tokens stored securely
  - [ ] Session management working
  - [ ] Logout clears session
  - [ ] No token leakage in console

- [ ] **CORS & CSP**
  - [ ] No CORS errors in console
  - [ ] Custom domain allowed
  - [ ] Social auth domains allowed

**⏱️ Estimated Time:** 30 minutes

---

## 📊 Production Deployment

- [ ] **Update Production Environment Variables**
  - [ ] Create `.env.production`
  - [ ] Set `KINDE_ISSUER_URL=https://auth.truetoneai.com`
  - [ ] Set `KINDE_SITE_URL=https://truetoneai.com`
  - [ ] Set `KINDE_POST_LOGOUT_REDIRECT_URL=https://truetoneai.com`
  - [ ] Set `KINDE_POST_LOGIN_REDIRECT_URL=https://truetoneai.com/dashboard`

- [ ] **Deploy to Production**
  - [ ] Deploy Next.js app with new env vars
  - [ ] Verify deployment successful
  - [ ] Test all auth flows in production
  - [ ] Monitor for errors

- [ ] **Post-Deployment Checks**
  - [ ] All auth flows work in production
  - [ ] Custom domain resolves correctly
  - [ ] SSL certificate active
  - [ ] No console errors
  - [ ] Analytics tracking (if configured)

**⏱️ Estimated Time:** 1 hour

---

## 🎉 Success Criteria

Your implementation is complete when:

✅ Custom domain `auth.truetoneai.com` is verified and live
✅ Custom UI deployed and active in Kinde
✅ Brand colors, fonts, and logo display correctly
✅ All authentication flows work end-to-end
✅ Social authentication works with all providers
✅ Responsive design works on all devices
✅ HTTPS and SSL properly configured
✅ Production environment fully tested
✅ No errors in browser console or Kinde logs
✅ Users have seamless branded authentication experience

---

## 🐛 Common Issues & Quick Fixes

### Custom domain not working
- ✅ Verify DNS records with `nslookup auth.truetoneai.com`
- ✅ Wait longer for DNS propagation (up to 48 hours)
- ✅ Check status in Kinde dashboard

### Custom UI not showing
- ✅ Verify deployment is "Live" in Kinde
- ✅ Check `KINDE_ISSUER_URL` points to custom domain
- ✅ Clear browser cache

### Authentication errors
- ✅ Verify callback URLs in Kinde settings
- ✅ Check social provider callback URLs
- ✅ Verify environment variables loaded

### Branding not appearing
- ✅ Check styles.ts for syntax errors
- ✅ Verify external assets load via HTTPS
- ✅ Check browser console for 404s

---

## 📚 Reference Documentation

- **Main Implementation Guide**: `docs/KINDE_CUSTOM_AUTH_IMPLEMENTATION.md`
- **Example Files**: `docs/kinde-custom-ui/`
  - `example-styles.ts` - Brand customization
  - `example-layout.tsx` - Page layout
  - `example-page.tsx` - Page content
  - `.env.example` - Environment variables

---

## ⏰ Total Estimated Time

- **Phase 1** (Custom Domain): 1-4 hours (DNS propagation)
- **Phase 2** (Repository): 30 minutes
- **Phase 3** (Customization): 2-4 hours
- **Phase 4** (Deployment): 30 minutes
- **Phase 5** (Integration): 1 hour
- **Phase 6** (Testing): 1-2 hours

**Total: 6-12 hours** (including waiting time)

---

## 🆘 Need Help?

- **Implementation Guide**: See `docs/KINDE_CUSTOM_AUTH_IMPLEMENTATION.md`
- **Kinde Docs**: https://docs.kinde.com
- **Kinde Support**: https://kinde.com/support
- **GitHub Issues**: Check Splitscape template issues

---

**Last Updated**: 2025-01-21
