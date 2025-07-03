import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import './globals.css';

import { ThemeProvider } from '@/components/theme-provider';
import Script from 'next/script';

// Single elegant AI assistant - no overlapping systems
import ElegantAIAssistant from "@/components/ElegantAIAssistant";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
});

export const metadata: Metadata = {
  title: 'Agile Defense Systems | Powered by the Aiden Engine',
  description:
    'Advanced AI-driven defense and healthcare automation platform. Secure, HIPAA- & CMMC-Compliant solutions with multi-modal AI orchestration, real-time analytics, and enterprise-grade security.',
  keywords:
    'Agile Defense Systems, Aiden Engine, AI-driven defense, healthcare automation, multi-modal AI, enterprise security, HIPAA-compliant, CMMC-compliant, defense contracting, clinical workflows, cybersecurity',
  authors: [{ name: 'Agile Defense Systems' }],
  creator: 'Agile Defense Systems',
  publisher: 'Agile Defense Systems',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://agiledefensesystems.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://agiledefensesystems.com',
    title: 'Agile Defense Systems | Powered by the Aiden Engine',
    description:
      'Advanced AI-driven defense and healthcare automation platform with enterprise-grade security and multi-modal AI orchestration.',
    siteName: 'Agile Defense Systems',
    images: [
      {
        url: 'https://agiledefensesystems.com/assets/og-banner.jpg',
        width: 1200,
        height: 630,
        alt: 'Agile Defense Systems - Aiden Engine Platform',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agile Defense Systems | Powered by the Aiden Engine',
    description:
      'Advanced AI platform for defense contracting, healthcare automation, and cybersecurity with enterprise-grade security.',
    images: ['https://agiledefensesystems.com/assets/twitter-preview.jpg'],
    creator: '@agiledefense',
    site: '@agiledefense',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  generator: 'Next.js',
  applicationName: 'Agile Defense Systems',
  referrer: 'origin-when-cross-origin',
  category: 'technology',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Agile Defense Systems',
  description: 'Advanced AI-driven defense and healthcare automation platform powered by the Aiden Engine',
  url: 'https://agiledefensesystems.com',
  logo: 'https://agiledefensesystems.com/logo.png',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-800-ADS-TECH',
    contactType: 'customer service',
    availableLanguage: 'English'
  },
  sameAs: [
    'https://linkedin.com/company/agile-defense-systems',
    'https://twitter.com/agiledefense'
  ],
  brand: {
    '@type': 'Brand',
    name: 'Aiden Engine',
    description: 'Advanced AI orchestration engine for enterprise applications'
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'US'
  },
  foundingDate: '2024',
  industry: 'Defense Technology',
  numberOfEmployees: '50-200'
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <meta name="theme-color" content="#0EA5E9" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0F172A" media="(prefers-color-scheme: dark)" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Agile Defense Systems" />
        <meta name="msapplication-TileColor" content="#0EA5E9" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="color-scheme" content="dark light" />

        <link rel="canonical" href="https://agiledefensesystems.com" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#0EA5E9" />

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <Script id="theme-init" strategy="beforeInteractive">
          {`(function() {
              try {
                const theme = localStorage.getItem('theme') || 'dark';
                document.documentElement.classList.add(theme);
                document.documentElement.setAttribute('data-theme', theme);
              } catch (e) {
                console.warn('Theme initialization failed:', e);
                document.documentElement.classList.add('dark');
              }
            })();`}
        </Script>

        <Script id="performance-monitoring" strategy="afterInteractive">
          {`(function() {
              if ('performance' in window) {
                window.addEventListener('load', function() {
                  setTimeout(function() {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    if (perfData && perfData.loadEventEnd) {
                      console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
                    }
                  }, 0);
                });
              }
            })();`}
        </Script>

        <style>{`
          @keyframes gradient-shift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          @keyframes energy-flow {
            0%, 100% { background-position: 0% 50%; }
            25% { background-position: 100% 50%; }
            50% { background-position: 100% 100%; }
            75% { background-position: 0% 100%; }
          }
          
          @keyframes pulse-glow {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
          }
          
          @keyframes neural-pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          
          ::selection {
            background: #0EA5E9;
            color: #ffffff;
          }
          
          ::-moz-selection {
            background: #0EA5E9;
            color: #ffffff;
          }
          
          html, body {
            scroll-behavior: smooth;
            font-feature-settings: "ss01", "ss02", "ss03" on;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            background-color: #0f172a;
            color: #ffffff;
            text-rendering: optimizeLegibility;
            font-display: swap;
          }
          
          .professional-grid {
            background-image:
              linear-gradient(rgba(14, 165, 233, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(14, 165, 233, 0.1) 1px, transparent 1px);
            background-size: 20px 20px;
            animation: pulse-glow 4s ease-in-out infinite;
          }
          
          .aiden-gradient {
            background: linear-gradient(135deg, #0EA5E9 0%, #10B981 50%, #06B6D4 100%);
            background-size: 200% 200%;
            animation: gradient-shift 3s ease infinite;
          }
          
          .defense-gradient {
            background: linear-gradient(135deg, #0F172A 0%, #0EA5E9 25%, #10B981 75%, #06B6D4 100%);
          }
          
          .neural-gradient {
            background: linear-gradient(45deg, #0EA5E9, #10B981, #06B6D4, #1E40AF);
            background-size: 400% 400%;
            animation: energy-flow 4s ease infinite;
          }
          
          .neural-pulse {
            animation: neural-pulse 2s ease-in-out infinite;
          }
          
          /* Accessibility improvements */
          @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
          
          /* Focus styles for better accessibility */
          :focus-visible {
            outline: 2px solid #0EA5E9;
            outline-offset: 2px;
            border-radius: 4px;
          }
          
          /* High contrast mode support */
          @media (prefers-contrast: high) {
            .aiden-gradient,
            .defense-gradient,
            .neural-gradient {
              background: #0EA5E9 !important;
            }
          }
          
          /* Print styles */
          @media print {
            .professional-grid,
            .aiden-gradient,
            .defense-gradient,
            .neural-gradient {
              background: none !important;
              animation: none !important;
            }
          }
        `}</style>
      </head>
      <body className={`${inter.className} antialiased bg-slate-950 text-white transition-colors duration-300 ease-in-out min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          {children}
          <ElegantAIAssistant />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
