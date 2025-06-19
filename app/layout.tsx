import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import './globals.css';

import { ThemeProvider } from '@/components/theme-provider';
import Script from 'next/script';

// Dynamic Provider Path Check
import { PyramidResearchProvider } from '@/integrations/pyramid-research/PyramidResearchProvider';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Agile Defense Systems | AI-Driven Defense & Healthcare Automation',
  description:
    'Secure, HIPAA- & CMMC-Compliant AI Solutions for Contract Intelligence, Clinical Workflows, and Cybersecurity. AIDEN Enterprise platform with AGENT-M3c multi-modal AI orchestration.',
  keywords:
    'AI-driven defense contracting, HIPAA-compliant AI orchestration, FHIR Redox clinical automation, automated RFP analysis, bid scoring, cybersecurity red team, AIDEN platform, AGENT-M3c, multi-model AI',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://agiledefensesystems.com',
    title: 'Agile Defense Systems | AI-Driven Defense & Healthcare Automation',
    description:
      'Secure, HIPAA- & CMMC-Compliant AI Solutions for Contract Intelligence, Clinical Workflows, and Cybersecurity.',
    siteName: 'Agile Defense Systems',
    images: [
      {
        url: 'https://agiledefensesystems.com/assets/og-banner.jpg',
        width: 1200,
        height: 630,
        alt: 'Agile Defense Systems AI Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agile Defense Systems | AI-Driven Defense & Healthcare Automation',
    description:
      'Secure AI solutions for defense contracting, healthcare automation, and cybersecurity.',
    images: ['https://agiledefensesystems.com/assets/twitter-preview.jpg'],
  },
  robots: { index: true, follow: true },
  generator: 'Next.js',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Agile Defense Systems, LLC',
  description: 'AI-driven defense and healthcare automation solutions',
  url: 'https://agiledefensesystems.com',
  logo: 'https://agiledefensesystems.com/logo.png',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-800-ADS-TECH',
    contactType: 'customer service'
  },
  sameAs: [
    'https://linkedin.com/company/agile-defense-systems'
  ]
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
        <meta name="theme-color" content="#1e40af" />
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
            background: #3b82f6;
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
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
            background-size: 20px 20px;
          }
        `}</style>
      </head>
      <body className={`antialiased bg-slate-950 text-white transition-colors duration-300 ease-in-out ${inter.className}`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <PyramidResearchProvider>
            {children}
          </PyramidResearchProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
