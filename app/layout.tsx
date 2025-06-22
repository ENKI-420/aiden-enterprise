import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import './globals.css';

import { ThemeProvider } from '@/components/theme-provider';
import Script from 'next/script';

// Dynamic Provider Path Check
import { EngagementProvider } from "@/components/EngagementProvider";
import EnhancedUIProvider from "@/components/EnhancedUIProvider";
import { TourProvider } from '@/components/TourProvider';
import { PyramidResearchProvider } from '@/integrations/pyramid-research/PyramidResearchProvider';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Agile Defense Systems | Powered by the Aiden Engine',
  description:
    'Advanced AI-driven defense and healthcare automation platform. Secure, HIPAA- & CMMC-Compliant solutions with multi-modal AI orchestration, real-time analytics, and enterprise-grade security.',
  keywords:
    'Agile Defense Systems, Aiden Engine, AI-driven defense, healthcare automation, multi-modal AI, enterprise security, HIPAA-compliant, CMMC-compliant, defense contracting, clinical workflows, cybersecurity',
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
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agile Defense Systems | Powered by the Aiden Engine',
    description:
      'Advanced AI platform for defense contracting, healthcare automation, and cybersecurity with enterprise-grade security.',
    images: ['https://agiledefensesystems.com/assets/twitter-preview.jpg'],
  },
  robots: { index: true, follow: true },
  generator: 'Next.js',
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
    contactType: 'customer service'
  },
  sameAs: [
    'https://linkedin.com/company/agile-defense-systems'
  ],
  brand: {
    '@type': 'Brand',
    name: 'Aiden Engine',
    description: 'Advanced AI orchestration engine for enterprise applications'
  }
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#0EA5E9" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="canonical" href="https://agiledefensesystems.com" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/site.webmanifest" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <Script id="theme-init" strategy="beforeInteractive">
          {`(function() {
              const theme = localStorage.getItem('theme') || 'dark';
              document.documentElement.classList.add(theme);
            })();`}
        </Script>

        <style>{`
          ::selection {
            background: #0EA5E9;
            color: #ffffff;
          }
          html, body {
            scroll-behavior: smooth;
            font-feature-settings: "ss01" on;
            -webkit-font-smoothing: antialiased;
            background-color: #0f172a;
            color: #ffffff;
          }
          .professional-grid {
            background-image:
              linear-gradient(rgba(14, 165, 233, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(14, 165, 233, 0.1) 1px, transparent 1px);
            background-size: 20px 20px;
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
            background: linear-gradient(45deg, #0EA5E9, #10B981, #06B6D4, #8B5CF6);
            background-size: 400% 400%;
            animation: energy-flow 4s ease infinite;
          }
        `}</style>
      </head>
      <body className={`${inter.className} antialiased bg-slate-950 text-white transition-colors duration-300 ease-in-out`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <TourProvider autoStart={true}>
            <PyramidResearchProvider>
              <EnhancedUIProvider>
                <EngagementProvider>
                  {children}
                </EngagementProvider>
              </EnhancedUIProvider>
            </PyramidResearchProvider>
          </TourProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
