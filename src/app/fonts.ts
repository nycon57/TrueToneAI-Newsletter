import { Inter } from "next/font/google";
import localFont from "next/font/local";

// Primary font - Inter for body text
export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

// Heading font - Signal (local font with fallback to system fonts)
export const signal = localFont({
  src: [
    {
      path: "../../public/signal/ttf/Signal-Normal.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/signal/ttf/Signal-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-signal",
  display: 'swap',
  preload: true,
  fallback: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif'
  ]
});
