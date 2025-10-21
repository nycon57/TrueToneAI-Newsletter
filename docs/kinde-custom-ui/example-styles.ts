/**
 * TrueTone Custom Authentication Styles
 *
 * This file should be placed at: kindeSrc/environment/pages/styles.ts
 * in your custom UI repository after creating from Splitscape template.
 *
 * These CSS custom properties control the entire authentication experience.
 * Customize these values to match your brand.
 */

export const styles = {
  // ==========================================================================
  // PRIMARY BRAND COLORS
  // ==========================================================================

  // Primary button (Sign In, Continue, etc.)
  '--kinde-button-primary-background-color': '#6366f1', // Indigo - matches your app
  '--kinde-button-primary-text-color': '#ffffff',
  '--kinde-button-primary-hover-background-color': '#4f46e5', // Darker indigo
  '--kinde-button-primary-border-color': 'transparent',

  // Secondary button (Cancel, Back, etc.)
  '--kinde-button-secondary-background-color': '#f3f4f6', // Light gray
  '--kinde-button-secondary-text-color': '#111827',
  '--kinde-button-secondary-hover-background-color': '#e5e7eb',
  '--kinde-button-secondary-border-color': '#d1d5db',

  // ==========================================================================
  // TEXT COLORS
  // ==========================================================================

  '--kinde-base-color': '#111827',                // Primary text (dark gray)
  '--kinde-secondary-color': '#6b7280',           // Secondary text (medium gray)
  '--kinde-tertiary-color': '#9ca3af',            // Tertiary/muted text (light gray)
  '--kinde-heading-color': '#111827',             // Headings

  // ==========================================================================
  // BACKGROUND & SURFACE COLORS
  // ==========================================================================

  '--kinde-page-background-color': '#ffffff',     // Overall page background
  '--kinde-card-background-color': '#ffffff',     // Auth card/form background
  '--kinde-card-border-color': '#e5e7eb',         // Card border

  // ==========================================================================
  // INPUT FIELDS
  // ==========================================================================

  '--kinde-input-background-color': '#ffffff',
  '--kinde-input-border-color': '#d1d5db',        // Default border
  '--kinde-input-focus-border-color': '#6366f1',  // Focused border (primary)
  '--kinde-input-error-border-color': '#ef4444',  // Error border
  '--kinde-input-text-color': '#111827',
  '--kinde-input-placeholder-color': '#9ca3af',

  // ==========================================================================
  // LINKS
  // ==========================================================================

  '--kinde-link-color': '#6366f1',                // Primary links
  '--kinde-link-hover-color': '#4f46e5',          // Link hover state
  '--kinde-link-visited-color': '#6366f1',

  // ==========================================================================
  // STATUS & FEEDBACK COLORS
  // ==========================================================================

  '--kinde-error-color': '#ef4444',               // Error messages
  '--kinde-error-background-color': '#fee2e2',    // Error alert background
  '--kinde-success-color': '#10b981',             // Success messages
  '--kinde-success-background-color': '#d1fae5',  // Success alert background
  '--kinde-warning-color': '#f59e0b',             // Warning messages
  '--kinde-warning-background-color': '#fef3c7',  // Warning alert background
  '--kinde-info-color': '#3b82f6',                // Info messages
  '--kinde-info-background-color': '#dbeafe',     // Info alert background

  // ==========================================================================
  // TYPOGRAPHY
  // ==========================================================================

  // Font Families
  // Match your app's fonts from src/app/fonts.ts
  '--kinde-base-font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  '--kinde-heading-font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  '--kinde-monospace-font-family': 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, "Cascadia Code", monospace',

  // Font Sizes
  '--kinde-base-font-size': '16px',               // Body text
  '--kinde-heading-font-size': '24px',            // Main headings
  '--kinde-subheading-font-size': '18px',         // Subheadings
  '--kinde-small-font-size': '14px',              // Small text, labels
  '--kinde-tiny-font-size': '12px',               // Very small text

  // Font Weights
  '--kinde-font-weight-normal': '400',
  '--kinde-font-weight-medium': '500',
  '--kinde-font-weight-semibold': '600',
  '--kinde-font-weight-bold': '700',

  // Line Heights
  '--kinde-line-height-tight': '1.25',
  '--kinde-line-height-normal': '1.5',
  '--kinde-line-height-relaxed': '1.75',

  // ==========================================================================
  // SPACING
  // ==========================================================================

  '--kinde-page-padding': '24px',                 // Page padding
  '--kinde-card-padding': '32px',                 // Card/form padding
  '--kinde-section-spacing': '24px',              // Between sections
  '--kinde-input-padding': '12px 16px',           // Input field padding
  '--kinde-button-padding': '12px 24px',          // Button padding
  '--kinde-label-margin-bottom': '8px',           // Space below labels

  // ==========================================================================
  // BORDERS & RADIUS
  // ==========================================================================

  '--kinde-border-width': '1px',
  '--kinde-border-radius': '8px',                 // General border radius
  '--kinde-button-border-radius': '6px',          // Buttons
  '--kinde-input-border-radius': '6px',           // Input fields
  '--kinde-card-border-radius': '12px',           // Cards

  // ==========================================================================
  // SHADOWS
  // ==========================================================================

  // Elevation shadows (from Tailwind-like system)
  '--kinde-shadow-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  '--kinde-shadow': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  '--kinde-shadow-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  '--kinde-shadow-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',

  // Component-specific shadows
  '--kinde-card-shadow': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  '--kinde-button-shadow': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  '--kinde-input-shadow': 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.05)',

  // ==========================================================================
  // TRANSITIONS
  // ==========================================================================

  '--kinde-transition-fast': '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  '--kinde-transition-base': '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  '--kinde-transition-slow': '300ms cubic-bezier(0.4, 0, 0.2, 1)',

  // ==========================================================================
  // SOCIAL AUTH BUTTONS
  // ==========================================================================

  // Google
  '--kinde-google-button-background': '#ffffff',
  '--kinde-google-button-text': '#111827',
  '--kinde-google-button-border': '#d1d5db',

  // GitHub
  '--kinde-github-button-background': '#24292e',
  '--kinde-github-button-text': '#ffffff',
  '--kinde-github-button-border': '#24292e',

  // Generic social
  '--kinde-social-button-background': '#ffffff',
  '--kinde-social-button-text': '#111827',
  '--kinde-social-button-border': '#d1d5db',
  '--kinde-social-button-hover-background': '#f9fafb',

  // ==========================================================================
  // DIVIDERS & SEPARATORS
  // ==========================================================================

  '--kinde-divider-color': '#e5e7eb',
  '--kinde-divider-text-color': '#6b7280',

  // ==========================================================================
  // FOCUS STATES
  // ==========================================================================

  '--kinde-focus-ring-color': '#6366f1',
  '--kinde-focus-ring-width': '2px',
  '--kinde-focus-ring-offset': '2px',

  // ==========================================================================
  // LOADING & DISABLED STATES
  // ==========================================================================

  '--kinde-loading-spinner-color': '#6366f1',
  '--kinde-disabled-opacity': '0.5',
  '--kinde-disabled-cursor': 'not-allowed',

  // ==========================================================================
  // CUSTOM ENHANCEMENTS (Optional)
  // ==========================================================================

  // Brand gradient (if you want gradient buttons)
  '--kinde-gradient-start': '#6366f1',
  '--kinde-gradient-end': '#8b5cf6',

  // Accent color for highlights
  '--kinde-accent-color': '#8b5cf6',              // Purple accent

  // ==========================================================================
  // RESPONSIVE BREAKPOINTS (for reference in layouts)
  // ==========================================================================

  '--kinde-breakpoint-sm': '640px',
  '--kinde-breakpoint-md': '768px',
  '--kinde-breakpoint-lg': '1024px',
  '--kinde-breakpoint-xl': '1280px',
};

/**
 * USAGE NOTES:
 *
 * 1. Copy this file to: kindeSrc/environment/pages/styles.ts
 *    in your custom UI GitHub repository
 *
 * 2. Adjust colors to match your brand:
 *    - Check your tailwind.config.ts for color values
 *    - Match fonts from src/app/fonts.ts
 *    - Ensure consistency with your main app
 *
 * 3. These values are applied as CSS custom properties, so they work
 *    throughout all Kinde auth pages automatically
 *
 * 4. To use in custom CSS:
 *    ```css
 *    .my-custom-element {
 *      color: var(--kinde-base-color);
 *      background: var(--kinde-button-primary-background-color);
 *    }
 *    ```
 *
 * 5. Test changes locally if possible, or use Kinde preview mode
 *
 * 6. After updating, commit to GitHub and sync in Kinde dashboard
 */
