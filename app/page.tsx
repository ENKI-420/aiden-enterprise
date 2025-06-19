import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowRight,
  Brain,
  Building2,
  CheckCircle,
  Cpu,
  Database,
  FileText,
  Network,
  Play,
  Shield,
  Star,
  Users
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-slate-900 to-slate-950"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <Badge variant="outline" className="mb-6 border-blue-400 text-blue-400">
            CMMC Level 3 Certified • HIPAA Compliant • FISMA Ready
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
            AI-Driven Defense & Healthcare Automation
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-4xl mx-auto">
            Secure, HIPAA- & CMMC-Compliant AI Solutions for Contract Intelligence,
            Clinical Workflows, and Cybersecurity
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
              <Link href="/contact">
                Request Your Demo Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-4 text-lg">
              <Link href="/platform">
                Explore AIDEN Platform
                <Play className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>

          {/* Key Value Props */}
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
              <div className="text-blue-400 font-semibold text-sm mb-1">AI-DRIVEN DEFENSE CONTRACTING</div>
              <div className="text-slate-300 text-xs">Automated RFP analysis & bid scoring</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
              <div className="text-blue-400 font-semibold text-sm mb-1">HIPAA-COMPLIANT AI ORCHESTRATION</div>
              <div className="text-slate-300 text-xs">Multi-model secure AI workflows</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
              <div className="text-blue-400 font-semibold text-sm mb-1">FHIR REDOX CLINICAL AUTOMATION</div>
              <div className="text-slate-300 text-xs">Streamlined healthcare operations</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
              <div className="text-blue-400 font-semibold text-sm mb-1">AUTOMATED RFP ANALYSIS</div>
              <div className="text-slate-300 text-xs">30% higher win rates</div>
            </div>
          </div>
        </div>
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
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-amber-900/20 to-slate-900/50 border border-amber-500/30 rounded-xl p-8">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-amber-500/20 px-4 py-2 rounded-full mb-4">
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                  <span className="text-amber-200 font-semibold text-sm">SPECIAL RESEARCH PROJECT</span>
                </div>
                <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent">
                  Project Spectra Documentary
                </h3>
                <p className="text-slate-300 mb-6 text-lg">
                  An immersive exploration of the weapons hypothesis and advanced ancient technologies.
                  Discover the intersection of tetrahedral physics, scalar wave theory, and energy amplification systems.
                </p>
                <Button asChild className="bg-amber-600 hover:bg-amber-700 text-black font-semibold">
                  <Link href="/project-spectra">
                    Explore Documentary
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AIDEN Platform Highlight */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-900/20 to-slate-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4 border-blue-400 text-blue-400">
                AIDEN Platform
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Multi-Model AI Orchestration
              </h2>
              <p className="text-xl text-slate-300 mb-8">
                AIDEN enables seamless integration of multiple AI models with enterprise-grade security,
                compliance controls, and real-time performance monitoring.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-slate-300">Interactive Architecture Diagram</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-slate-300">Live Demo with Performance Metrics</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-slate-300">HIPAA, CMMC, FISMA Compliance</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/platform">Explore Platform</Link>
                </Button>
                <Button asChild variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                  <Link href="/platform#demo">Watch Demo</Link>
                </Button>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-blue-400">AGENT-MC3 in Action</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <div className="font-semibold text-white">Live Conferencing</div>
                    <div className="text-sm text-slate-400">Real-time video + AI collaboration</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <div className="font-semibold text-white">Multi-Modal Agents</div>
                    <div className="text-sm text-slate-400">Transcription, analysis, compliance</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <div className="font-semibold text-white">Deploy & Integrate</div>
                    <div className="text-sm text-slate-400">Seamless enterprise workflow</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Industry Applications</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Deployed across critical sectors requiring the highest levels of security and compliance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <UseCaseCard
              icon={<Building2 className="w-8 h-8 text-blue-400" />}
              title="Enterprise"
              description="Large-scale AI orchestration for Fortune 500 companies"
            />
            <UseCaseCard
              icon={<Shield className="w-8 h-8 text-blue-400" />}
              title="Government"
              description="FISMA-compliant AI solutions for federal agencies"
            />
            <UseCaseCard
              icon={<Database className="w-8 h-8 text-blue-400" />}
              title="Financial Services"
              description="Secure AI for banking and financial institutions"
            />
            <UseCaseCard
              icon={<Network className="w-8 h-8 text-blue-400" />}
              title="Healthcare"
              description="HIPAA-compliant clinical AI and genomics platforms"
            />
            <UseCaseCard
              icon={<FileText className="w-8 h-8 text-blue-400" />}
              title="Legal"
              description="AI-powered contract analysis and compliance monitoring"
            />
            <UseCaseCard
              icon={<Brain className="w-8 h-8 text-blue-400" />}
              title="Education"
              description="Secure AI tutoring and research platforms"
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Client Success Stories</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="AIDEN has transformed our contract intelligence capabilities. We've seen a 30% increase in successful bids."
              author="Sarah Chen"
              title="CTO, Defense Contractor"
              rating={5}
            />
            <TestimonialCard
              quote="The HIPAA-compliant AI orchestration has streamlined our clinical workflows beyond expectations."
              author="Dr. Michael Johnson"
              title="IT Director, Regional Health System"
              rating={5}
            />
            <TestimonialCard
              quote="Project Spectra's innovative approach to materials research has opened new possibilities for our R&D."
              author="David Rodriguez"
              title="Head of Innovation, Aerospace Firm"
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-900/30 to-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Operations?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join leading organizations leveraging AI for competitive advantage with enterprise-grade security.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
              <Link href="/contact">
                Schedule Your Demo
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-4 text-lg">
              <Link href="/platform">
                Explore Platform
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// Solution Card Component
function SolutionCard({ icon, title, description, features, href }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  href: string;
}) {
  return (
    <Card className="bg-slate-900/50 border-slate-700 hover:border-blue-500/50 transition-all duration-300 group">
      <CardHeader>
        <div className="mb-4">{icon}</div>
        <CardTitle className="text-white group-hover:text-blue-400 transition-colors">{title}</CardTitle>
        <CardDescription className="text-slate-400">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm text-slate-300">{feature}</span>
            </div>
          ))}
        </div>
        <Button asChild variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-800">
          <Link href={href}>
            Learn More
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

// Use Case Card Component
function UseCaseCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="bg-slate-900/50 border-slate-700 hover:border-blue-500/50 transition-all duration-300">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4">{icon}</div>
        <CardTitle className="text-white">{title}</CardTitle>
        <CardDescription className="text-slate-400">{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}

// Testimonial Card Component
function TestimonialCard({ quote, author, title, rating }: {
  quote: string;
  author: string;
  title: string;
  rating: number;
}) {
  return (
    <Card className="bg-slate-900/50 border-slate-700">
      <CardContent className="pt-6">
        <div className="flex mb-4">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
          ))}
        </div>
        <blockquote className="text-slate-300 mb-4">"{quote}"</blockquote>
        <div>
          <div className="font-semibold text-white">{author}</div>
          <div className="text-sm text-slate-400">{title}</div>
        </div>
      </CardContent>
    </Card>
  );
}
