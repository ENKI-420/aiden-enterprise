"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Target, Users, TrendingUp, Award, ChevronDown } from "lucide-react"
import ExecutiveAnimatedBackground from "@/components/animated-background"
import { BusinessAssistant } from "@/components/3d-assistant/business-assistant"
import { cn } from "@/lib/utils"

export default function ExecutiveLandingPage() {
  const [showContent, setShowContent] = useState(false)
  const [assistantOpen, setAssistantOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen w-full text-white">
      <ExecutiveAnimatedBackground />

      {/* Header */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 p-6 flex justify-between items-center z-30 transition-opacity duration-1000",
          showContent ? "opacity-100" : "opacity-0",
        )}
      >
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-lg bg-gold-500 flex items-center justify-center font-bold text-navy-900 text-lg">
            ADS
          </div>
          <div className="hidden sm:block">
            <div className="font-serif text-xl font-bold text-white">Agile Defense Systems</div>
            <div className="text-xs text-gold-400 font-medium">Executive Leadership Platform</div>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button
              variant="outline"
              className="text-white border-gold-500/50 hover:bg-gold-500/10 hover:border-gold-400 backdrop-blur-sm transition-all"
            >
              Access Platform
            </Button>
          </Link>
        </div>
      </header>

      <main className="relative w-full">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center min-h-screen px-6 pt-20">
          <div
            className={cn(
              "max-w-4xl mx-auto transition-all duration-1000",
              showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
            )}
          >
            {/* Executive Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/20 border border-gold-500/30 backdrop-blur-sm mb-8">
              <Award className="h-4 w-4 text-gold-400" />
              <span className="text-sm font-medium text-gold-200">Executive Leadership Excellence</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight">
              Strategic Leadership
              <span className="block text-gold-400">Redefined</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Empowering C-Suite executives with AI-driven insights, strategic frameworks, and performance optimization
              tools designed for the modern defense industry.
            </p>

            {/* Founder Attribution */}
            <div className="flex items-center justify-center gap-4 mb-12 p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center font-bold text-navy-900">
                DD
              </div>
              <div className="text-left">
                <div className="font-semibold text-white">Devin Phillip Davis</div>
                <div className="text-sm text-gold-400">Founder & CEO, Agile Defense Systems LLC</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button size="lg" className="btn-executive text-navy-900 font-semibold px-8 py-4 text-lg group" asChild>
                <Link href="/dashboard">
                  Launch Executive Dashboard
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gold-500/50 text-gold-200 hover:bg-gold-500/10 hover:border-gold-400 px-8 py-4 text-lg backdrop-blur-sm"
                onClick={() => setAssistantOpen(true)}
              >
                Meet Your AI Assistant
              </Button>
            </div>

            {/* Scroll Indicator */}
            <div className="animate-bounce">
              <ChevronDown className="h-6 w-6 text-gold-400 mx-auto" />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          className={cn(
            "w-full py-24 transition-opacity duration-1000",
            showContent ? "opacity-100" : "opacity-0 pointer-events-none",
          )}
        >
          <div className="container px-6 mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block rounded-lg bg-gold-500/20 px-3 py-1 text-sm text-gold-400 font-medium mb-4">
                Platform Capabilities
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Executive Command Center</h2>
              <p className="max-w-3xl mx-auto text-xl text-slate-300">
                Comprehensive tools and insights designed specifically for defense industry leaders who demand
                excellence in strategic execution.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <ExecutiveFeatureCard
                icon={<Shield className="w-8 h-8 text-gold-400" />}
                title="Defense-Grade Security"
                description="Military-standard encryption and compliance frameworks ensuring your strategic data remains protected at the highest levels."
              />
              <ExecutiveFeatureCard
                icon={<Target className="w-8 h-8 text-blue-400" />}
                title="Strategic Intelligence"
                description="AI-powered market analysis and competitive intelligence tailored for defense contractors and government relations."
              />
              <ExecutiveFeatureCard
                icon={<Users className="w-8 h-8 text-green-400" />}
                title="Leadership Development"
                description="Executive coaching modules and team optimization tools designed for high-stakes defense industry leadership."
              />
              <ExecutiveFeatureCard
                icon={<TrendingUp className="w-8 h-8 text-purple-400" />}
                title="Performance Analytics"
                description="Real-time KPI tracking and predictive modeling for contract performance and organizational efficiency."
              />
              <ExecutiveFeatureCard
                icon={<Award className="w-8 h-8 text-gold-400" />}
                title="Compliance Management"
                description="Automated compliance tracking for DFARS, ITAR, and other critical defense industry regulations."
              />
              <ExecutiveFeatureCard
                icon={<ArrowRight className="w-8 h-8 text-red-400" />}
                title="Strategic Execution"
                description="Project management and strategic initiative tracking with defense industry best practices integration."
              />
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="w-full py-24 bg-gradient-to-r from-navy-900 to-navy-800">
          <div className="container px-6 mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
              Ready to Transform Your Leadership?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Join the ranks of defense industry executives who trust Agile Defense Systems for strategic advantage and
              operational excellence.
            </p>
            <Button size="lg" className="btn-executive text-navy-900 font-semibold px-12 py-4 text-xl" asChild>
              <Link href="/dashboard">Begin Your Strategic Journey</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* 3D Business Assistant */}
      <BusinessAssistant
        isOpen={assistantOpen}
        onClose={() => setAssistantOpen(false)}
        onToggle={() => setAssistantOpen(!assistantOpen)}
      />
    </div>
  )
}

interface ExecutiveFeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function ExecutiveFeatureCard({ icon, title, description }: ExecutiveFeatureCardProps) {
  return (
    <div className="group p-8 rounded-xl executive-card hover:shadow-executive transition-all duration-300 transform hover:-translate-y-2">
      <div className="p-4 rounded-full bg-navy-900/20 dark:bg-gold-500/20 mb-6 w-fit group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-serif font-bold text-navy-900 dark:text-white mb-4">{title}</h3>
      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{description}</p>
    </div>
  )
}
