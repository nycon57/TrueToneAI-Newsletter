import type { Config } from "tailwindcss"
import { fontFamily } from "tailwindcss/defaultTheme"

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      /*
       * NOTE: In Tailwind v4, color definitions are configured in globals.css
       * using the @theme directive, not here in the config file.
       * This config file is only used for non-color customizations.
       */
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", ...fontFamily.sans],
        heading: ["var(--font-signal)", ...fontFamily.sans],
        signal: [
          'var(--font-signal)'
        ],
        inter: [
          'var(--font-inter)'
        ],
        body: ["var(--font-inter)", ...fontFamily.sans],
      },
      zIndex: {
        '60': '60'
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "collapsible-down": {
          from: { height: "0" },
          to: { height: "var(--radix-collapsible-content-height)" },
        },
        "collapsible-up": {
          from: { height: "var(--radix-collapsible-content-height)" },
          to: { height: "0" },
        },
        // TrueTone Brand Animations
        'orb-wave': {
          '0%, 100%': {
            transform: 'scale(1) translate(0, 0) rotate(0deg)',
            opacity: '0.15'
          },
          '50%': {
            transform: 'scale(1.008) translate(0.5px, 0.5px) rotate(5deg)',
            opacity: '0.25'
          }
        },
        'orb-wave-slow': {
          '0%, 100%': {
            transform: 'scale(1) translate(0, 0) rotate(0deg)',
            opacity: '0.1'
          },
          '50%': {
            transform: 'scale(1.005) translate(0.3px, 0.3px) rotate(3deg)',
            opacity: '0.2'
          }
        },
        'voice-wave': {
          '0%, 100%': {
            height: '100%',
            transform: 'scaleY(0.2)'
          },
          '50%': {
            height: '100%',
            transform: 'scaleY(0.4)'
          }
        },
        fadeUpOut: {
          '0%': {
            opacity: '0.4',
            transform: 'translateY(0)'
          },
          '100%': {
            opacity: '0',
            transform: 'translateY(-1em)'
          }
        },
        shimmer: {
          '0%': {
            transform: 'translateX(-100%)'
          },
          '100%': {
            transform: 'translateX(100%)'
          }
        },
        'spin-slow': {
          '0%': {
            transform: 'rotate(0deg)'
          },
          '100%': {
            transform: 'rotate(360deg)'
          }
        },
        'fade-in': {
          'from': { opacity: '0' },
          'to': { opacity: '1' }
        },
        'slide-up': {
          'from': {
            opacity: '0',
            transform: 'translateY(20px)'
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'scale-in': {
          'from': {
            opacity: '0',
            transform: 'scale(0.95)'
          },
          'to': {
            opacity: '1',
            transform: 'scale(1)'
          }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "collapsible-down": "collapsible-down 0.2s ease-out",
        "collapsible-up": "collapsible-up 0.2s ease-out",
        // TrueTone Brand Animations
        'orb-wave': 'orb-wave 8s ease-in-out infinite',
        'orb-wave-slow': 'orb-wave-slow 12s ease-in-out infinite',
        'voice-wave': 'voice-wave 1s ease-in-out infinite',
        fadeUpOut: 'fadeUpOut 0.5s ease-out forwards',
        shimmer: 'shimmer 2s linear infinite',
        'spin-slow': 'spin-slow 3s linear infinite',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
        'scale-in': 'scale-in 0.3s ease-out'
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            color: "hsl(var(--foreground))",
            h1: {
              color: "hsl(var(--foreground))",
              fontWeight: "700",
              fontSize: "2.25rem",
              marginTop: "2rem",
              marginBottom: "1.5rem",
              fontFamily: "var(--font-heading)",
            },
            h2: {
              color: "hsl(var(--foreground))",
              fontWeight: "700",
              fontSize: "1.875rem",
              marginTop: "2rem",
              marginBottom: "1rem",
              fontFamily: "var(--font-heading)",
            },
            h3: {
              color: "hsl(var(--foreground))",
              fontWeight: "600",
              fontSize: "1.5rem",
              marginTop: "1.5rem",
              marginBottom: "0.75rem",
              fontFamily: "var(--font-heading)",
            },
            p: {
              color: "hsl(var(--foreground))",
              marginTop: "1.25rem",
              marginBottom: "1.25rem",
              fontFamily: "var(--font-body)",
            },
            a: {
              color: "hsl(var(--primary))",
              textDecoration: "none",
              fontWeight: "500",
              "&:hover": {
                color: "hsl(var(--primary))",
              },
            },
            strong: {
              color: "hsl(var(--foreground))",
              fontWeight: "600",
            },
            ul: {
              listStyleType: "disc",
              paddingLeft: "1.625rem",
            },
            ol: {
              listStyleType: "decimal",
              paddingLeft: "1.625rem",
            },
            li: {
              marginTop: "0.5rem",
              marginBottom: "0.5rem",
            },
            blockquote: {
              fontStyle: "italic",
              color: "hsl(var(--muted-foreground))",
              borderLeftWidth: "4px",
              borderLeftColor: "hsl(var(--primary))",
              paddingLeft: "1rem",
              marginTop: "1.5rem",
              marginBottom: "1.5rem",
            },
            code: {
              color: "hsl(var(--foreground))",
              backgroundColor: "hsl(var(--muted))",
              borderRadius: "0.25rem",
              padding: "0.125rem 0.25rem",
              fontFamily: "ui-monospace, monospace",
            },
            "code::before": {
              content: "",
            },
            "code::after": {
              content: "",
            },
            pre: {
              color: "hsl(var(--foreground))",
              backgroundColor: "hsl(var(--muted))",
              borderRadius: "0.375rem",
              padding: "1rem",
              marginTop: "1.5rem",
              marginBottom: "1.5rem",
            },
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};

export default config;