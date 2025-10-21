import { Inter } from "next/font/google";

// OPTIMIZED: Only load Inter with specific weights needed
export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  weight: ['400', '500', '600', '700'], // Only the weights actually used
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
});

// Removed Signal local font (58KB) - use Inter with different weights for headings
// Removed Geist Mono - not used in main application

/**
 * Font Usage Guide:
 * - Body text: font-normal (400)
 * - Medium emphasis: font-medium (500)
 * - Headings/Bold: font-semibold (600) or font-bold (700)
 */