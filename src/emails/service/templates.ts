/**
 * Email Template Registry
 *
 * Central registry of all email templates available in the TrueTone Insights platform.
 * This ensures type safety when referencing email templates throughout the application.
 */

/**
 * Available email templates
 */
export const EMAIL_TEMPLATES = {
  // Support & Help
  SUPPORT_CONFIRMATION: 'support-confirmation',
  SUPPORT_NOTIFICATION: 'support-notification',

  // User Onboarding
  WELCOME: 'welcome',
  ONBOARDING_COMPLETE: 'onboarding-complete',

  // Subscription & Billing
  SUBSCRIPTION_CREATED: 'subscription-created',
  SUBSCRIPTION_UPDATED: 'subscription-updated',
  SUBSCRIPTION_CANCELLED: 'subscription-cancelled',
  PAYMENT_SUCCESSFUL: 'payment-successful',
  PAYMENT_FAILED: 'payment-failed',
  TRIAL_EXPIRING: 'trial-expiring',

  // AI Usage & Limits
  AI_LIMIT_WARNING: 'ai-limit-warning',
  AI_LIMIT_REACHED: 'ai-limit-reached',

  // Newsletter
  NEWSLETTER_PUBLISHED: 'newsletter-published',
  NEWSLETTER_READY: 'newsletter-ready',

  // Engagement
  RE_ENGAGEMENT: 're-engagement',
  FEATURE_ANNOUNCEMENT: 'feature-announcement',
} as const;

/**
 * Type representing all available email template IDs
 */
export type EmailTemplate = typeof EMAIL_TEMPLATES[keyof typeof EMAIL_TEMPLATES];

/**
 * Email categories for organization and analytics
 */
export const EMAIL_CATEGORIES = {
  TRANSACTIONAL: 'transactional',
  MARKETING: 'marketing',
  NOTIFICATION: 'notification',
  SUPPORT: 'support',
} as const;

export type EmailCategory = typeof EMAIL_CATEGORIES[keyof typeof EMAIL_CATEGORIES];

/**
 * Map templates to their categories
 */
export const TEMPLATE_CATEGORIES: Record<EmailTemplate, EmailCategory> = {
  [EMAIL_TEMPLATES.SUPPORT_CONFIRMATION]: EMAIL_CATEGORIES.SUPPORT,
  [EMAIL_TEMPLATES.SUPPORT_NOTIFICATION]: EMAIL_CATEGORIES.SUPPORT,
  [EMAIL_TEMPLATES.WELCOME]: EMAIL_CATEGORIES.TRANSACTIONAL,
  [EMAIL_TEMPLATES.ONBOARDING_COMPLETE]: EMAIL_CATEGORIES.TRANSACTIONAL,
  [EMAIL_TEMPLATES.SUBSCRIPTION_CREATED]: EMAIL_CATEGORIES.TRANSACTIONAL,
  [EMAIL_TEMPLATES.SUBSCRIPTION_UPDATED]: EMAIL_CATEGORIES.TRANSACTIONAL,
  [EMAIL_TEMPLATES.SUBSCRIPTION_CANCELLED]: EMAIL_CATEGORIES.TRANSACTIONAL,
  [EMAIL_TEMPLATES.PAYMENT_SUCCESSFUL]: EMAIL_CATEGORIES.TRANSACTIONAL,
  [EMAIL_TEMPLATES.PAYMENT_FAILED]: EMAIL_CATEGORIES.TRANSACTIONAL,
  [EMAIL_TEMPLATES.TRIAL_EXPIRING]: EMAIL_CATEGORIES.NOTIFICATION,
  [EMAIL_TEMPLATES.AI_LIMIT_WARNING]: EMAIL_CATEGORIES.NOTIFICATION,
  [EMAIL_TEMPLATES.AI_LIMIT_REACHED]: EMAIL_CATEGORIES.NOTIFICATION,
  [EMAIL_TEMPLATES.NEWSLETTER_PUBLISHED]: EMAIL_CATEGORIES.NOTIFICATION,
  [EMAIL_TEMPLATES.NEWSLETTER_READY]: EMAIL_CATEGORIES.NOTIFICATION,
  [EMAIL_TEMPLATES.RE_ENGAGEMENT]: EMAIL_CATEGORIES.MARKETING,
  [EMAIL_TEMPLATES.FEATURE_ANNOUNCEMENT]: EMAIL_CATEGORIES.MARKETING,
};

/**
 * Get the category for a given template
 */
export function getTemplateCategory(template: EmailTemplate): EmailCategory {
  return TEMPLATE_CATEGORIES[template];
}

/**
 * Check if a template is a marketing email (requires unsubscribe)
 */
export function isMarketingEmail(template: EmailTemplate): boolean {
  return getTemplateCategory(template) === EMAIL_CATEGORIES.MARKETING;
}
