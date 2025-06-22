import { Award, Building2, CheckCircle, Shield } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">Agile Defense Systems</div>
                <div className="text-sm text-slate-400">AI-Driven Solutions</div>
              </div>
            </div>
            <p className="text-slate-400 text-sm">
              Secure, HIPAA- & CMMC-Compliant AI Solutions for Contract Intelligence,
              Clinical Workflows, and Cybersecurity.
            </p>
            <div className="flex space-x-2">
              <div className="flex items-center space-x-1 bg-slate-800 px-2 py-1 rounded text-xs">
                <CheckCircle className="w-3 h-3 text-green-400" />
                <span className="text-slate-300">HIPAA</span>
              </div>
              <div className="flex items-center space-x-1 bg-slate-800 px-2 py-1 rounded text-xs">
                <CheckCircle className="w-3 h-3 text-green-400" />
                <span className="text-slate-300">CMMC</span>
              </div>
              <div className="flex items-center space-x-1 bg-slate-800 px-2 py-1 rounded text-xs">
                <CheckCircle className="w-3 h-3 text-green-400" />
                <span className="text-slate-300">FISMA</span>
              </div>
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-white font-semibold mb-4">Solutions</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/solutions#ai-engineering" className="text-slate-400 hover:text-white transition-colors">
                  AI-Driven Engineering
                </Link>
              </li>
              <li>
                <Link href="/solutions#defense-contract" className="text-slate-400 hover:text-white transition-colors">
                  Defense Contract Intelligence
                </Link>
              </li>
              <li>
                <Link href="/solutions#healthcare" className="text-slate-400 hover:text-white transition-colors">
                  Healthcare Automation
                </Link>
              </li>
              <li>
                <Link href="/solutions#cybersecurity" className="text-slate-400 hover:text-white transition-colors">
                  Cybersecurity & Red Team
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Platform & Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/platform" className="text-slate-400 hover:text-white transition-colors">
                  AIDEN Platform
                </Link>
              </li>
              <li>
                <Link href="/platform#agent-mc3" className="text-slate-400 hover:text-white transition-colors">
                  AGENT-MC3
                </Link>
              </li>
              <li>
                <Link href="/project-spectra" className="text-slate-400 hover:text-white transition-colors">
                  Project Spectra
                </Link>
              </li>
              <li>
                <Link href="/case-studies" className="text-slate-400 hover:text-white transition-colors">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-slate-400 hover:text-white transition-colors">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/partners" className="text-slate-400 hover:text-white transition-colors">
                  Partners
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-slate-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="text-slate-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="text-slate-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/legal/hipaa" className="text-slate-400 hover:text-white transition-colors">
                  HIPAA Notice
                </Link>
              </li>
            </ul>

            {/* Contact Info */}
            <div className="mt-6 space-y-2 text-sm text-slate-400">
              <div>📧 contact@agiledefensesystems.com</div>
              <div>📞 1-800-ADS-TECH</div>
              <div>🏢 Washington, DC Metro Area</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-slate-400 text-sm">
              © 2024 Agile Defense Systems, LLC. All rights reserved.
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              {/* Trust Badges */}
              <div className="flex items-center space-x-1 text-xs text-slate-400">
                <Award className="w-4 h-4" />
                <span>Service-Disabled Veteran-Owned</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-slate-400">
                <Building2 className="w-4 h-4" />
                <span>CAGE: 9HuP5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}