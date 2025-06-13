import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Head from "next/head"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AGENT-M3c | AI-Enhanced Secure Ops for Healthcare, Law & Defense",
  description:
    "AGENT-M3c empowers mission-critical teams with real-time video + AI collaboration. Supports compliant agent orchestration, intelligent document parsing, and modular integration with Epic, Redox, and federal systems.",
  keywords: "AGENT-M3c, HIPAA video AI, legal automation, AI for healthcare, federal AI tools, multi-agent LLM orchestration, Redox FHIR AI, AIDEN infrastructure, secure knowledge AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://agentm3c.agiledefensesystems.us",
    title: "AGENT-M3c | Live Collaboration with AI Copilots",
    description:
      "Deploy intelligent, secure, and role-aware AI copilots inside live video workflows—tailored for legal, healthcare, and defense teams.",
    siteName: "AGENT-M3c",
    images: [
      {
        url: "https://agentm3c.agiledefensesystems.us/assets/og-banner.jpg",
        width: 1200,
        height: 630,
        alt: "AGENT-M3c Live AI Copilot Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AGENT-M3c | Live AI Ops for Gov & Enterprise",
    description: "Secure LLM orchestration for legal, clinical, and intelligence operations—compliant and mission-ready.",
    images: ["https://agentm3c.agiledefensesystems.us/assets/twitter-preview.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  generator: "v0.dev"
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "AGENT-M3c",
  "operatingSystem": "Web",
  "applicationCategory": "BusinessApplication",
  "offers": {
    "@type": "Offer",
    "price": "499.00",
    "priceCurrency": "USD"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Agile Defense Systems"
  },
  "url": "https://agentm3c.agiledefensesystems.us",
  "image": "https://agentm3c.agiledefensesystems.us/assets/og-banner.jpg",
  "description": "HIPAA-compliant AI + video collaboration system for mission-critical roles across legal, healthcare, and defense sectors."
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://agentm3c.agiledefensesystems.us" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#1a1d21" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <style>{`
          ::selection {
            background: #2465ed;
            color: white;
          }
          html, body {
            scroll-behavior: smooth;
            background-color: #f9fafb;
          }
          body {
            font-feature-settings: "ss01" on;
            -webkit-font-smoothing: antialiased;
          }
        `}</style>
      </head>
      <body className={inter.className + " antialiased bg-background text-foreground transition-colors duration-300 ease-in-out"}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
