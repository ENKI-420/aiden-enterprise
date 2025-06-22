'use client'

import Link from 'next/link'
import { useState } from 'react'
import AgileDefenseLogo3D from './AgileDefenseLogo3D'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10">
              <AgileDefenseLogo3D
                width={40}
                height={40}
                interactive={false}
                className="transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Agile Defense Systems
              </span>
              <span className="text-xs text-gray-400 -mt-1">
                Powered by the AIDEN Engine
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/platform"
              className="text-gray-300 hover:text-blue-400 transition-colors font-medium"
            >
              Platform
            </Link>
            <Link
              href="/solutions"
              className="text-gray-300 hover:text-blue-400 transition-colors font-medium"
            >
              Solutions
            </Link>
            <Link
              href="/conference"
              className="text-gray-300 hover:text-blue-400 transition-colors font-medium"
            >
              Conference
            </Link>
            <Link
              href="/ai-coding-suite"
              className="text-gray-300 hover:text-blue-400 transition-colors font-medium"
            >
              AI Suite
            </Link>
            <Link
              href="/project-spectra"
              className="text-gray-300 hover:text-amber-400 transition-colors font-medium"
            >
              Project Spectra
            </Link>
            <Link
              href="/contact"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium"
            >
              Contact
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
            aria-label="Toggle mobile menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-900/95 backdrop-blur-lg rounded-lg mt-2 p-4 border border-slate-700/50">
            <nav className="flex flex-col space-y-3">
              <Link
                href="/platform"
                className="text-gray-300 hover:text-blue-400 transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Platform
              </Link>
              <Link
                href="/solutions"
                className="text-gray-300 hover:text-blue-400 transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Solutions
              </Link>
              <Link
                href="/conference"
                className="text-gray-300 hover:text-blue-400 transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Conference
              </Link>
              <Link
                href="/ai-coding-suite"
                className="text-gray-300 hover:text-blue-400 transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                AI Suite
              </Link>
              <Link
                href="/project-spectra"
                className="text-gray-300 hover:text-amber-400 transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Project Spectra
              </Link>
              <Link
                href="/contact"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium text-center mt-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}