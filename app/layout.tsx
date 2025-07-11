import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Genomic Twin - AI-Powered Genomic Digital Twin Platform | Precision Medicine",
  description:
    "Revolutionary Genomic Digital Twin platform for precision medicine. Create AI-powered genetic simulations for personalized healthcare, drug response prediction, and clinical decision support. HIPAA compliant genomic analysis platform.",
  keywords:
    "Genomic Digital Twin, Precision Medicine AI, Personalized Healthcare, Genomic Analysis Platform, AI Healthcare, Pharmacogenomics, Genetic Risk Prediction, Clinical Decision Support, HIPAA Compliant Genomics, Healthcare AI SaaS, Personalized Medicine Platform, Genomic Simulation, Health Prediction AI, Genetic Testing Analysis, Clinical Genomics, Population Health Genomics, Drug Response Prediction, Genetic Risk Assessment, Healthcare Data Integration, Medical AI Platform, Genomic Twin Builder, AI Genomic Analysis, Personalized Health Simulation, Genetic Privacy Protection, Healthcare Data Security, Clinical Research Platform, Genomic Profile Analyzer, Health Simulation Engine, Continuous Health Monitoring, AI-Powered Precision Medicine",
  authors: [{ name: "Genomic Twin Healthcare Team" }],
  creator: "Genomic Twin",
  publisher: "Genomic Twin",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://genomictwin1.vercel.app",
    title: "Genomic Twin - AI-Powered Genomic Digital Twin Platform | Precision Medicine",
    description:
      "Revolutionary Genomic Digital Twin platform for precision medicine. Create AI-powered genetic simulations for personalized healthcare and clinical decision support.",
    siteName: "Genomic Twin",
  },
  twitter: {
    card: "summary_large_image",
    title: "Genomic Twin - Precision Medicine AI Platform",
    description: "Create AI-powered genomic digital twins for personalized medicine and clinical decision support.",
    creator: "@genomictwin",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
