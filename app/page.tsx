"use client";

import EnhancedWelcomeSystem from "@/components/EnhancedWelcomeSystem";
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import HealthLinkInvestorPitch from "@/components/HealthLinkInvestorPitch";
import ParticleBackground from "@/components/ParticleBackground";
import TourGuideProvider from "@/components/TourGuideProvider";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { motion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  Building2,
  Cpu,
  Database,
  Network,
  Shield,
  Star,
  Users
} from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const INDUSTRY_COPY: Record<string, { title: string; tagline: string; points: string[] }> = {
  healthcare: {
    title: "AI-Powered Care Transformation",
    tagline: "Unify patient data, unlock proactive insights.",
    points: [
      "Secure FHIR interoperability",
      "Personal AI health assistant",
      "Automation of tedious workflows"
    ]
  },
  defense: {
    title: "Mission-Critical Intelligence",
    tagline: "Real-time multi-model analytics for defense operations.",
    points: [
      "Cross-domain data fusion",
      "Autonomous threat detection",
      "Secure multi-model orchestration"
    ]
  },
  finance: {
    title: "Next-Gen Financial AI",
    tagline: "Transform risk analysis and customer engagement.",
    points: [
      "Automated compliance checks",
      "Generative reporting",
      "Fraud prediction models"
    ]
  }
};

interface WelcomeInsights {
  startTime: Date;
  interactions: number;
  stepsCompleted: number;
  completionRate: number;
  satisfactionScore?: number;
  featureDiscovery: string[];
  conversionEvents: string[];
}

export default function LandingPage() {
  const [industry, setIndustry] = useState<string | null>(null);
  const [firstTime, setFirstTime] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const qsIndustry = params.get("industry");
      const stored = localStorage.getItem("preferredIndustry");
      const ind = qsIndustry || stored || "healthcare";
      if (qsIndustry) localStorage.setItem("preferredIndustry", qsIndustry);
      setIndustry(ind);

      // Check if enhanced welcome has been completed
      const hasCompletedEnhanced = localStorage.getItem("enhancedWelcomeCompleted");
      if (!hasCompletedEnhanced) {
        setFirstTime(true);
      }
    }
  }, []);

  const copy = INDUSTRY_COPY[industry as keyof typeof INDUSTRY_COPY] || INDUSTRY_COPY.healthcare;

  const handleWelcomeComplete = (insights: WelcomeInsights) => {
    if (typeof window !== 'undefined') {
      console.log('Welcome completed with insights:', insights);
      setFirstTime(false);

      // Track completion analytics
      fetch('/api/analytics/welcome-completion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          insights,
          industry,
          timestamp: new Date().toISOString()
        })
      }).catch((error) => {
        console.error('Failed to track welcome completion:', error);
      });
    }
  };

  const handleWelcomeDismiss = () => {
    setFirstTime(false);
    if (typeof window !== 'undefined') {
      console.log('Welcome dismissed');
    }
  };

  return (
    <TourGuideProvider>
      {firstTime && (
        <EnhancedWelcomeSystem
          onComplete={handleWelcomeComplete}
          onDismiss={handleWelcomeDismiss}
          userRole="professional"
          industry={industry || "healthcare"}
          isFirstVisit={true}
          analyticsEnabled={true}
        />
      )}

      <div className="min-h-screen bg-slate-950 text-white">
        <Header />

        {/* HERO */}
        <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden">
          {/* Quantum Background */}
          <div className="absolute inset-0 z-0">
            <ParticleBackground />
          </div>
          <video
            className="absolute inset-0 w-full h-full object-cover opacity-10" autoPlay loop muted playsInline
            src="/hero-healthlink.mp4" onError={(e) => { (e.currentTarget as HTMLVideoElement).style.display = 'none'; }}
          />
          <div className="relative z-10 max-w-4xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent"
            >
              {(copy && copy.title) ? copy.title : "IRIS-AI Enterprise, Defense, Legal, Healthcare Platform Powered by the IRIS MCP SDK"}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="mt-6 text-lg md:text-2xl text-gray-300"
            >
              {(copy && copy.tagline) ? copy.tagline : "The industry-leading multi-modal AI orchestration platform for enterprise, defense, legal, and healthcare."}
            </motion.p>
            <motion.ul
              initial="hidden" animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.2 } } }}
              className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-left"
            >
              {(copy?.points && Array.isArray(copy.points)) ? (
                copy.points.map(p => (
                  <motion.li
                    key={p}
                    variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                    className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 text-gray-200"
                  >
                    {p}
                  </motion.li>
                ))
              ) : (
                <>
                  <motion.li
                    variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                    className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 text-gray-200"
                  >
                    Quantum-enhanced analytics, neural model fusion, and adaptive learning for enterprise.
                  </motion.li>
                  <motion.li
                    variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                    className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 text-gray-200"
                  >
                    Industry-leading security, compliance, and real-time performance monitoring.
                  </motion.li>
                  <motion.li
                    variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                    className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 text-gray-200"
                  >
                    Tailored AI solutions for healthcare, defense, and legal operations.
                  </motion.li>
                </>
              )}
            </motion.ul>
          </div>
        </section>

        {/* INDUSTRY SECTION */}
        <section id="industry-section" className="py-24 px-6 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent mb-4">
              Tailored AI Solutions
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              We auto-detect your industry to surface the most relevant AI demos and case studies.
            </p>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
              {Object.entries(INDUSTRY_COPY).map(([key, val]) => (
                <div key={key} className={`rounded-2xl p-6 border hover:shadow-xl transition cursor-pointer ${industry === key ? 'border-blue-500' : 'border-white/10'}`} onClick={() => setIndustry(key)} aria-label={`Select ${key}`}>
                  <h3 className="text-xl font-semibold text-white mb-2">{val.title}</h3>
                  <p className="text-sm text-gray-400">{val.tagline}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* INVESTOR SPOTLIGHT */}
        <section id="investor-spotlight" className="py-24 px-6 bg-slate-900">
          <HealthLinkInvestorPitch />
        </section>

        {/* Social Proof */}
        <section className="py-16 px-4 bg-slate-900/30">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-slate-400 mb-8">Trusted by leading organizations</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="text-slate-500 font-semibold">USACE</div>
              <div className="text-slate-500 font-semibold">Epic Systems</div>
              <div className="text-slate-500 font-semibold">Redox</div>
              <div className="text-slate-500 font-semibold">OpenAI</div>
              <div className="text-slate-500 font-semibold">Federal Contractors</div>
            </div>
          </div>
        </section>

        {/* Solutions Overview */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Enterprise AI Solutions</h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Comprehensive AI platforms designed for mission-critical operations across defense, healthcare, and cybersecurity sectors.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <SolutionCard
                icon={<Cpu className="w-8 h-8 text-blue-400" />}
                title="AI-Driven Engineering"
                description="Leverage AI for advanced engineering workflows, optimizing performance and reduced costs."
                features={["Genomics", "Predictive Maintenance", "Autonomy"]}
                href="/solutions#ai-engineering"
              />
              <SolutionCard
                icon={<Shield className="w-8 h-8 text-blue-400" />}
                title="Defense Contract Intelligence"
                description="Automate RFP analysis and bid scoring to boost win rates by up to 30%."
                features={["Auto RFP Analysis", "Bid Scoring", "SAM.gov Integration"]}
                href="/solutions#defense-contract"
              />
              <SolutionCard
                icon={<Building2 className="w-8 h-8 text-blue-400" />}
                title="Healthcare Automation"
                description="Streamline clinical operations with FHIR and Redox integrations."
                features={["FHIR Integration", "Redox", "Clinical Workflows"]}
                href="/solutions#healthcare"
              />
              <SolutionCard
                icon={<Users className="w-8 h-8 text-blue-400" />}
                title="Cybersecurity & Red Team"
                description="Execute automated phishing simulations and C2 frameworks."
                features={["Phishing Sim", "C2 Frameworks", "Pentest Automation"]}
                href="/solutions#cybersecurity"
              />
            </div>

            {/* Project Spectra Highlight */}
            <div className="mt-20 text-center">
              <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl p-8 border border-amber-500/20">
                <h3 className="text-2xl font-bold text-amber-300 mb-4">Project Spectra</h3>
                <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                  Explore the weapons hypothesis through interactive 3D visualization, physics simulation, and materials analysis.
                </p>
                <Link href="/project-spectra">
                  <Button className="bg-amber-500 hover:bg-amber-600 text-black">
                    Explore Project Spectra
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-20 px-4 bg-slate-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Real-World Applications</h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                See how our AI solutions are transforming industries and solving complex challenges.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <UseCaseCard
                icon={<Brain className="w-8 h-8 text-green-400" />}
                title="Clinical Decision Support"
                description="AI-powered diagnostic assistance and treatment recommendations for healthcare providers."
              />
              <UseCaseCard
                icon={<Network className="w-8 h-8 text-blue-400" />}
                title="Threat Intelligence"
                description="Real-time threat detection and analysis for defense and cybersecurity operations."
              />
              <UseCaseCard
                icon={<Database className="w-8 h-8 text-blue-400" />}
                title="Data Integration"
                description="Seamless integration of disparate data sources for comprehensive analytics."
              />
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">What Our Clients Say</h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Hear from professionals who have transformed their operations with our AI solutions.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <TestimonialCard
                quote="The AI platform has revolutionized our patient care workflow, reducing administrative burden by 40%."
                author="Dr. Sarah Johnson"
                title="Chief Medical Officer"
                rating={5}
              />
              <TestimonialCard
                quote="Real-time threat detection capabilities have significantly enhanced our security posture."
                author="Michael Chen"
                title="Security Director"
                rating={5}
              />
              <TestimonialCard
                quote="The automation features have streamlined our compliance processes and reduced errors."
                author="Lisa Rodriguez"
                title="Compliance Manager"
                rating={5}
              />
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </TourGuideProvider>
  );
}

function SolutionCard({ icon, title, description, features, href }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  href: string;
}) {
  return (
    <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 group">
      <CardHeader>
        <div className="flex items-center gap-3 mb-4">
          {icon}
          <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
            {title}
          </h3>
        </div>
        <CardDescription className="text-gray-300">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {features.map((feature, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
          <Link href={href}>
            <Button variant="outline" size="sm" className="w-full mt-4">
              Learn More
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function UseCaseCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
      <CardHeader>
        <div className="flex items-center gap-3 mb-4">
          {icon}
          <h3 className="text-xl font-semibold text-white">{title}</h3>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300">{description}</p>
      </CardContent>
    </Card>
  );
}

function TestimonialCard({ quote, author, title, rating }: {
  quote: string;
  author: string;
  title: string;
  rating: number;
}) {
  return (
    <Card className="bg-white/5 backdrop-blur-sm border-white/10">
      <CardContent className="p-6">
        <div className="flex items-center gap-1 mb-4">
          {Array.from({ length: rating }, (_, i) => (
            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <blockquote className="text-gray-300 mb-4 italic">
          "{quote}"
        </blockquote>
        <div className="text-sm">
          <div className="font-semibold text-white">{author}</div>
          <div className="text-gray-400">{title}</div>
        </div>
      </CardContent>
    </Card>
  );
}
