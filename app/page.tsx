"use client";

import { EnhancedPageLayout } from '@/components/ai/AIEnhancedLayout';
import TourEngineWrapper from '@/components/TourEngineWrapper';
import { badgeVariants } from '@/components/ui/design-system';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { CardContent, CardHeader, EnhancedCard } from '@/components/ui/enhanced-card';
import { cn } from '@/lib/utils';
import {
    ArrowRightIcon,
    BeakerIcon,
    BookOpenIcon,
    ChartBarIcon,
    CommandLineIcon,
    CpuChipIcon,
    GlobeAltIcon,
    HeartIcon,
    LockClosedIcon,
    PlayIcon,
    RocketLaunchIcon,
    ShieldCheckIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const features = [
    {
      title: "AI-Powered Development",
      description: "Advanced coding suite with Aiden Engine integration, real-time analysis, and intelligent refactoring",
      icon: CommandLineIcon,
      category: "ai",
      href: "/ai-coding-suite",
      capabilities: ["Code Generation", "Debugging", "Refactoring", "Auto-completion"],
    },
    {
      title: "Project Spectra Research",
      description: "Cutting-edge pyramid physics simulation with 3D visualization and materials analysis",
      icon: BeakerIcon,
      category: "research",
      href: "/project-spectra",
      capabilities: ["3D Visualization", "Physics Simulation", "Energy Flow", "Crystal Analysis"],
    },
    {
      title: "Healthcare Platform",
      description: "HIPAA-compliant clinical workflow automation with AI-powered diagnostic assistance",
      icon: HeartIcon,
      category: "healthcare",
      href: "/healthcare-platform",
      capabilities: ["Patient Management", "Clinical Decision Support", "Workflow Automation", "Risk Assessment"],
    },
    {
      title: "Defense Systems",
      description: "Cybersecurity and threat detection with automated response and predictive analysis",
      icon: ShieldCheckIcon,
      category: "defense",
      href: "/defense-systems",
      capabilities: ["Threat Detection", "Vulnerability Assessment", "Incident Response", "Predictive Analysis"],
    },
  ];

  const stats = [
    { label: "AI Models", value: "12+", description: "Multi-modal AI systems" },
    { label: "Security Certifications", value: "HIPAA & CMMC", description: "Enterprise-grade compliance" },
    { label: "Processing Speed", value: "99.9%", description: "Uptime guarantee" },
    { label: "Global Reach", value: "150+", description: "Countries supported" },
  ];

  const capabilities = [
    {
      title: "Aiden Engine Orchestration",
      description: "Multi-modal AI agent coordination for complex workflows",
      icon: CpuChipIcon,
      category: "ai",
    },
    {
      title: "Real-time Analytics",
      description: "Live data processing and predictive insights",
      icon: ChartBarIcon,
      category: "general",
    },
    {
      title: "Secure Infrastructure",
      description: "Enterprise-grade security with end-to-end encryption",
      icon: LockClosedIcon,
      category: "defense",
    },
    {
      title: "Scalable Architecture",
      description: "Cloud-native design for global deployment",
      icon: GlobeAltIcon,
      category: "general",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setActiveFeature((prev) => (prev + 1) % features.length);
      setTimeout(() => setIsAnimating(false), 500);
    }, 5000);

    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <>
      <TourEngineWrapper />
      <EnhancedPageLayout
        title="Agile Defense Systems"
        description="Powered by the Aiden Engine - Advanced AI-Driven Defense & Healthcare Automation Platform"
        userRole="guest"
        variant="gradient"
      >
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 lg:p-12">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 mb-6">
                <div className="h-12 w-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                  <RocketLaunchIcon className="h-7 w-7 text-white" />
                </div>
                <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  AIDEN
                </h1>
              </div>
              <p className="text-xl lg:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto">
                Powered by the Aiden Engine
              </p>
              <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Next-generation AI platform for defense contracting, healthcare automation, and cybersecurity
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <EnhancedButton
                  size="xl"
                  ai
                  glow
                  className="text-lg px-8 py-4"
                  asChild
                >
                  <Link href="/dashboard">
                    <PlayIcon className="h-5 w-5 mr-2" />
                    Launch Platform
                  </Link>
                </EnhancedButton>
                <EnhancedButton
                  variant="outline"
                  size="xl"
                  className="text-lg px-8 py-4"
                  asChild
                >
                  <Link href="/tour-demo">
                    <BookOpenIcon className="h-5 w-5 mr-2" />
                    Take Tour
                  </Link>
                </EnhancedButton>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <EnhancedCard
              key={index}
              variant="glass"
              padding="lg"
              className="text-center"
            >
              <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-sm font-medium text-foreground mb-1">{stat.label}</div>
              <div className="text-xs text-muted-foreground">{stat.description}</div>
            </EnhancedCard>
          ))}
        </section>

        {/* Features Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Core Capabilities</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our advanced AI-powered solutions designed for enterprise-scale operations
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <EnhancedCard
                key={index}
                variant={feature.category === 'ai' ? 'ai' :
                        feature.category === 'healthcare' ? 'healthcare' :
                        feature.category === 'defense' ? 'defense' : 'interactive'}
                interactive
                glow={feature.category === 'ai'}
                className={cn(
                  "transition-all duration-500",
                  {
                    "scale-105 shadow-2xl": activeFeature === index && isAnimating,
                  }
                )}
                asChild
              >
                <Link href={feature.href}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-12 w-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <ArrowRightIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {feature.capabilities.map((capability, capIndex) => (
                        <span
                          key={capIndex}
                          className={cn(
                            badgeVariants({ variant: "secondary" }),
                            "text-xs"
                          )}
                        >
                          {capability}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Link>
              </EnhancedCard>
            ))}
          </div>
        </section>

        {/* Capabilities Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Aiden Engine Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Advanced AI orchestration and multi-modal processing capabilities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {capabilities.map((capability, index) => (
              <EnhancedCard
                key={index}
                variant="glass"
                padding="lg"
                className="text-center"
              >
                <div className="h-12 w-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mx-auto mb-4">
                  <capability.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">{capability.title}</h3>
                <p className="text-sm text-muted-foreground">{capability.description}</p>
              </EnhancedCard>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <EnhancedCard variant="glass" padding="xl" className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Operations?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Experience the power of the Aiden Engine with enterprise-grade AI capabilities
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <EnhancedButton
                size="lg"
                ai
                glow
                className="text-lg px-8 py-4"
                asChild
              >
                <Link href="/dashboard">
                  <PlayIcon className="h-5 w-5 mr-2" />
                  Get Started
                </Link>
              </EnhancedButton>
              <EnhancedButton
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4"
                asChild
              >
                <Link href="/about">
                  <BookOpenIcon className="h-5 w-5 mr-2" />
                  Learn More
                </Link>
              </EnhancedButton>
            </div>
          </EnhancedCard>
        </section>
      </EnhancedPageLayout>
    </>
  );
}
