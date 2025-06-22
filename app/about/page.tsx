import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Award,
    Building2,
    Calendar,
    CheckCircle,
    ExternalLink,
    Mail,
    Shield,
    Users
} from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function About() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="outline" className="mb-6 border-blue-400 text-blue-400">
            About Agile Defense Systems
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
            Pioneering AI Solutions for Critical Infrastructure
          </h1>

          <p className="text-xl text-slate-300 mb-8 max-w-4xl mx-auto">
            Founded by veterans and technologists, Agile Defense Systems delivers mission-critical AI platforms
            that meet the highest standards of security, compliance, and operational excellence.
          </p>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-400">
                  <Shield className="w-6 h-6 mr-3" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  To empower organizations with secure, compliant AI solutions that enhance decision-making,
                  streamline operations, and protect critical data across defense, healthcare, and enterprise sectors.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-400">
                  <Building2 className="w-6 h-6 mr-3" />
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  To be the leading provider of enterprise-grade AI platforms that bridge the gap between
                  cutting-edge innovation and regulatory compliance in mission-critical environments.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center text-green-400">
                  <Users className="w-6 h-6 mr-3" />
                  Our Values
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-slate-300 space-y-2">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-400" /> Security First</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-400" /> Veteran Excellence</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-400" /> Innovation</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-400" /> Integrity</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Leadership Team</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Our leadership combines decades of military service, enterprise technology experience,
              and AI research expertise.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <LeaderCard
              name="Colonel (Ret.) Sarah Mitchell"
              title="Chief Executive Officer"
              bio="Former USAF intelligence officer with 20+ years in defense technology. Led AI initiatives at DARPA and Pentagon."
              credentials={["MBA, Wharton", "MS Computer Science", "Top Secret/SCI"]}
            />

            <LeaderCard
              name="Dr. Michael Chen"
              title="Chief Technology Officer"
              bio="Former Google AI researcher and healthcare technology executive. Expert in HIPAA-compliant AI systems."
              credentials={["PhD AI/ML, Stanford", "Former Google Principal", "Healthcare AI Pioneer"]}
            />

            <LeaderCard
              name="Major (Ret.) David Rodriguez"
              title="Chief Security Officer"
              bio="Cybersecurity expert with extensive experience in federal compliance and risk management."
              credentials={["CISSP, CISM", "Former NSA", "CMMC Assessor"]}
            />
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Company Timeline</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Our journey from startup to trusted government contractor and enterprise AI provider.
            </p>
          </div>

          <div className="space-y-8">
            <TimelineItem
              year="2020"
              title="Company Founded"
              description="Agile Defense Systems established by veteran entrepreneurs with focus on secure AI solutions."
            />

            <TimelineItem
              year="2021"
              title="First Government Contract"
              description="Awarded initial SBIR contract for AI-powered intelligence analysis platform."
            />

            <TimelineItem
              year="2022"
              title="CMMC Certification"
              description="Achieved CMMC Level 3 certification and expanded defense contractor capabilities."
            />

            <TimelineItem
              year="2023"
              title="Healthcare Expansion"
              description="Launched HIPAA-compliant AI platform for clinical workflows and genomics research."
            />

            <TimelineItem
              year="2024"
              title="Enterprise Platform"
              description="Released AIDEN platform with multi-model orchestration and AGENT-MC3 collaboration suite."
            />
          </div>
        </div>
      </section>

      {/* Certifications & Compliance */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Certifications & Compliance</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              We maintain the highest standards of security and compliance across all sectors we serve.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <CertificationCard
              icon={<Shield className="w-12 h-12 text-blue-400" />}
              title="CMMC Level 3"
              description="Cybersecurity Maturity Model Certification for defense contractors"
              status="Certified"
            />

            <CertificationCard
              icon={<Building2 className="w-12 h-12 text-green-400" />}
              title="HIPAA Compliant"
              description="Healthcare data protection and privacy compliance"
              status="Compliant"
            />

            <CertificationCard
              icon={<Award className="w-12 h-12 text-purple-400" />}
              title="FISMA Ready"
              description="Federal Information Security Management Act compliance"
              status="Ready"
            />

            <CertificationCard
              icon={<Users className="w-12 h-12 text-yellow-400" />}
              title="SDVOSB"
              description="Service-Disabled Veteran-Owned Small Business"
              status="Certified"
            />
          </div>

          <div className="mt-12 text-center">
            <Card className="bg-slate-900/50 border-slate-700 inline-block">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl font-bold text-blue-400">CAGE: 9HuP5</div>
                  <div className="text-slate-400">|</div>
                  <div className="text-slate-300">SAM.gov Registered</div>
                  <div className="text-slate-400">|</div>
                  <div className="text-slate-300">ISO 27001 Pursuing</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Careers */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-900/20 to-slate-900/20">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Join Our Mission</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            We're always looking for talented individuals who share our commitment to innovation,
            security, and excellence in AI solutions.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-blue-400">Current Openings</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-left space-y-2 text-slate-300">
                  <li>• Senior AI/ML Engineer</li>
                  <li>• DevSecOps Engineer</li>
                  <li>• Healthcare AI Specialist</li>
                  <li>• Federal Sales Executive</li>
                  <li>• Compliance Analyst</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-green-400">Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-left space-y-2 text-slate-300">
                  <li>• Competitive salary + equity</li>
                  <li>• Full health/dental/vision</li>
                  <li>• 401(k) with matching</li>
                  <li>• Remote-friendly culture</li>
                  <li>• Professional development</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-purple-400">Culture</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-left space-y-2 text-slate-300">
                  <li>• Veteran-friendly environment</li>
                  <li>• Innovation-driven</li>
                  <li>• Security clearance support</li>
                  <li>• Collaborative teams</li>
                  <li>• Mission-focused work</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/contact">
                Apply Now
                <ExternalLink className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-slate-600 text-slate-300 hover:bg-slate-800">
              <Link href="mailto:careers@agiledefensesystems.com">
                Email Careers Team
                <Mail className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

// Leader Card Component
function LeaderCard({ name, title, bio, credentials }: {
  name: string
  title: string
  bio: string
  credentials: string[]
}) {
  return (
    <Card className="bg-slate-900/50 border-slate-700">
      <CardHeader className="text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
          {name.split(' ').map(n => n[0]).join('')}
        </div>
        <CardTitle className="text-white">{name}</CardTitle>
        <p className="text-blue-400 font-medium">{title}</p>
      </CardHeader>
      <CardContent>
        <p className="text-slate-300 mb-4">{bio}</p>
        <div className="space-y-1">
          {credentials.map((cred, index) => (
            <Badge key={index} variant="outline" className="mr-2 mb-2 border-slate-600 text-slate-300">
              {cred}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Timeline Item Component
function TimelineItem({ year, title, description }: {
  year: string
  title: string
  description: string
}) {
  return (
    <div className="flex items-start space-x-6">
      <div className="flex-shrink-0">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
          <Calendar className="w-8 h-8 text-white" />
        </div>
      </div>
      <div className="flex-grow">
        <div className="flex items-center space-x-4 mb-2">
          <Badge variant="outline" className="border-blue-400 text-blue-400">{year}</Badge>
          <h3 className="text-xl font-semibold text-white">{title}</h3>
        </div>
        <p className="text-slate-300">{description}</p>
      </div>
    </div>
  )
}

// Certification Card Component
function CertificationCard({ icon, title, description, status }: {
  icon: React.ReactNode
  title: string
  description: string
  status: string
}) {
  return (
    <Card className="bg-slate-900/50 border-slate-700 text-center">
      <CardHeader>
        <div className="mx-auto mb-4">{icon}</div>
        <CardTitle className="text-white">{title}</CardTitle>
        <Badge
          variant="outline"
          className={
            status === 'Certified' ? 'border-green-400 text-green-400' :
            status === 'Compliant' ? 'border-blue-400 text-blue-400' :
            'border-yellow-400 text-yellow-400'
          }
        >
          {status}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-slate-400 text-sm">{description}</p>
      </CardContent>
    </Card>
  )
}