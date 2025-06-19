import { Button } from '@/components/ui/button';
import { Shield, Users, Settings, BarChart3, Briefcase, UserCheck, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 text-white">
      {/* Navigation */}
      <nav className="w-full flex justify-between items-center px-8 py-4 bg-black/90 shadow-lg">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-gradient-to-br from-blue-500 to-yellow-400 flex items-center justify-center font-bold">ADS</div>
          <span className="font-bold text-xl tracking-wide">AGILE DEFENSE SYSTEMS</span>
        </Link>
        <div className="flex gap-4 text-sm">
          <Link href="/" className="hover:text-blue-400 transition">← Back to Home</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Secure Platform Access
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Choose your platform and role to access mission-critical AI systems and services.
          </p>
        </div>
      </section>

      {/* Platform Selection */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Select Your Platform</h2>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* PAAS */}
          <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700 hover:border-blue-500 transition-colors">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold">PAAS</span>
            </div>
            <h3 className="text-2xl font-bold text-center mb-4">Platform as a Service</h3>
            <p className="text-gray-300 text-center mb-6">
              Full development and deployment platform with enterprise security.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm text-gray-400">
                <Shield className="w-4 h-4 mr-2 text-blue-400" />
                Custom AI Model Training
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <Settings className="w-4 h-4 mr-2 text-blue-400" />
                API Management & Orchestration
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <Lock className="w-4 h-4 mr-2 text-blue-400" />
                Enterprise Security & Compliance
              </div>
            </div>
            <Link href="/login/paas" className="block w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-center font-bold hover:opacity-90 transition">
              Access PAAS
            </Link>
          </div>

          {/* SAAS */}
          <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700 hover:border-green-500 transition-colors">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold">SAAS</span>
            </div>
            <h3 className="text-2xl font-bold text-center mb-4">Software as a Service</h3>
            <p className="text-gray-300 text-center mb-6">
              Ready-to-use AI applications for healthcare, legal, and defense.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm text-gray-400">
                <Users className="w-4 h-4 mr-2 text-green-400" />
                Pre-built AI Applications
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <BarChart3 className="w-4 h-4 mr-2 text-green-400" />
                Role-based Access Control
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <ArrowRight className="w-4 h-4 mr-2 text-green-400" />
                Integration Ready
              </div>
            </div>
            <Link href="/login/saas" className="block w-full py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-center font-bold hover:opacity-90 transition">
              Access SAAS
            </Link>
          </div>

          {/* AIAAS */}
          <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700 hover:border-purple-500 transition-colors">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6">
              <span className="text-xl font-bold">AIAAS</span>
            </div>
            <h3 className="text-2xl font-bold text-center mb-4">AI Agent as a Service</h3>
            <p className="text-gray-300 text-center mb-6">
              Specialized AI agents for research, analysis, and decision support.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm text-gray-400">
                <UserCheck className="w-4 h-4 mr-2 text-purple-400" />
                Specialized AI Agents
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <Settings className="w-4 h-4 mr-2 text-purple-400" />
                Multi-modal Capabilities
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <BarChart3 className="w-4 h-4 mr-2 text-purple-400" />
                Real-time Processing
              </div>
            </div>
            <Link href="/login/aiaas" className="block w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-center font-bold hover:opacity-90 transition">
              Access AIAAS
            </Link>
          </div>
        </div>

        {/* Role Preview */}
        <div className="bg-gray-800/30 rounded-2xl p-8 border border-gray-700">
          <h3 className="text-2xl font-bold text-center mb-8">Role-Based Access Control</h3>
          <p className="text-gray-300 text-center mb-8">
            Each platform provides specialized dashboards and tools based on your role and clearance level.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded bg-blue-600 flex items-center justify-center mr-3">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h4 className="font-bold">Executive</h4>
              </div>
              <p className="text-sm text-gray-400 mb-3">Strategic oversight and high-level analytics</p>
              <ul className="space-y-1 text-xs text-gray-500">
                <li>• Executive Dashboards</li>
                <li>• Strategic KPIs</li>
                <li>• Budget & Resource Planning</li>
                <li>• Risk Assessment</li>
              </ul>
            </div>

            <div className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded bg-green-600 flex items-center justify-center mr-3">
                  <Settings className="w-5 h-5" />
                </div>
                <h4 className="font-bold">Technical</h4>
              </div>
              <p className="text-sm text-gray-400 mb-3">System administration and configuration</p>
              <ul className="space-y-1 text-xs text-gray-500">
                <li>• System Monitoring</li>
                <li>• Deployment Tools</li>
                <li>• API Management</li>
                <li>• Performance Tuning</li>
              </ul>
            </div>

            <div className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded bg-purple-600 flex items-center justify-center mr-3">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h4 className="font-bold">Analyst</h4>
              </div>
              <p className="text-sm text-gray-400 mb-3">Data analysis and intelligence gathering</p>
              <ul className="space-y-1 text-xs text-gray-500">
                <li>• Data Analytics Tools</li>
                <li>• Report Generation</li>
                <li>• Intelligence Dashboards</li>
                <li>• Predictive Models</li>
              </ul>
            </div>

            <div className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded bg-red-600 flex items-center justify-center mr-3">
                  <Shield className="w-5 h-5" />
                </div>
                <h4 className="font-bold">Security</h4>
              </div>
              <p className="text-sm text-gray-400 mb-3">Security monitoring and compliance</p>
              <ul className="space-y-1 text-xs text-gray-500">
                <li>• Threat Monitoring</li>
                <li>• Compliance Tracking</li>
                <li>• Audit Logs</li>
                <li>• Incident Response</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Security Notice */}
      <section className="py-12 px-4 bg-gradient-to-r from-red-900/20 to-yellow-900/20 border-t border-red-500/30">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-red-400 mr-3" />
            <h3 className="text-2xl font-bold text-red-400">Security Notice</h3>
          </div>
          <p className="text-gray-300 mb-6">
            All platform access is logged and monitored. Multi-factor authentication is required for all accounts.
            Unauthorized access attempts will be reported to appropriate authorities.
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="font-semibold text-green-400 mb-2">CMMC Level 3</div>
              <div className="text-gray-400">Cybersecurity Maturity Model Certification</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="font-semibold text-blue-400 mb-2">NIST 800-171</div>
              <div className="text-gray-400">Controlled Unclassified Information</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="font-semibold text-purple-400 mb-2">FedRAMP</div>
              <div className="text-gray-400">Federal Risk Authorization Program</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-950 border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Agile Defense Systems, LLC. All rights reserved. | CAGE: 9HuP5 | SDVOSB Certified
          </p>
        </div>
      </footer>
    </main>
  );
}