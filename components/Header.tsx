'use client'

import { Button } from '@/components/ui/button'
import {
    Building2,
    ChevronDown,
    Cpu,
    Menu,
    Shield,
    Users,
    Video,
    X
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false)

  return (
    <header className="w-full bg-slate-950/95 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white">Agile Defense Systems</span>
              <span className="text-xs text-slate-400">AI-Driven Solutions</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/about" className="text-slate-300 hover:text-white transition-colors">
              About
            </Link>

            {/* Solutions Dropdown */}
            <div className="relative">
              <button
                className="flex items-center text-slate-300 hover:text-white transition-colors"
                onMouseEnter={() => setIsSolutionsOpen(true)}
                onMouseLeave={() => setIsSolutionsOpen(false)}
              >
                Solutions
                <ChevronDown className="ml-1 w-4 h-4" />
              </button>

              {isSolutionsOpen && (
                <div
                  className="absolute top-full left-0 mt-1 w-80 bg-slate-900 border border-slate-700 rounded-lg shadow-xl"
                  onMouseEnter={() => setIsSolutionsOpen(true)}
                  onMouseLeave={() => setIsSolutionsOpen(false)}
                >
                  <div className="p-4 space-y-3">
                    <Link href="/solutions#ai-engineering" className="flex items-start space-x-3 p-2 rounded-lg hover:bg-slate-800 transition-colors">
                      <Cpu className="w-5 h-5 text-blue-400 mt-0.5" />
                      <div>
                        <div className="font-medium text-white">AI-Driven Engineering</div>
                        <div className="text-sm text-slate-400">Advanced engineering workflows</div>
                      </div>
                    </Link>
                    <Link href="/solutions#defense-contract" className="flex items-start space-x-3 p-2 rounded-lg hover:bg-slate-800 transition-colors">
                      <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
                      <div>
                        <div className="font-medium text-white">Defense Contract Intelligence</div>
                        <div className="text-sm text-slate-400">RFP analysis & bid scoring</div>
                      </div>
                    </Link>
                    <Link href="/solutions#healthcare" className="flex items-start space-x-3 p-2 rounded-lg hover:bg-slate-800 transition-colors">
                      <Building2 className="w-5 h-5 text-blue-400 mt-0.5" />
                      <div>
                        <div className="font-medium text-white">Healthcare Automation</div>
                        <div className="text-sm text-slate-400">FHIR & Redox integration</div>
                      </div>
                    </Link>
                    <Link href="/solutions#cybersecurity" className="flex items-start space-x-3 p-2 rounded-lg hover:bg-slate-800 transition-colors">
                      <Users className="w-5 h-5 text-blue-400 mt-0.5" />
                      <div>
                        <div className="font-medium text-white">Cybersecurity & Red Team</div>
                        <div className="text-sm text-slate-400">Automated security testing</div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/platform" className="text-slate-300 hover:text-white transition-colors">
              Platform
            </Link>
            <Link href="/conference" className="text-slate-300 hover:text-white transition-colors flex items-center">
              <Video className="w-4 h-4 mr-1" />
              Conference
            </Link>
            <Link href="/case-studies" className="text-slate-300 hover:text-white transition-colors">
              Case Studies
            </Link>
            <Link href="/spectra" className="text-slate-300 hover:text-white transition-colors">
              Project Spectra
            </Link>
            <Link href="/resources" className="text-slate-300 hover:text-white transition-colors">
              Resources
            </Link>
            <Link href="/partners" className="text-slate-300 hover:text-white transition-colors">
              Partners
            </Link>
            <Link href="/contact" className="text-slate-300 hover:text-white transition-colors">
              Contact
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/contact">Request Demo</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 text-slate-300 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 py-4">
            <div className="space-y-2">
              <Link href="/about" className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                About
              </Link>
              <Link href="/solutions" className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                Solutions
              </Link>
              <Link href="/platform" className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                Platform
              </Link>
              <Link href="/conference" className="flex items-center px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                <Video className="w-4 h-4 mr-2" />
                AI Conference
              </Link>
              <Link href="/case-studies" className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                Case Studies
              </Link>
              <Link href="/spectra" className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                Project Spectra
              </Link>
              <Link href="/resources" className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                Resources
              </Link>
              <Link href="/partners" className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                Partners
              </Link>
              <Link href="/contact" className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                Contact
              </Link>
              <div className="px-4 pt-2">
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <Link href="/contact">Request Demo</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}