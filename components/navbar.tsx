"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Brain } from "lucide-react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-[#F5F7FA] z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-[#1E90FF]" />
            <span className="text-xl font-bold text-[#4A4A4A]">Genomic Twin</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/clinical-features" className="text-[#4A4A4A] hover:text-[#1E90FF] transition-colors">
              Clinical Features
            </Link>
            <Link href="/healthcare-pricing" className="text-[#4A4A4A] hover:text-[#1E90FF] transition-colors">
              Healthcare Plans
            </Link>
            <Link href="/research" className="text-[#4A4A4A] hover:text-[#1E90FF] transition-colors">
              Research
            </Link>
            <Link href="/contact" className="text-[#4A4A4A] hover:text-[#1E90FF] transition-colors">
              Contact
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="text-[#4A4A4A] hover:text-[#1E90FF]">
                Provider Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-[#1E90FF] hover:bg-[#1E90FF]/90 text-white">Start Trial</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="text-[#4A4A4A]">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-[#F5F7FA]">
              <Link
                href="/clinical-features"
                className="block px-3 py-2 text-[#4A4A4A] hover:text-[#1E90FF] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Clinical Features
              </Link>
              <Link
                href="/healthcare-pricing"
                className="block px-3 py-2 text-[#4A4A4A] hover:text-[#1E90FF] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Healthcare Plans
              </Link>
              <Link
                href="/research"
                className="block px-3 py-2 text-[#4A4A4A] hover:text-[#1E90FF] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Research
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 text-[#4A4A4A] hover:text-[#1E90FF] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              <div className="pt-4 space-y-2">
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full text-[#4A4A4A] hover:text-[#1E90FF]">
                    Provider Login
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-[#1E90FF] hover:bg-[#1E90FF]/90 text-white">Start Trial</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
